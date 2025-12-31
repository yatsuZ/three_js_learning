import type * as THREE from 'three';
import type { AnimationOptions, GSAPTimeline } from './types.ts';
import { animateBounce } from './bounce.ts';
import { animateBounceReal } from './bounce-real.ts';
import { animateSpin } from './spin.ts';
import { animateElastic } from './elastic.ts';
import { animateSequence } from './sequence.ts';
import { animateStagger } from './stagger.ts';

export type { AnimationOptions, GSAPTimeline };

/**
 * Controleur d'animations GSAP pour les cubes
 */
export class AnimationController {
	private cubes: THREE.Mesh[];
	private currentTimeline: GSAPTimeline | null = null;
	private initialPositions: { x: number; y: number; z: number }[];

	constructor(cubes: THREE.Mesh[]) {
		this.cubes = cubes;
		this.initialPositions = cubes.map(c => ({
			x: c.position.x,
			y: c.position.y,
			z: c.position.z
		}));
	}

	/**
	 * Joue une animation par type
	 */
	play(type: string, options: AnimationOptions): void {
		this.killAll();
		this.reset();

		const ctx = { cubes: this.cubes, options };

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
		}
	}

	/**
	 * Reset les cubes a leur position initiale
	 */
	reset(): void {
		this.killAll();
		this.cubes.forEach((cube, i) => {
			const pos = this.initialPositions[i];
			cube.position.set(pos.x, pos.y, pos.z);
			cube.rotation.set(0, 0, 0);
			cube.scale.set(1, 1, 1);
		});
	}

	/**
	 * Arrete toutes les animations
	 */
	killAll(): void {
		this.currentTimeline?.kill();
		this.currentTimeline = null;

		this.cubes.forEach(cube => {
			gsap.killTweensOf(cube.position);
			gsap.killTweensOf(cube.rotation);
			gsap.killTweensOf(cube.scale);
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
}
