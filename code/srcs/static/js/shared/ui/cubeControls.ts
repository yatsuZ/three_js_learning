import { CubeManager } from '../core/cubeManager.ts';
import { getMaxCubes } from '../config/loader.ts';
import { Logger } from '../utils/logger.ts';
import { DOM } from '../utils/dom.ts';

/**
 * Valide et normalise une valeur de comptage de cubes
 */
function validateCubeCount(value: string, max: number): number {
	const num = parseInt(value, 10);
	if (isNaN(num) || num < 1) return 1;
	if (num > max) return max;
	return num;
}

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
		countInput: DOM.input('cube-count'),
		wireframeCheckbox: DOM.input('wireframe'),
		colorInput: DOM.input('cube-color'),
		createBtn: DOM.button('create-btn'),
		clearBtn: DOM.button('clear-btn'),
		cubeCountDisplay: DOM.element('cube-count-display'),
		maxCubesDisplay: DOM.elementOrNull('max-cubes')
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
		let count = validateCubeCount(elements.countInput.value, maxCubes);

		// Verifier la limite
		if (currentCount >= maxCubes) {
			Logger.warn(`Limite atteinte: ${maxCubes} cubes maximum`);
			alert(`Limite atteinte ! Maximum ${maxCubes} cubes.`);
			return;
		}

		// Ajuster si depasse la limite
		if (currentCount + count > maxCubes) {
			count = maxCubes - currentCount;
			Logger.info(`Ajustement: ${count} cube(s) pour respecter la limite`);
			alert(`Seulement ${count} cube(s) ajoute(s) pour respecter la limite de ${maxCubes}.`);
		}

		const wireframe = elements.wireframeCheckbox.checked;
		const color = elements.colorInput.value;

		cubeManager.createCubes(count, wireframe, color);
		updateDisplay(cubeManager);
		Logger.debug(`Cubes crees: ${count}, total: ${cubeManager.getCount()}`);
	});

	// Bouton supprimer tout
	elements.clearBtn.addEventListener('click', () => {
		const previousCount = cubeManager.getCount();
		cubeManager.clearAll();
		updateDisplay(cubeManager);
		Logger.info(`${previousCount} cube(s) supprime(s)`);
	});
}

export function updateDisplay(cubeManager: CubeManager): void {
	const elements = getElements();
	elements.cubeCountDisplay.textContent = cubeManager.getCount().toString();
}
