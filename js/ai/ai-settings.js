
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
providerRegistry.mapApiMode(apis.COMFYUI,'localComfyUI');
providerRegistry.mapApiMode(apis.A1111,'localSDWebUI');
providerRegistry.mapApiMode(apis.RUNPOD_COMFYUI,'runpodComfyUI');
providerRegistry.mapApiMode(apis.RUNPOD_ENDPOINT,'runpodEndpoint');
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

setInterval(apiHeartbeat,1000*15);
$('apiHeartbeatCheckbox').addEventListener('change',function () {
apiHeartbeat();
});
apiHeartbeat();
});
