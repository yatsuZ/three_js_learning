import type { AnimationContext, GSAPTimeline } from './types.ts';

/**
 * Animation Bounce - tous les cubes montent et redescendent avec stagger
 */
export function animateBounce(ctx: AnimationContext): GSAPTimeline {
	const timeline = gsap.timeline({
		repeat: ctx.options.repeat,
		yoyo: ctx.options.yoyo
	});

	// Monte avec stagger depuis le centre
	timeline.to(
		ctx.cubes.map(c => c.position),
		{
			y: 3,
			duration: ctx.options.duration / 2,
			ease: ctx.options.ease,
			stagger: {
				each: 0.08,
				from: 'center'
			}
		}
	);

	// Redescend avec bounce
	timeline.to(
		ctx.cubes.map(c => c.position),
		{
			y: 0,
			duration: ctx.options.duration / 2,
			ease: 'bounce.out',
			stagger: {
				each: 0.08,
				from: 'center'
			}
		}
	);

	return timeline;
}
