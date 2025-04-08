// Available api models
const apis = {
    COMFYUI: "comfyui"
};

// Shared configuration variables
let API_mode = localStorage.getItem('API_mode') || apis.COMFYUI;

// Initialize API mode in localStorage if not set
if (!localStorage.getItem('API_mode')) {
    localStorage.setItem('API_mode', apis.COMFYUI);
} 