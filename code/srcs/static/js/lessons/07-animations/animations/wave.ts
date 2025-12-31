import type { AnimationContext, GSAPTimeline } from './types.ts';

/**
 * Animation Wave - les cubes forment une vague fluide
 */
export function animateWave(ctx: AnimationContext): GSAPTimeline {
	const timeline = gsap.timeline({
		repeat: ctx.options.repeat,
		yoyo: ctx.options.yoyo
	});

	// Vague montante de gauche a droite
	ctx.cubes.forEach((cube, i) => {
		const delay = i * 0.15;

		// Position Y en vague
		timeline.to(cube.position, {
			y: 2,
			duration: ctx.options.duration / 2,
			ease: 'sine.inOut'
		}, delay);

		// Legere rotation pendant la montee
		timeline.to(cube.rotation, {
			z: Math.PI * 0.1,
			duration: ctx.options.duration / 2,
			ease: 'sine.inOut'
		}, delay);

		// Redescente
		timeline.to(cube.position, {
			y: 0,
			duration: ctx.options.duration / 2,
			ease: 'sine.inOut'
		}, delay + ctx.options.duration / 2);

		// Rotation inverse
		timeline.to(cube.rotation, {
			z: -Math.PI * 0.1,
			duration: ctx.options.duration / 2,
			ease: 'sine.inOut'
		}, delay + ctx.options.duration / 2);
	});

	// Retour rotation a zero
	timeline.to(
		ctx.cubes.map(c => c.rotation),
		{
			z: 0,
			duration: ctx.options.duration / 4,
			ease: 'power1.out',
			stagger: 0.1
		}
	);

	return timeline;
}
