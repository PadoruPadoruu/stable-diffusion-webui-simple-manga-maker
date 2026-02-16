
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
falaiProvider.fetchModels();
}else{
falaiProvider._enableSelects(false);
}
});
['T2I','I2I','Upscale','Rembg'].forEach(function(role){
$('falaiReload'+role).addEventListener('click',function(event){
event.stopPropagation();
if(!falaiProvider)return;
if($('falaiApiKey').value.trim()){
falaiProvider.fetchModels();
}
});
});

setInterval(apiHeartbeat,1000*15);
$('apiHeartbeatCheckbox').addEventListener('change',function () {
apiHeartbeat();
});
apiHeartbeat();
});
