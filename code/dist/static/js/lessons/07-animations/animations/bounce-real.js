/**
 * Animation Bounce Real - rebond realiste avec deformation (squash & stretch)
 * Optimisee pour etre fluide sur cubes et modeles GLB
 */
export function animateBounceReal(ctx) {
    const duration = ctx.options.duration;
    const isSingleTarget = ctx.cubes.length === 1;
    const timeline = gsap.timeline({
        repeat: ctx.options.repeat,
        yoyo: ctx.options.yoyo
    });
    // Pour chaque objet, creer une animation fluide
    ctx.cubes.forEach((obj, index) => {
        const delay = isSingleTarget ? 0 : index * 0.08;
        const t = duration;
        const startY = obj.position.y; // Position Y initiale
        const jumpHeight = 3;
        // Timeline individuelle pour synchroniser scale + position
        const objTl = gsap.timeline();
        // Phase 1: Anticipation (squash)
        objTl.to(obj.scale, {
            x: 1.3, y: 0.7, z: 1.3,
            duration: t * 0.08,
            ease: 'power2.in'
        });
        // Phase 2: Saut (stretch + montee)
        objTl.to(obj.scale, {
            x: 0.75, y: 1.4, z: 0.75,
            duration: t * 0.15,
            ease: 'power2.out'
        });
        objTl.to(obj.position, {
            y: startY + jumpHeight,
            duration: t * 0.25,
            ease: 'power2.out'
        }, '<');
        // Phase 3: Sommet (retour normal)
        objTl.to(obj.scale, {
            x: 1, y: 1, z: 1,
            duration: t * 0.1,
            ease: 'sine.out'
        });
        // Phase 4: Chute (stretch vers bas)
        objTl.to(obj.scale, {
            x: 0.8, y: 1.25, z: 0.8,
            duration: t * 0.1,
            ease: 'sine.in'
        });
        objTl.to(obj.position, {
            y: startY,
            duration: t * 0.2,
            ease: 'power2.in'
        }, '<');
        // Phase 5: Impact (gros squash)
        objTl.to(obj.scale, {
            x: 1.4, y: 0.6, z: 1.4,
            duration: t * 0.05,
            ease: 'power3.out'
        });
        // Phase 6: Retour elastique
        objTl.to(obj.scale, {
            x: 1, y: 1, z: 1,
            duration: t * 0.17,
            ease: 'elastic.out(1, 0.4)'
        });
        // Ajouter au timeline principal avec delay
        timeline.add(objTl, delay);
    });
    return timeline;
}
