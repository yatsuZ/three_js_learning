/**
 * Animation Bounce Real - rebond realiste avec deformation (squash & stretch)
 */
export function animateBounceReal(ctx) {
    const centerCube = ctx.cubes[2];
    const duration = ctx.options.duration;
    const timeline = gsap.timeline({
        repeat: ctx.options.repeat,
        yoyo: ctx.options.yoyo
    });
    // Phase 1: Anticipation - le cube s'ecrase avant de sauter
    timeline.to(centerCube.scale, {
        x: 1.3,
        y: 0.7,
        z: 1.3,
        duration: duration * 0.1,
        ease: 'power2.in'
    });
    // Phase 2: Depart - etirement vertical pendant la montee
    timeline.to(centerCube.scale, {
        x: 0.8,
        y: 1.4,
        z: 0.8,
        duration: duration * 0.1,
        ease: 'power2.out'
    }, '>');
    timeline.to(centerCube.position, {
        y: 3,
        duration: duration * 0.3,
        ease: 'power2.out'
    }, '<');
    // Phase 3: Sommet - forme normale en l'air
    timeline.to(centerCube.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: duration * 0.1,
        ease: 'power1.out'
    });
    // Phase 4: Chute - etirement vers le bas
    timeline.to(centerCube.scale, {
        x: 0.85,
        y: 1.3,
        z: 0.85,
        duration: duration * 0.15,
        ease: 'power1.in'
    });
    timeline.to(centerCube.position, {
        y: 0,
        duration: duration * 0.25,
        ease: 'power2.in'
    }, '<');
    // Phase 5: Impact - ecrasement au sol
    timeline.to(centerCube.scale, {
        x: 1.5,
        y: 0.5,
        z: 1.5,
        duration: duration * 0.08,
        ease: 'power3.out'
    });
    // Phase 6: Rebond leger
    timeline.to(centerCube.position, {
        y: 0.8,
        duration: duration * 0.15,
        ease: 'power2.out'
    });
    timeline.to(centerCube.scale, {
        x: 0.9,
        y: 1.15,
        z: 0.9,
        duration: duration * 0.1,
        ease: 'power1.out'
    }, '<');
    // Phase 7: Retour au sol
    timeline.to(centerCube.position, {
        y: 0,
        duration: duration * 0.12,
        ease: 'power2.in'
    });
    timeline.to(centerCube.scale, {
        x: 1.2,
        y: 0.7,
        z: 1.2,
        duration: duration * 0.06,
        ease: 'power2.out'
    });
    // Phase 8: Retour forme normale
    timeline.to(centerCube.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: duration * 0.1,
        ease: 'elastic.out(1, 0.5)'
    });
    return timeline;
}
