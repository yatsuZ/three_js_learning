/**
 * Animation Elastic - tous les cubes grossissent avec effet elastique
 */
export function animateElastic(ctx) {
    const timeline = gsap.timeline({
        repeat: ctx.options.repeat
    });
    ctx.cubes.forEach(cube => {
        timeline.to(cube.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: ctx.options.duration,
            ease: 'elastic.out(1, 0.3)',
            yoyo: true,
            repeat: 1 // Aller-retour automatique
        }, 0);
    });
    return timeline;
}
