import { DOM } from '../../shared/index.ts';

/**
 * Interface des elements UI pour la lecon 09
 */
export interface UIElements {
	preset: HTMLSelectElement;
	count: HTMLInputElement;
	countValue: HTMLElement;
	size: HTMLInputElement;
	sizeValue: HTMLElement;
	color: HTMLInputElement;
	speed: HTMLInputElement;
	speedValue: HTMLElement;
	rotateToggle: HTMLInputElement;
	transparentToggle: HTMLInputElement;
	triggerBtn: HTMLButtonElement;
	resetBtn: HTMLButtonElement;
	particleCount: HTMLElement;
}

/**
 * Recupere tous les elements UI
 */
export function getUIElements(): UIElements {
	return {
		preset: DOM.element('preset') as HTMLSelectElement,
		count: DOM.input('count'),
		countValue: DOM.element('count-value'),
		size: DOM.input('size'),
		sizeValue: DOM.element('size-value'),
		color: DOM.input('color'),
		speed: DOM.input('speed'),
		speedValue: DOM.element('speed-value'),
		rotateToggle: DOM.input('rotate-toggle'),
		transparentToggle: DOM.input('transparent-toggle'),
		triggerBtn: DOM.button('trigger-btn'),
		resetBtn: DOM.button('reset-btn'),
		particleCount: DOM.element('particle-count')
	};
}

/**
 * Type de preset disponible
 */
export type PresetType = 'galaxy' | 'snow' | 'fire' | 'fountain' | 'explosion';
