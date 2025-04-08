document.addEventListener("DOMContentLoaded", function () {
  // Only call toggleVisibility if the element exists
  const initialElement = $("svg-container-vertical");
  if (initialElement) {
    toggleVisibility("svg-container-vertical");
  }
});

function toggleVisibility(id) {
  // Early return if element doesn't exist
  const element = $(id);
  if (!element) {
    console.warn(`Element with id "${id}" not found`);
    return;
  }

  // Safely handle icons
  const icons = document.querySelectorAll("#sidebar i");
  icons.forEach((icon) => {
    const onclickAttr = icon.getAttribute("onclick");
    if (onclickAttr && onclickAttr.includes(`toggleVisibility('${id}')`)) {
      icon.classList.toggle("active", element.style.display === "none");
    } else {
      icon.classList.remove("active");
    }
  });

  // List of all panel IDs
  const panelIds = [
    "svg-container-vertical",
    "svg-container-landscape",
    "panel-manager-area",
    "custom-panel-manager-area",
    "auto-generate-area",
    "prompt-manager-area",
    "speech-bubble-area1",
    "speech-bubble-area2",
    "text-area",
    "text-area2",
    "tool-area",
    "manga-tone-area",
    "rough-manager-area",
    "manga-effect-area",
    "shape-area",
    "controle-area"
  ];

  // Safely hide all panels
  panelIds.forEach(panelId => {
    const panel = $(panelId);
    if (panel) {
      panel.style.display = "none";
    }
  });

  // Toggle the target element
  if (element.style.display === "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }

  // Only call adjustCanvasSize if it exists
  if (typeof adjustCanvasSize === 'function') {
    adjustCanvasSize();
  }
}
