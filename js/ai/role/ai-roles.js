// AIロール定義とロール判定
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
FAL_AI: [
AI_ROLES.Text2Image,
AI_ROLES.Image2Image,
AI_ROLES.Upscaler,
AI_ROLES.RemoveBG
]
};

const ROLE_ASSIGNABLE_ROLES=[
AI_ROLES.Text2Image,
AI_ROLES.Image2Image,
AI_ROLES.Inpaint,
AI_ROLES.Upscaler,
AI_ROLES.RemoveBG,
AI_ROLES.I2I_Angle
];

function hasNotRole(role) {
return!(hasRole(role));
}

function hasRole(role) {
if(providerRegistry.getProviderForRole(role)!==null){
return true;
}
return false;
}
