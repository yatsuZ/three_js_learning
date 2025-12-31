import type { AnimationContext, GSAPTimeline } from './types.ts';

/**
 * Animation Spin - tous les cubes tournent sur eux-memes
 */
export function animateSpin(ctx: AnimationContext): GSAPTimeline {
	const timeline = gsap.timeline({
		repeat: ctx.options.repeat,
		yoyo: ctx.options.yoyo
	});

	ctx.cubes.forEach(cube => {
		timeline.to(cube.rotation, {
			y: Math.PI * 2,
			duration: ctx.options.duration,
			ease: ctx.options.ease
		}, 0); // 0 = tous en meme temps
	});

	return timeline;
}
