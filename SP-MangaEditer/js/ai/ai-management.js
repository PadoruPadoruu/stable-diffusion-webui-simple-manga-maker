var firstComfyConnection = true;

// Wait for DOM to be fully loaded before setting up event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Setup default URL button for ComfyUI
  const comfyDefaultUrlBtn = $('comfyUIPageUrlDefaultUrl');
  const basePromptModel = $('basePrompt_model');
  const clipDropdown = $('clipDropdownId');

  if (comfyDefaultUrlBtn) {
    comfyDefaultUrlBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      const defaultUrl = 'http://127.0.0.1:8188';
      const urlInput = $('comfyUIPageUrl');
      if (urlInput) {
        urlInput.value = defaultUrl;
      }
    });
  }

  if (basePromptModel) {
    basePromptModel.addEventListener('change', function(event) {
      sendModelToComfyUI();
    });
  }

  if (clipDropdown) {
    clipDropdown.addEventListener('change', function(event) {
      sendClipToComfyUI();
    });
  }
});

function existsWaitQueue() {

  const comfyuiQueueStatus = sdQueue.getStatus();
  if( comfyuiQueueStatus.total > 0 ){
    return true;
  }
}


async function T2I( layer, spinner ){
 if (API_mode == apis.COMFYUI){
    return Comfyui_handle_process_queue(layer, spinner.id);
  }
}
function I2I( layer, spinner ){
  if (API_mode == apis.COMFYUI){
    Comfyui_handle_process_queue(layer, spinner.id, 'I2I');
  }
}

async function ai_rembg( layer, spinner ){
  if (API_mode == apis.COMFYUI){
    return Comfyui_handle_process_queue(layer, spinner.id, 'Rembg');
  }
}


function getDiffusionInfomation() {
if( API_mode == apis.COMFYUI ){
    Comfyui_FetchModels();
    Comfyui_FetchSampler();
    Comfyui_FetchUpscaler();
    Comfyui_VaeLoader();
    Comfyui_ClipModels();
    Comfyui_FetchObjectInfoOnly();
  }
}


function apiHeartbeat(){

console.log("apiHeartbeat");

  const pingCheck = $('apiHeartbeatCheckbox');
  if (pingCheck.checked) {
  } else {
    return;
  }

if(API_mode == apis.COMFYUI) {
    Comfyui_apiHeartbeat();
  }

  const label = $('ExternalService_Heartbeat_Label');
  let announce = $('checSD_WebUI_Announce');
  if(label.style.color === 'green') {
    announce.style.display = 'none';
  }
}


function updateUpscalerDropdown(models) {
  const modelDropdown = $('text2img_hr_upscaler');
  modelDropdown.innerHTML = '';
  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.name;
    option.textContent = model.name;

    if (basePrompt.text2img_hr_upscaler === model.name) {
      option.selected = true;
    }
    modelDropdown.appendChild(option);
  });
}

function updateSamplerDropdown(models) {
  const modelDropdown = $('basePrompt_samplingMethod');
  modelDropdown.innerHTML = '';
  basePrompt.text2img_samplingMethod

  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.name;
    option.textContent = model.name;

    if (basePrompt.text2img_samplingMethod === model.name) {
      option.selected = true;
    }
    modelDropdown.appendChild(option);
  });
}

function updateModelDropdown(models) {
  const modelDropdown = $('basePrompt_model');
  modelDropdown.innerHTML = '';
  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.title;
    option.textContent = model.model_name;

    if (basePrompt.text2img_model === removeHashStr(model.title)) {
      option.selected = true;
    }
    modelDropdown.appendChild(option);
  });
}

function updateVaeDropdown(models) {
  const dropdown = $('vaeDropdownId');
  dropdown.innerHTML = '';
  models.forEach(model => {
    console.log("updateVaeDropdown push ", model.name)
    const option = document.createElement('option');
    option.value = model.name;
    option.textContent = model.name;
    dropdown.appendChild(option);
  });
}

function removeHashStr(str) {
  return str.replace(/\s*\[[^\]]+\]\s*$/, '');
}

// ComfyUI model change handler
async function sendModelToComfyUI() {
  const modelValue = basePrompt.text2img_model;
  const workflowType = getSelectedValueByGroup("generateWorkflow");
  
  try {
    const templateConfig = getTemplateConfig(workflowType);
    if (!templateConfig) {
      console.warn("Unknown workflow type:", workflowType);
      return;
    }

    // Get the workflow template
    const workflow = templateConfig.getTemplate();

    // Update the model in the workflow if a model node is specified
    if (templateConfig.modelNode) {
      workflow[templateConfig.modelNode].inputs.ckpt_name = modelValue;
    }

    // Send the updated workflow to ComfyUI
    await Comfyui_UpdateWorkflow(workflow);
    createToast("Model Updated", `Successfully updated model to ${modelValue}`);
  } catch (error) {
    console.error("Failed to update model:", error);
    createToastError("Model Update Failed", error.message);
  }
}

// ComfyUI clip model change handler
async function sendClipToComfyUI() {
  const clipValue = getSelectedTagifyValues("clipDropdownId");
  const workflowType = getSelectedValueByGroup("generateWorkflow");
  
  try {
    const templateConfig = getTemplateConfig(workflowType);
    if (!templateConfig) {
      console.warn("Unknown workflow type:", workflowType);
      return;
    }

    // Get the workflow template
    const workflow = templateConfig.getTemplate();

    // Update the clip model in the workflow if needed
    if (templateConfig.usesSeparateClip && templateConfig.clipNode) {
      workflow[templateConfig.clipNode].inputs.clip_name1 = clipValue[0];
      workflow[templateConfig.clipNode].inputs.clip_name2 = clipValue[1] || clipValue[0];
    } else {
      console.log(`${workflowType} uses clip models from checkpoint`);
    }

    await Comfyui_UpdateWorkflow(workflow);
    createToast("Clip Model Updated", `Successfully updated clip model to ${clipValue.join(", ")}`);
  } catch (error) {
    console.error("Failed to update clip model:", error);
    createToastError("Clip Model Update Failed", error.message);
  }
}

// Example of how to register a new template
function registerCustomTemplate() {
  // Example template registration
  registerWorkflowTemplate("CUSTOM_TEMPLATE", {
    getTemplate: function() {
      return {
        // Your custom workflow template here
      };
    },
    modelNode: "2", // Node ID for model updates
    clipNode: "3",  // Node ID for clip updates
    usesSeparateClip: true
  });
}

// registerWorkflowTemplate("YOUR_TEMPLATE_NAME", {
//   getTemplate: yourTemplateFunction,
//   modelNode: "node_id_for_model",
//   clipNode: "node_id_for_clip",
//   usesSeparateClip: true/false
// });
