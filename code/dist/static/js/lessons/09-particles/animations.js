/**
 * Rotation de la galaxie
 */
export function updateGalaxy(points, delta, speed) {
    points.rotation.y += delta * 0.1 * speed;
}
/**
 * Animation neige
 */
export function updateSnow(config, positions, velocities, delta) {
    const speed = config.speed;
    for (let i = 0; i < config.count; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3] * delta * speed;
        positions[i3 + 1] += velocities[i3 + 1] * delta * speed;
        positions[i3 + 2] += velocities[i3 + 2] * delta * speed;
        if (positions[i3 + 1] < 0) {
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = 15;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;
        }
    }
}
/**
 * Animation feu
 */
export function updateFire(config, positions, colors, velocities, lifetimes, delta) {
    const speed = config.speed;
    for (let i = 0; i < config.count; i++) {
        const i3 = i * 3;
        lifetimes[i] += delta * speed;
        positions[i3] += velocities[i3] * delta * speed;
        positions[i3 + 1] += velocities[i3 + 1] * delta * speed;
        positions[i3 + 2] += velocities[i3 + 2] * delta * speed;
        const life = Math.min(positions[i3 + 1] / 4, 1);
        colors[i3] = 1;
        colors[i3 + 1] = Math.max(0.5 - life * 0.5, 0);
        colors[i3 + 2] = 0;
        if (positions[i3 + 1] > 4 || lifetimes[i] > 2) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 0.5;
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = 0;
            positions[i3 + 2] = Math.sin(angle) * radius;
            lifetimes[i] = 0;
        }
    }
}
/**
 * Animation fontaine
 */
export function updateFountain(config, positions, colors, velocities, lifetimes, delta) {
    const speed = config.speed;
    const gravity = -9.8;
    for (let i = 0; i < config.count; i++) {
        const i3 = i * 3;
        lifetimes[i] += delta * speed;
        const t = lifetimes[i];
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.2;
        const baseX = Math.cos(angle) * radius;
        const baseZ = Math.sin(angle) * radius;
        positions[i3] = baseX + velocities[i3] * t;
        positions[i3 + 1] = velocities[i3 + 1] * t + 0.5 * gravity * t * t;
        positions[i3 + 2] = baseZ + velocities[i3 + 2] * t;
        const alpha = Math.max(0, Math.min(1, positions[i3 + 1] / 2));
        colors[i3] = config.color.r * alpha + 0.5 * (1 - alpha);
        colors[i3 + 1] = config.color.g * alpha + 0.5 * (1 - alpha);
        colors[i3 + 2] = config.color.b * alpha + 1 * (1 - alpha);
        if (positions[i3 + 1] < 0) {
            const newAngle = Math.random() * Math.PI * 2;
            const spread = 0.5 + Math.random() * 0.5;
            velocities[i3] = Math.cos(newAngle) * spread;
            velocities[i3 + 1] = 3 + Math.random() * 2;
            velocities[i3 + 2] = Math.sin(newAngle) * spread;
            lifetimes[i] = 0;
        }
    }
}
/**
 * Animation explosion
 */
export function updateExplosion(config, positions, colors, velocities, lifetimes, delta) {
    const speed = config.speed;
    const gravity = -2;
    for (let i = 0; i < config.count; i++) {
        const i3 = i * 3;
        lifetimes[i] += delta * speed;
        const t = lifetimes[i];
        positions[i3] = velocities[i3] * t;
        positions[i3 + 1] = velocities[i3 + 1] * t + 0.5 * gravity * t * t;
        positions[i3 + 2] = velocities[i3 + 2] * t;
        const fade = Math.max(0, 1 - t / 3);
        colors[i3] = fade;
        colors[i3 + 1] = fade * 0.5;
        colors[i3 + 2] = 0;
    }
}
/**
 * Reset l'explosion pour relancer
 */
export function resetExplosion(config, positions, velocities, lifetimes) {
    for (let i = 0; i < config.count; i++) {
        const i3 = i * 3;
        positions[i3] = 0;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = 0;
        lifetimes[i] = 0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = 2 + Math.random() * 4;
        velocities[i3] = Math.sin(phi) * Math.cos(theta) * speed;
        velocities[i3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
        velocities[i3 + 2] = Math.cos(phi) * speed;
    }
}
