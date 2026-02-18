// RunPod Serverless Endpointプロバイダー: ジョブ投入→ポーリングで画像生成
class RunPodEndpointProvider extends AIProvider{
constructor(){
super('runpodEndpoint','RunPod Endpoint');
this._pollingInterval=2000;
}
getSupportedRoles(){
return[
AI_ROLES.Text2Image
];
}
needsApiKey(){
return true;
}
getApiKey(){
var el=$('runpodEndpointApiKey');
return el?el.value:'';
}
getEndpointUrl(){
var endpointId=$('runpodEndpointId').value;
if(!endpointId)return'';
return'https://api.runpod.ai/v2/'+endpointId;
}
_getTimeout(){
var el=$('runpodEndpointTimeout');
var val=el?parseInt(el.value):120;
return(isNaN(val)||val<10)?120:val;
}
_authHeaders(){
var apiKey=this.getApiKey();
if(!apiKey)return{};
return{
'Authorization':'Bearer '+apiKey,
'Content-Type':'application/json'
};
}
async heartbeat(){
var baseUrl=this.getEndpointUrl();
if(!baseUrl||!this.getApiKey()){
this._updateHeartbeatLabel(false);
return false;
}
try{
var response=await fetch(baseUrl+'/health',{
method:'GET',
headers:this._authHeaders()
});
this._updateHeartbeatLabel(response.ok);
return response.ok;
}catch(error){
this._logger.error('Heartbeat error:',error.message||error);
this._updateHeartbeatLabel(false);
return false;
}
}
_updateHeartbeatLabel(isOn){
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
async _submitJob(inputData){
var baseUrl=this.getEndpointUrl();
if(!baseUrl)throw new Error('Endpoint ID is not set');
var response=await fetch(baseUrl+'/run',{
method:'POST',
headers:this._authHeaders(),
body:JSON.stringify({input:inputData})
});
if(!response.ok){
var errorText=await response.text();
throw new Error('RunPod job submit failed: '+response.status+' '+errorText);
}
return response.json();
}
async _pollStatus(jobId){
var baseUrl=this.getEndpointUrl();
var timeoutMs=this._getTimeout()*1000;
var startTime=Date.now();
while(true){
if(Date.now()-startTime>timeoutMs){
throw new Error('RunPod job timed out after '+this._getTimeout()+'s');
}
await new Promise(r=>setTimeout(r,this._pollingInterval));
var response=await fetch(baseUrl+'/status/'+jobId,{
method:'GET',
headers:this._authHeaders()
});
if(!response.ok){
throw new Error('RunPod status check failed: '+response.status);
}
var data=await response.json();
if(data.status==='COMPLETED'){
return data.output;
}else if(data.status==='FAILED'){
throw new Error('RunPod job failed: '+(data.error||'unknown error'));
}
}
}
async _cancelJob(jobId){
var baseUrl=this.getEndpointUrl();
if(!baseUrl||!jobId)return;
try{
await fetch(baseUrl+'/cancel/'+jobId,{
method:'POST',
headers:this._authHeaders()
});
}catch(e){
this._logger.error('Cancel failed:',e);
}
}
async executeT2I(layer,spinnerId){
var startTime=Date.now();
var requestData=baseRequestData(layer);
if(basePrompt.text2img_model!=''){
requestData['model']=basePrompt.text2img_model;
}
var inputData={
prompt:requestData.prompt,
negative_prompt:requestData.negative_prompt,
width:requestData.width,
height:requestData.height,
seed:requestData.seed,
num_inference_steps:requestData.steps,
guidance_scale:requestData.cfg_scale
};
if(requestData.model){
inputData.model=requestData.model;
}
if(requestData.sampler_name){
inputData.sampler_name=requestData.sampler_name;
}
if(requestData.scheduler){
inputData.scheduler=requestData.scheduler;
}
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
await registerGenerationTask(canvasGuid,{
layerGuid:getGUID(layer),
layerType:layerType,
centerX:center.centerX,
centerY:center.centerY,
targetLayerGuid:targetLayerGuid
});
return runpodEndpointQueue.add(async()=>{
setCurrentAiTask(spinnerId);
var jobResult=await this._submitJob(inputData);
var jobId=jobResult.id;
try{
var output=await this._pollStatus(jobId);
if(!output||!output.images||output.images.length===0){
throw new Error('RunPod returned no images');
}
var base64=output.images[0];
if(!base64.startsWith('data:')){
base64='data:image/png;base64,'+base64;
}
return new Promise((resolve,reject)=>{
fabric.Image.fromURL(base64,(img)=>{
if(img)resolve(img);
else reject(new Error('Failed to create fabric.Image'));
});
});
}catch(error){
this._cancelJob(jobId);
throw error;
}
})
.then(async(result)=>{
if(result){
DashboardUI.recordGeneration('T2I',Date.now()-startTime,requestData.prompt||'',requestData.model||'');
if(isPageChanged(canvasGuid)){
var applied=await applyGeneratedImageToOriginalPage(canvasGuid,result);
if(applied)return;
}
removeGenerationTask(canvasGuid);
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
replaceImageObject(layer,result,'T2I');
}
}
})
.catch((error)=>{
removeGenerationTask(canvasGuid);
DashboardUI.recordFailure('T2I');
createToastError('RunPod Error',error.message,15000);
this._logger.error('T2I error:',error.message||error);
})
.finally(()=>{
removeSpinner(spinnerId);
});
}
}
