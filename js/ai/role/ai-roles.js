// if( hasNotRole( AI_ROLES.XXXXX )){return;}
// if( hasRole( AI_ROLES.XXXXX )){return;}

//WebUI : SDXL
//Forge : SDXL, Flux
//ComfyUI : SDXL, Flux

const AI_ROLES={
Text2Image: "Text2Image",
Image2Image: "Image2Image",
Image2Prompt_DEEPDOORU: "Image2Prompt_DEEPDOORU",
Image2Prompt_CLIP: "Image2Prompt_CLIP",
RemoveBG: "RemoveBG",
ADetailer: "ADetailer",
Upscaler: "Upscaler",
Inpaint: "Inpaint",
PutPrompt: "PutPrompt",
PutSeed: "PutSeed",
I2I_Angle: "I2I_Angle",
Temp: "Temp",
};

const roles={
A1111: [
AI_ROLES.Text2Image,
AI_ROLES.Image2Image,
AI_ROLES.Image2Prompt_DEEPDOORU,
AI_ROLES.Image2Prompt_CLIP,
AI_ROLES.RemoveBG,
AI_ROLES.ADetailer,
AI_ROLES.PutPrompt,
AI_ROLES.PutSeed
],
COMFYUI: [
AI_ROLES.Text2Image,
AI_ROLES.RemoveBG,
AI_ROLES.Upscaler,
AI_ROLES.Image2Image,
AI_ROLES.Inpaint,
AI_ROLES.I2I_Angle
],
RUNPOD_COMFYUI: [
AI_ROLES.Text2Image,
AI_ROLES.RemoveBG,
AI_ROLES.Upscaler,
AI_ROLES.Image2Image,
AI_ROLES.Inpaint,
AI_ROLES.I2I_Angle
],
RUNPOD_ENDPOINT: [
AI_ROLES.Text2Image
]
};

function hasNotRole(role) {
return!(hasRole(role));
}

function hasRole(role) {
if (apiMode==apis.A1111) {
return roles.A1111.includes(role);
} else if (apiMode==apis.COMFYUI) {
return roles.COMFYUI.includes(role);
} else if (apiMode==apis.RUNPOD_COMFYUI) {
return roles.RUNPOD_COMFYUI.includes(role);
} else if (apiMode==apis.RUNPOD_ENDPOINT) {
return roles.RUNPOD_ENDPOINT.includes(role);
}
return false;
}