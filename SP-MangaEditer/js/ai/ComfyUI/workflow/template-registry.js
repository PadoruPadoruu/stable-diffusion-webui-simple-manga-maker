// Template Registry System
const workflowTemplates = {
  // Built-in templates
  "T2I_Flux": {
    getTemplate: getComfyUI_T2I_ByFluxSimple,
    modelNode: "30",
    clipNode: "11",
    usesSeparateClip: true
  },
  "T2I_SDXL": {
    getTemplate: getComfyUI_T2I_BySDXL,
    modelNode: "2",
    clipNode: null,
    usesSeparateClip: false
  },
  "T2I_SD15": {
    getTemplate: getComfyUI_T2I_BySD15,
    modelNode: "2",
    clipNode: null,
    usesSeparateClip: false
  }
};

// Function to register a new template
function registerWorkflowTemplate(name, config) {
  if (!name || !config || !config.getTemplate) {
    console.error("Invalid template configuration");
    return false;
  }

  workflowTemplates[name] = {
    getTemplate: config.getTemplate,
    modelNode: config.modelNode || null,
    clipNode: config.clipNode || null,
    usesSeparateClip: config.usesSeparateClip || false
  };
  return true;
}

// Function to get template configuration
function getTemplateConfig(workflowType) {
  return workflowTemplates[workflowType] || null;
}

// Function to get all available template names
function getAvailableTemplates() {
  return Object.keys(workflowTemplates);
}

// Function to check if a template exists
function hasTemplate(workflowType) {
  return workflowType in workflowTemplates;
} 