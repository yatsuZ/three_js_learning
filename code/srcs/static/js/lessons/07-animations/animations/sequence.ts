import type { AnimationContext, GSAPTimeline } from './types.ts';

/**
 * Animation Sequence - monter, tourner, descendre (enchaine)
 */
export function animateSequence(ctx: AnimationContext): GSAPTimeline {
	const duration = ctx.options.duration / 3;

	const timeline = gsap.timeline({
		repeat: ctx.options.repeat,
		yoyo: ctx.options.yoyo
	});

	// Etape 1: Monter
	timeline.to(
		ctx.cubes.map(c => c.position),
		{ y: 2, duration, stagger: 0.1 }
	);

	// Etape 2: Tourner
	timeline.to(
		ctx.cubes.map(c => c.rotation),
		{ x: Math.PI, duration, stagger: 0.1 }
	);

	// Etape 3: Descendre (retour origine)
	timeline.to(
		ctx.cubes.map(c => c.position),
		{ y: 0, duration, stagger: 0.1 }
	);

	// Etape 4: Rotation retour
	timeline.to(
		ctx.cubes.map(c => c.rotation),
		{ x: 0, duration: duration / 2, stagger: 0.1 }
	);

	return timeline;
}
