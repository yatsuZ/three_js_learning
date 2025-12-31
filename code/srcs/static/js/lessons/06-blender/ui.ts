/**
 * Lecon 06 - Gestion de l'interface utilisateur
 */

import { DOM } from '../../shared/index.ts';

/**
 * Elements UI de la lecon 06
 */
export interface UIElements {
	uploadInput: HTMLInputElement;
	modelName: HTMLElement;
	animCount: HTMLElement;
	loading: HTMLElement;
	autoRotate: HTMLInputElement;
	rotationSpeed: HTMLInputElement;
	ambientSlider: HTMLInputElement;
	pointSlider: HTMLInputElement;
	directionalSlider: HTMLInputElement;
	showGrid: HTMLInputElement;
	wireframe: HTMLInputElement;
	enhanceMaterials: HTMLInputElement;
	bgColor: HTMLInputElement;
	animSpeed: HTMLInputElement;
	modelScale: HTMLInputElement;
	resetBtn: HTMLButtonElement;
}

/**
 * Valeurs par defaut des controles
 */
export const DEFAULT_VALUES = {
	autoRotate: true,
	rotationSpeed: 1,
	ambientIntensity: 1.2,
	pointIntensity: 2,
	directionalIntensity: 1.5,
	showGrid: true,
	wireframe: false,
	enhanceMaterials: false,
	bgColor: '#1a1a2e',
	animSpeed: 1,
	modelScale: 3
} as const;

/**
 * Recupere tous les elements UI du DOM
 */
export function getUIElements(): UIElements {
	return {
		uploadInput: DOM.input('model-upload'),
		modelName: DOM.element('model-name'),
		animCount: DOM.element('anim-count'),
		loading: DOM.element('loading'),
		autoRotate: DOM.input('auto-rotate'),
		rotationSpeed: DOM.input('rotation-speed'),
		ambientSlider: DOM.input('ambient-intensity'),
		pointSlider: DOM.input('point-intensity'),
		directionalSlider: DOM.input('directional-intensity'),
		showGrid: DOM.input('show-grid'),
		wireframe: DOM.input('wireframe-mode'),
		enhanceMaterials: DOM.input('enhance-materials'),
		bgColor: DOM.input('bg-color'),
		animSpeed: DOM.input('anim-speed'),
		modelScale: DOM.input('model-scale'),
		resetBtn: DOM.button('reset-btn')
	};
}

/**
 * Remet les controles UI aux valeurs par defaut
 */
export function resetUIValues(ui: UIElements): void {
	ui.autoRotate.checked = DEFAULT_VALUES.autoRotate;
	ui.rotationSpeed.value = String(DEFAULT_VALUES.rotationSpeed);
	ui.ambientSlider.value = String(DEFAULT_VALUES.ambientIntensity);
	ui.pointSlider.value = String(DEFAULT_VALUES.pointIntensity);
	ui.directionalSlider.value = String(DEFAULT_VALUES.directionalIntensity);
	ui.showGrid.checked = DEFAULT_VALUES.showGrid;
	ui.wireframe.checked = DEFAULT_VALUES.wireframe;
	ui.enhanceMaterials.checked = DEFAULT_VALUES.enhanceMaterials;
	ui.bgColor.value = DEFAULT_VALUES.bgColor;
	ui.animSpeed.value = String(DEFAULT_VALUES.animSpeed);
	ui.modelScale.value = String(DEFAULT_VALUES.modelScale);
}
