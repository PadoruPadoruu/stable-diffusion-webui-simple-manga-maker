
let comfyUI=null;
let comfyUIUrls=null;

let sdWebUI=null;
let sdWebUIUrls=null;


document.addEventListener('DOMContentLoaded',()=>{
sdWebUI=new SDWebUIEndpoints();
sdWebUIUrls=sdWebUI.urls;

comfyUI=new ComfyUIEndpoints();
comfyUIUrls=comfyUI.urls;

providerRegistry.register(new LocalComfyUIProvider());
providerRegistry.register(new LocalSDWebUIProvider());
providerRegistry.register(new RunPodComfyUIProvider());
providerRegistry.register(new RunPodEndpointProvider());
providerRegistry.register(new FalAIProvider());
providerRegistry.mapApiMode(apis.COMFYUI,'localComfyUI');
providerRegistry.mapApiMode(apis.A1111,'localSDWebUI');
providerRegistry.mapApiMode(apis.RUNPOD_COMFYUI,'runpodComfyUI');
providerRegistry.mapApiMode(apis.RUNPOD_ENDPOINT,'runpodEndpoint');
providerRegistry.mapApiMode(apis.FAL_AI,'falai');
providerRegistry.syncFromApiMode(apiMode);

$('runpodComfyUIUrlClear').addEventListener('click',function(event){
event.stopPropagation();
$('runpodComfyUIUrl').value='';
});
$('runpodApiKeyToggle').addEventListener('click',function(event){
event.stopPropagation();
var input=$('runpodApiKey');
input.type=input.type==='password'?'text':'password';
});
$('runpodEndpointIdClear').addEventListener('click',function(event){
event.stopPropagation();
$('runpodEndpointId').value='';
});
$('runpodEndpointApiKeyToggle').addEventListener('click',function(event){
event.stopPropagation();
var input=$('runpodEndpointApiKey');
input.type=input.type==='password'?'text':'password';
});
$('falaiApiKeyToggle').addEventListener('click',function(event){
event.stopPropagation();
var input=$('falaiApiKey');
input.type=input.type==='password'?'text':'password';
});

var falaiProvider=providerRegistry.get('falai');
$('falaiApiKey').addEventListener('change',function(){
if(!falaiProvider)return;
if(this.value.trim()){
falaiProvider.clearModelCache();
falaiProvider.fetchModels();
}else{
falaiProvider.clearModelCache();
falaiProvider._enableSelects(false);
}
});
$('falaiReloadModels').addEventListener('click',function(event){
event.stopPropagation();
if(!falaiProvider)return;
if($('falaiApiKey').value.trim()){
falaiProvider.fetchModels();
}
});
var falaiSearchUrls={
falaiModelT2I:'https://fal.ai/explore/search?categories=text-to-image',
falaiModelI2I:'https://fal.ai/explore/search?categories=image-to-image',
falaiModelUpscale:'https://fal.ai/explore/search?q=upscale&categories=image-to-image',
falaiModelRembg:'https://fal.ai/explore/search?q=remove+background&categories=image-to-image'
};
document.querySelectorAll('.falai-list-btn').forEach(function(btn){
btn.addEventListener('click',function(event){
event.stopPropagation();
var selectId=btn.getAttribute('data-select');
window.open(falaiSearchUrls[selectId]||'https://fal.ai/explore','_blank');
});
});
document.querySelectorAll('.falai-model-btn').forEach(function(btn){
btn.addEventListener('click',function(event){
event.stopPropagation();
var selectId=btn.getAttribute('data-select');
var el=$(selectId);
if(el&&el.value){
window.open('https://fal.ai/models/'+el.value.split('/').map(encodeURIComponent).join('/'),'_blank');
}
});
});
function updateFalaiModelBtnVisibility(selectId){
var el=$(selectId);
var btn=document.querySelector('.falai-model-btn[data-select="'+selectId+'"]');
if(!btn)return;
btn.style.display=el&&el.value?'inline-block':'none';
}
['falaiModelT2I','falaiModelI2I','falaiModelUpscale','falaiModelRembg'].forEach(function(id){
$(id).addEventListener('change',function(){updateFalaiModelBtnVisibility(id);});
updateFalaiModelBtnVisibility(id);
});

setInterval(apiHeartbeat,1000*15);
$('apiHeartbeatCheckbox').addEventListener('change',function () {
apiHeartbeat();
});
apiHeartbeat();
});
