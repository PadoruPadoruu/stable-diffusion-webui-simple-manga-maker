
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
providerRegistry.mapApiMode(apis.COMFYUI,'localComfyUI');
providerRegistry.mapApiMode(apis.A1111,'localSDWebUI');
providerRegistry.syncFromApiMode(apiMode);

setInterval(apiHeartbeat,1000*15);
$('apiHeartbeatCheckbox').addEventListener('change',function () {
apiHeartbeat();
});
apiHeartbeat();
});
