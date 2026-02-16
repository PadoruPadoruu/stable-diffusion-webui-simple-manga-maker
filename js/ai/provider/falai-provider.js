// Fal.aiクラウドAIプロバイダー: Queue APIで非同期実行（T2I/I2I/Upscale/RemoveBG）
class FalAIProvider extends AIProvider{
constructor(){
super('falai','Fal.ai');
this._pollingInterval=2000;
this._timeout=180;
}
getSupportedRoles(){
return[
AI_ROLES.Text2Image,
AI_ROLES.Image2Image,
AI_ROLES.Upscaler,
AI_ROLES.RemoveBG
];
}
needsApiKey(){
return true;
}
getApiKey(){
var el=$('falaiApiKey');
return el?el.value:'';
}
getEndpointUrl(){
return'https://queue.fal.run';
}
_getModelId(role){
var map={
t2i:{id:'falaiModelT2I',fallback:'fal-ai/flux/schnell'},
i2i:{id:'falaiModelI2I',fallback:'fal-ai/image-to-image'},
upscale:{id:'falaiModelUpscale',fallback:'fal-ai/creative-upscaler'},
rembg:{id:'falaiModelRembg',fallback:'fal-ai/birefnet'}
};
var entry=map[role];
if(!entry)return'';
var el=$(entry.id);
var val=el?el.value.trim():'';
return val||entry.fallback;
}
_authHeaders(){
var apiKey=this.getApiKey();
if(!apiKey)return{};
return{
'Authorization':'Key '+apiKey,
'Content-Type':'application/json'
};
}
async heartbeat(){
if(!this.getApiKey()){
this._updateLabel(false);
return false;
}
this._updateLabel(true);
return true;
}
_updateLabel(isOn){
var label=$('ExternalService_Heartbeat_Label');
var labelfw=$('ExternalService_Heartbeat_Label_fw');
var text=this.name+(isOn?' ON':' OFF');
var color=isOn?'green':'red';
if(label){
label.innerHTML=text;
label.style.color=color;
}
if(labelfw){
labelfw.innerHTML=text;
labelfw.style.color=color;
}
}
async _submitQueue(modelId,inputData){
var apiKey=this.getApiKey();
if(!apiKey)throw new Error('Fal.ai API Key is not set');
var url='https://queue.fal.run/'+modelId;
var response=await fetch(url,{
method:'POST',
headers:this._authHeaders(),
body:JSON.stringify(inputData)
});
if(!response.ok){
var errorText=await response.text();
throw new Error('Fal.ai submit failed: '+response.status+' '+errorText);
}
return response.json();
}
async _pollStatus(modelId,requestId){
var url='https://queue.fal.run/'+modelId+'/requests/'+requestId+'/status';
var timeoutMs=this._timeout*1000;
var startTime=Date.now();
while(true){
if(Date.now()-startTime>timeoutMs){
throw new Error('Fal.ai job timed out after '+this._timeout+'s');
}
await new Promise(r=>setTimeout(r,this._pollingInterval));
var response=await fetch(url,{
method:'GET',
headers:this._authHeaders()
});
if(!response.ok){
throw new Error('Fal.ai status check failed: '+response.status);
}
var data=await response.json();
if(data.status==='COMPLETED'){
return this._fetchResult(modelId,requestId);
}else if(data.status==='FAILED'){
throw new Error('Fal.ai job failed: '+(data.error||'unknown error'));
}
}
}
async _fetchResult(modelId,requestId){
var url='https://queue.fal.run/'+modelId+'/requests/'+requestId;
var response=await fetch(url,{
method:'GET',
headers:this._authHeaders()
});
if(!response.ok){
throw new Error('Fal.ai result fetch failed: '+response.status);
}
return response.json();
}
async _cancelJob(modelId,requestId){
if(!modelId||!requestId)return;
try{
var url='https://queue.fal.run/'+modelId+'/requests/'+requestId+'/cancel';
await fetch(url,{
method:'PUT',
headers:this._authHeaders()
});
}catch(e){
this._logger.error('Cancel failed:',e);
}
}
async _imageUrlToFabric(imageUrl){
var response=await fetch(imageUrl);
if(!response.ok)throw new Error('Image fetch failed: '+response.status);
var blob=await response.blob();
return new Promise((resolve,reject)=>{
var reader=new FileReader();
reader.onload=function(){
fabric.Image.fromURL(reader.result,(img)=>{
if(img)resolve(img);
else reject(new Error('Failed to create fabric.Image'));
});
};
reader.onerror=()=>reject(new Error('FileReader error'));
reader.readAsDataURL(blob);
});
}
async _outputToFabricImage(output){
if(output.images&&output.images.length>0){
var img=output.images[0];
if(img.url)return this._imageUrlToFabric(img.url);
}
if(output.image&&output.image.url){
return this._imageUrlToFabric(output.image.url);
}
throw new Error('Fal.ai returned no images');
}
_registerTask(layer){
var canvasGuid=getCanvasGUID();
var layerType='unknown';
var targetLayerGuid=null;
if(isPanel(layer)){
layerType='panel';
targetLayerGuid=getGUID(layer);
}else if(layer.clipPath){
layerType='clipPath';
targetLayerGuid=layer.relatedPoly?getGUID(layer.relatedPoly):getGUID(layer);
}else{
layerType='standalone';
}
var center=calculateCenter(layer);
registerGenerationTask(canvasGuid,{
layerGuid:getGUID(layer),
layerType:layerType,
centerX:center.centerX,
centerY:center.centerY,
targetLayerGuid:targetLayerGuid
});
return canvasGuid;
}
_placeResult(result,layer,canvasGuid,Type){
if(isPageChanged(canvasGuid)){
return applyGeneratedImageToOriginalPage(canvasGuid,result).then(applied=>{
if(!applied){
removeGenerationTask(canvasGuid);
this._placeOnCanvas(result,layer,Type);
}
});
}
removeGenerationTask(canvasGuid);
this._placeOnCanvas(result,layer,Type);
}
_placeOnCanvas(result,layer,Type){
if(isPanel(layer)){
var c=calculateCenter(layer);
putImageInFrame(result,c.centerX,c.centerY,false,false,true,layer);
}else if(layer.clipPath){
var c=calculateCenter(layer);
var targetParent=layer.relatedPoly||layer;
layer.saveHistory=false;
canvas.remove(layer);
putImageInFrame(result,c.centerX,c.centerY,false,false,true,targetParent);
}else{
layer.saveHistory=false;
canvas.remove(layer);
replaceImageObject(layer,result,Type);
}
}
async _execute(layer,spinnerId,Type,modelId,buildInput){
var startTime=Date.now();
var canvasGuid=this._registerTask(layer);
return falaiQueue.add(async()=>{
var inputData=buildInput();
var job=await this._submitQueue(modelId,inputData);
var requestId=job.request_id;
try{
var output=await this._pollStatus(modelId,requestId);
return this._outputToFabricImage(output);
}catch(error){
this._cancelJob(modelId,requestId);
throw error;
}
})
.then(async(result)=>{
if(result){
DashboardUI.recordGeneration(Type,Date.now()-startTime,'',modelId);
this._placeResult(result,layer,canvasGuid,Type);
}
})
.catch((error)=>{
removeGenerationTask(canvasGuid);
DashboardUI.recordFailure(Type);
createToastError('Fal.ai Error',error.message,8000);
this._logger.error(Type+' error:',error);
})
.finally(()=>{
removeSpinner(spinnerId);
});
}
async executeT2I(layer,spinnerId){
var modelId=this._getModelId('t2i');
var self=this;
return this._execute(layer,spinnerId,'T2I',modelId,()=>{
var rd=baseRequestData(layer);
if(basePrompt.text2img_model!=''){
rd['model']=basePrompt.text2img_model;
}
return{
prompt:rd.prompt,
negative_prompt:rd.negative_prompt,
image_size:{width:rd.width,height:rd.height},
num_inference_steps:rd.steps,
guidance_scale:rd.cfg_scale,
seed:rd.seed>0?rd.seed:undefined
};
});
}
async executeI2I(layer,spinnerId){
var modelId=this._getModelId('i2i');
return this._execute(layer,spinnerId,'I2I',modelId,()=>{
var rd=baseRequestData(layer);
var base64Image=imageObject2Base64ImageEffectKeep(layer);
return{
prompt:rd.prompt,
negative_prompt:rd.negative_prompt,
image_url:base64Image,
strength:layer.img2img_denoise||0.75,
image_size:{width:rd.width,height:rd.height},
num_inference_steps:rd.steps,
guidance_scale:rd.cfg_scale,
seed:rd.seed>0?rd.seed:undefined
};
});
}
async executeUpscale(layer,spinnerId){
var modelId=this._getModelId('upscale');
return this._execute(layer,spinnerId,'Upscaler',modelId,()=>{
var base64Image=imageObject2Base64ImageEffectKeep(layer);
return{
image_url:base64Image
};
});
}
async executeRembg(layer,spinnerId){
var modelId=this._getModelId('rembg');
return this._execute(layer,spinnerId,'Rembg',modelId,()=>{
var base64Image=imageObject2Base64ImageEffectKeep(layer);
return{
image_url:base64Image
};
});
}
}
