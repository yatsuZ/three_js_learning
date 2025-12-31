import type * as THREE from 'three';

/**
 * Options d'animation
 */
export interface AnimationOptions {
	duration: number;
	ease: string;
	repeat: number;
	yoyo: boolean;
}

/**
 * Contexte partage entre les animations
 */
export interface AnimationContext {
	cubes: THREE.Mesh[];
	options: AnimationOptions;
}

/**
 * Interface GSAP Tween
 */
export interface GSAPTween {
	pause: () => void;
	resume: () => void;
	reverse: () => void;
	restart: () => void;
	kill: () => void;
}

/**
 * Interface GSAP Timeline
 */
export interface GSAPTimeline extends GSAPTween {
	to: (target: object, vars: object, position?: string | number) => GSAPTimeline;
	from: (target: object, vars: object, position?: string | number) => GSAPTimeline;
}

/**
 * Declaration globale GSAP (charge via CDN)
 */
declare global {
	const gsap: {
		to: (target: object, vars: object) => GSAPTween;
		from: (target: object, vars: object) => GSAPTween;
		fromTo: (target: object, fromVars: object, toVars: object) => GSAPTween;
		timeline: (vars?: object) => GSAPTimeline;
		killTweensOf: (target: object) => void;
	};
}
