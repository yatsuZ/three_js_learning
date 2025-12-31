import { DOM } from '../../shared/index.ts';

/**
 * Interface des elements UI pour la lecon 07
 */
export interface UIElements {
	animationSelect: HTMLSelectElement;
	playBtn: HTMLButtonElement;
	resetBtn: HTMLButtonElement;
	duration: HTMLInputElement;
	durationValue: HTMLElement;
	easingSelect: HTMLSelectElement;
	repeatToggle: HTMLInputElement;
	yoyoToggle: HTMLInputElement;
	speed: HTMLInputElement;
	speedValue: HTMLElement;
	pauseBtn: HTMLButtonElement;
	resumeBtn: HTMLButtonElement;
	reverseBtn: HTMLButtonElement;
	progressBar: HTMLElement;
	glbModeToggle: HTMLInputElement;
}

/**
 * Recupere tous les elements UI
 */
export function getUIElements(): UIElements {
	return {
		animationSelect: DOM.element('animation-select') as HTMLSelectElement,
		playBtn: DOM.button('play-btn'),
		resetBtn: DOM.button('reset-btn'),
		duration: DOM.input('duration'),
		durationValue: DOM.element('duration-value'),
		easingSelect: DOM.element('easing-select') as HTMLSelectElement,
		repeatToggle: DOM.input('repeat-toggle'),
		yoyoToggle: DOM.input('yoyo-toggle'),
		speed: DOM.input('speed'),
		speedValue: DOM.element('speed-value'),
		pauseBtn: DOM.button('pause-btn'),
		resumeBtn: DOM.button('resume-btn'),
		reverseBtn: DOM.button('reverse-btn'),
		progressBar: DOM.element('progress-bar'),
		glbModeToggle: DOM.input('glb-mode-toggle')
	};
}

/**
 * Options d'animation extraites de l'UI
 */
export interface AnimationOptions {
	duration: number;
	ease: string;
	repeat: number;
	yoyo: boolean;
}

/**
 * Extrait les options d'animation depuis l'UI
 */
export function getAnimationOptions(ui: UIElements): AnimationOptions {
	return {
		duration: parseFloat(ui.duration.value),
		ease: ui.easingSelect.value,
		repeat: ui.repeatToggle.checked ? -1 : 0,
		yoyo: ui.yoyoToggle.checked
	};
}
