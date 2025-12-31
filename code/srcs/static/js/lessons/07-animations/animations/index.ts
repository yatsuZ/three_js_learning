import type * as THREE from 'three';
import type { AnimationOptions, GSAPTimeline } from './types.ts';
import { animateBounce } from './bounce.ts';
import { animateBounceReal } from './bounce-real.ts';
import { animateSpin } from './spin.ts';
import { animateElastic } from './elastic.ts';
import { animateSequence } from './sequence.ts';
import { animateStagger } from './stagger.ts';
import { animateWave } from './wave.ts';

export type { AnimationOptions, GSAPTimeline };

/**
 * Controleur d'animations GSAP pour objets 3D
 */
export class AnimationController {
	private targets: THREE.Object3D[];
	private currentTimeline: GSAPTimeline | null = null;
	private initialStates: { pos: { x: number; y: number; z: number }; rot: { x: number; y: number; z: number }; scale: { x: number; y: number; z: number } }[];

	constructor(targets: THREE.Object3D[]) {
		this.targets = targets;
		this.initialStates = this.captureStates(targets);
	}

	/**
	 * Capture l'etat initial des objets
	 */
	private captureStates(objects: THREE.Object3D[]) {
		return objects.map(o => ({
			pos: { x: o.position.x, y: o.position.y, z: o.position.z },
			rot: { x: o.rotation.x, y: o.rotation.y, z: o.rotation.z },
			scale: { x: o.scale.x, y: o.scale.y, z: o.scale.z }
		}));
	}

	/**
	 * Change les cibles d'animation
	 */
	setTargets(targets: THREE.Object3D[]): void {
		this.killAll();
		this.targets = targets;
		this.initialStates = this.captureStates(targets);
	}

	/**
	 * Joue une animation par type
	 */
	play(type: string, options: AnimationOptions): void {
		this.killAll();
		this.reset();

		const ctx = { cubes: this.targets, options };

		switch (type) {
			case 'bounce':
				this.currentTimeline = animateBounce(ctx);
				break;
			case 'bounce-real':
				this.currentTimeline = animateBounceReal(ctx);
				break;
			case 'spin':
				this.currentTimeline = animateSpin(ctx);
				break;
			case 'elastic':
				this.currentTimeline = animateElastic(ctx);
				break;
			case 'sequence':
				this.currentTimeline = animateSequence(ctx);
				break;
			case 'stagger':
				this.currentTimeline = animateStagger(ctx);
				break;
			case 'wave':
				this.currentTimeline = animateWave(ctx);
				break;
		}
	}

	/**
	 * Reset les objets a leur etat initial
	 */
	reset(): void {
		this.killAll();
		this.targets.forEach((obj, i) => {
			const state = this.initialStates[i];
			if (state) {
				obj.position.set(state.pos.x, state.pos.y, state.pos.z);
				obj.rotation.set(state.rot.x, state.rot.y, state.rot.z);
				obj.scale.set(state.scale.x, state.scale.y, state.scale.z);
			}
		});
	}

	/**
	 * Arrete toutes les animations
	 */
	killAll(): void {
		this.currentTimeline?.kill();
		this.currentTimeline = null;

		this.targets.forEach(obj => {
			gsap.killTweensOf(obj.position);
			gsap.killTweensOf(obj.rotation);
			gsap.killTweensOf(obj.scale);
		});
	}

	pause(): void {
		this.currentTimeline?.pause();
	}

	resume(): void {
		this.currentTimeline?.resume();
	}

	reverse(): void {
		this.currentTimeline?.reverse();
	}

	/**
	 * Retourne la progression de l'animation (0-1)
	 */
	getProgress(): number {
		return this.currentTimeline?.progress() ?? 0;
	}

	/**
	 * Change la vitesse de l'animation en temps reel
	 */
	setSpeed(speed: number): void {
		this.currentTimeline?.timeScale(speed);
	}
}
