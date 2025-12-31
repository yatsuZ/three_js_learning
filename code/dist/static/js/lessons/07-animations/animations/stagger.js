/**
 * Animation Stagger - cubes montent avec decalage depuis le centre puis redescendent
 */
export function animateStagger(ctx) {
    const timeline = gsap.timeline({
        repeat: ctx.options.repeat,
        yoyo: ctx.options.yoyo
    });
    // Monter avec stagger depuis le centre
    timeline.to(ctx.cubes.map(c => c.position), {
        y: 2,
        duration: ctx.options.duration / 2,
        ease: ctx.options.ease,
        stagger: {
            each: 0.15,
            from: 'center'
        }
    });
    // Redescendre avec stagger inverse
    timeline.to(ctx.cubes.map(c => c.position), {
        y: 0,
        duration: ctx.options.duration / 2,
        ease: 'power2.in',
        stagger: {
            each: 0.15,
            from: 'edges'
        }
    });
    return timeline;
}
