import { DOM } from '../../shared/index.ts';

/**
 * Interface des elements UI pour la lecon 11
 */
export interface UIElements {
	glbModeToggle: HTMLInputElement;
	speed: HTMLInputElement;
	speedValue: HTMLElement;
	normalizeToggle: HTMLInputElement;
	boundariesToggle: HTMLInputElement;
	resetBtn: HTMLButtonElement;
	// Affichage des touches
	keyZ: HTMLElement;
	keyQ: HTMLElement;
	keyS: HTMLElement;
	keyD: HTMLElement;
	keySpace: HTMLElement;
	keyShift: HTMLElement;
	// Position
	posX: HTMLElement;
	posY: HTMLElement;
	posZ: HTMLElement;
}

/**
 * Recupere tous les elements UI
 */
export function getUIElements(): UIElements {
	return {
		glbModeToggle: DOM.input('glb-mode-toggle'),
		speed: DOM.input('speed'),
		speedValue: DOM.element('speed-value'),
		normalizeToggle: DOM.input('normalize-toggle'),
		boundariesToggle: DOM.input('boundaries-toggle'),
		resetBtn: DOM.button('reset-btn'),
		keyZ: DOM.element('key-z'),
		keyQ: DOM.element('key-q'),
		keyS: DOM.element('key-s'),
		keyD: DOM.element('key-d'),
		keySpace: DOM.element('key-space'),
		keyShift: DOM.element('key-shift'),
		posX: DOM.element('pos-x'),
		posY: DOM.element('pos-y'),
		posZ: DOM.element('pos-z')
	};
}

/**
 * Met a jour l'affichage des touches actives
 */
export function updateKeyDisplay(
	ui: UIElements,
	keys: { z: boolean; q: boolean; s: boolean; d: boolean; space: boolean; shift: boolean }
): void {
	ui.keyZ.classList.toggle('active', keys.z);
	ui.keyQ.classList.toggle('active', keys.q);
	ui.keyS.classList.toggle('active', keys.s);
	ui.keyD.classList.toggle('active', keys.d);
	ui.keySpace.classList.toggle('active', keys.space);
	ui.keyShift.classList.toggle('active', keys.shift);
}

/**
 * Met a jour l'affichage de la position
 */
export function updatePositionDisplay(ui: UIElements, x: number, y: number, z: number): void {
	ui.posX.textContent = x.toFixed(2);
	ui.posY.textContent = y.toFixed(2);
	ui.posZ.textContent = z.toFixed(2);
}
