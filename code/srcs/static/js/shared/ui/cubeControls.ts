import { CubeManager } from '../core/cubeManager.ts';
import { getMaxCubes } from '../config/loader.ts';

export interface CubeControlsElements {
	countInput: HTMLInputElement;
	wireframeCheckbox: HTMLInputElement;
	colorInput: HTMLInputElement;
	createBtn: HTMLButtonElement;
	clearBtn: HTMLButtonElement;
	cubeCountDisplay: HTMLElement;
	maxCubesDisplay: HTMLElement | null;
}

function getElements(): CubeControlsElements {
	return {
		countInput: document.getElementById('cube-count') as HTMLInputElement,
		wireframeCheckbox: document.getElementById('wireframe') as HTMLInputElement,
		colorInput: document.getElementById('cube-color') as HTMLInputElement,
		createBtn: document.getElementById('create-btn') as HTMLButtonElement,
		clearBtn: document.getElementById('clear-btn') as HTMLButtonElement,
		cubeCountDisplay: document.getElementById('cube-count-display') as HTMLElement,
		maxCubesDisplay: document.getElementById('max-cubes') as HTMLElement | null
	};
}

export function setupCubeControls(cubeManager: CubeManager): void {
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

export function updateDisplay(cubeManager: CubeManager): void {
	const elements = getElements();
	elements.cubeCountDisplay.textContent = cubeManager.getCount().toString();
}
