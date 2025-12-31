import { DOM } from '../../shared/index.ts';

/**
 * Interface des elements UI pour la lecon 10
 */
export interface UIElements {
	shape: HTMLSelectElement;
	mass: HTMLInputElement;
	massValue: HTMLElement;
	restitution: HTMLInputElement;
	restitutionValue: HTMLElement;
	friction: HTMLInputElement;
	frictionValue: HTMLElement;
	gravity: HTMLInputElement;
	gravityValue: HTMLElement;
	debugToggle: HTMLInputElement;
	soundToggle: HTMLInputElement;
	breakableToggle: HTMLInputElement;
	spawnBtn: HTMLButtonElement;
	rainBtn: HTMLButtonElement;
	clearBtn: HTMLButtonElement;
	resetBtn: HTMLButtonElement;
	exportBtn: HTMLButtonElement;
	objectCount: HTMLElement;
	maxObjects: HTMLElement;
}

/**
 * Recupere tous les elements UI
 */
export function getUIElements(): UIElements {
	return {
		shape: DOM.element('shape') as HTMLSelectElement,
		mass: DOM.input('mass'),
		massValue: DOM.element('mass-value'),
		restitution: DOM.input('restitution'),
		restitutionValue: DOM.element('restitution-value'),
		friction: DOM.input('friction'),
		frictionValue: DOM.element('friction-value'),
		gravity: DOM.input('gravity'),
		gravityValue: DOM.element('gravity-value'),
		debugToggle: DOM.input('debug-toggle'),
		soundToggle: DOM.input('sound-toggle'),
		breakableToggle: DOM.input('breakable-toggle'),
		spawnBtn: DOM.button('spawn-btn'),
		rainBtn: DOM.button('rain-btn'),
		clearBtn: DOM.button('clear-btn'),
		resetBtn: DOM.button('reset-btn'),
		exportBtn: DOM.button('export-btn'),
		objectCount: DOM.element('object-count'),
		maxObjects: DOM.element('max-objects')
	};
}

/**
 * Type de forme disponible
 */
export type ShapeType = 'box' | 'sphere' | 'cylinder';
