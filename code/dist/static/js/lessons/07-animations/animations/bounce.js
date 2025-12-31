/**
 * Animation Bounce - le cube central monte et redescend
 */
export function animateBounce(ctx) {
    const centerCube = ctx.cubes[2];
    const timeline = gsap.timeline({
        repeat: ctx.options.repeat,
        yoyo: ctx.options.yoyo
    });
    // Monte puis redescend automatiquement
    timeline
        .to(centerCube.position, {
        y: 3,
        duration: ctx.options.duration / 2,
        ease: ctx.options.ease
    })
        .to(centerCube.position, {
        y: 0,
        duration: ctx.options.duration / 2,
        ease: 'bounce.out'
    });
    return timeline;
}
