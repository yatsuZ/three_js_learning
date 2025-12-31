import { DOM } from '../../shared/index.ts';

export interface UIElements {
	// Mode
	mode: HTMLSelectElement;
	// Physics
	shape: HTMLSelectElement;
	breakableToggle: HTMLInputElement;
	restitution: HTMLInputElement;
	physicsSection: HTMLElement;
	// Particles
	particlePreset: HTMLSelectElement;
	particleCount: HTMLInputElement;
	particleCountValue: HTMLElement;
	particlesSection: HTMLElement;
	// Player
	playerSpeed: HTMLInputElement;
	playerSpeedValue: HTMLElement;
	playerSection: HTMLElement;
	keyZ: HTMLElement;
	keyQ: HTMLElement;
	keyS: HTMLElement;
	keyD: HTMLElement;
	keySpace: HTMLElement;
	posX: HTMLElement;
	posY: HTMLElement;
	posZ: HTMLElement;
	// Global
	soundToggle: HTMLInputElement;
	shadowsToggle: HTMLInputElement;
	spawnBtn: HTMLButtonElement;
	explosionBtn: HTMLButtonElement;
	exportBtn: HTMLButtonElement;
	clearBtn: HTMLButtonElement;
	resetBtn: HTMLButtonElement;
	objectCount: HTMLElement;
	maxObjects: HTMLElement;
}

export function getUIElements(): UIElements {
	return {
		mode: DOM.element('mode') as HTMLSelectElement,
		shape: DOM.element('shape') as HTMLSelectElement,
		breakableToggle: DOM.input('breakable-toggle'),
		restitution: DOM.input('restitution'),
		physicsSection: DOM.element('physics-section'),
		particlePreset: DOM.element('particle-preset') as HTMLSelectElement,
		particleCount: DOM.input('particle-count'),
		particleCountValue: DOM.element('particle-count-value'),
		particlesSection: DOM.element('particles-section'),
		playerSpeed: DOM.input('player-speed'),
		playerSpeedValue: DOM.element('player-speed-value'),
		playerSection: DOM.element('player-section'),
		keyZ: DOM.element('key-z'),
		keyQ: DOM.element('key-q'),
		keyS: DOM.element('key-s'),
		keyD: DOM.element('key-d'),
		keySpace: DOM.element('key-space'),
		posX: DOM.element('pos-x'),
		posY: DOM.element('pos-y'),
		posZ: DOM.element('pos-z'),
		soundToggle: DOM.input('sound-toggle'),
		shadowsToggle: DOM.input('shadows-toggle'),
		spawnBtn: DOM.button('spawn-btn'),
		explosionBtn: DOM.button('explosion-btn'),
		exportBtn: DOM.button('export-btn'),
		clearBtn: DOM.button('clear-btn'),
		resetBtn: DOM.button('reset-btn'),
		objectCount: DOM.element('object-count'),
		maxObjects: DOM.element('max-objects')
	};
}

export type ModeType = 'physics' | 'particles' | 'player';
export type ShapeType = 'box' | 'sphere' | 'cylinder';
export type ParticlePreset = 'galaxy' | 'snow' | 'fire' | 'fountain';
