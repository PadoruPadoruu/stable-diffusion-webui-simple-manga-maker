
let comfyUI = null;
let comfyUIUrls = null;


document.addEventListener('DOMContentLoaded', () => {
  comfyUI = new ComfyUIEndpoints();
  comfyUIUrls = comfyUI.urls;

  setInterval(apiHeartbeat, 1000 * 15);
  $('apiHeartbeatCheckbox').addEventListener('change', function () {
    apiHeartbeat();
  });
  apiHeartbeat();
});

