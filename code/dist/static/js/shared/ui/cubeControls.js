import { getMaxCubes } from "../config/loader.js";
function getElements() {
    return {
        countInput: document.getElementById('cube-count'),
        wireframeCheckbox: document.getElementById('wireframe'),
        colorInput: document.getElementById('cube-color'),
        createBtn: document.getElementById('create-btn'),
        clearBtn: document.getElementById('clear-btn'),
        cubeCountDisplay: document.getElementById('cube-count-display'),
        maxCubesDisplay: document.getElementById('max-cubes')
    };
}
export function setupCubeControls(cubeManager) {
    const elements = getElements();
    const maxCubes = getMaxCubes();
    // Afficher la limite max
    if (elements.maxCubesDisplay) {
        elements.maxCubesDisplay.textContent = maxCubes.toString();
    }
    // Bouton creer
    elements.createBtn.addEventListener('click', () => {
        const currentCount = cubeManager.getCount();
        let count = parseInt(elements.countInput.value) || 1;
        // Verifier la limite
        if (currentCount >= maxCubes) {
            alert(`Limite atteinte ! Maximum ${maxCubes} cubes.`);
            return;
        }
        // Ajuster si depasse la limite
        if (currentCount + count > maxCubes) {
            count = maxCubes - currentCount;
            alert(`Seulement ${count} cube(s) ajoute(s) pour respecter la limite de ${maxCubes}.`);
        }
        const wireframe = elements.wireframeCheckbox.checked;
        const color = elements.colorInput.value;
        cubeManager.createCubes(count, wireframe, color);
        updateDisplay(cubeManager);
    });
    // Bouton supprimer tout
    elements.clearBtn.addEventListener('click', () => {
        cubeManager.clearAll();
        updateDisplay(cubeManager);
    });
}
export function updateDisplay(cubeManager) {
    const elements = getElements();
    elements.cubeCountDisplay.textContent = cubeManager.getCount().toString();
}
