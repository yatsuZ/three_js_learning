import * as THREE from 'three';
/**
 * Gestionnaire de particules pour le sandbox
 */
export class SandboxParticles {
    constructor(scene) {
        this.points = null;
        this.geometry = null;
        this.velocities = null;
        this.lifetimes = null;
        this.preset = 'galaxy';
        this.scene = scene;
    }
    create(preset, count) {
        this.dispose();
        this.preset = preset;
        this.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        this.velocities = new Float32Array(count * 3);
        this.lifetimes = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            this.initParticle(i, positions, colors, preset);
        }
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        this.points = new THREE.Points(this.geometry, material);
        this.points.visible = false;
        this.scene.add(this.points);
    }
    initParticle(i, positions, colors, preset) {
        const i3 = i * 3;
        const vel = this.velocities;
        const life = this.lifetimes;
        switch (preset) {
            case 'galaxy': {
                const radius = Math.random() * 8;
                const branch = (i % 5) / 5 * Math.PI * 2;
                const spin = radius * 0.5;
                positions[i3] = Math.cos(branch + spin) * radius + (Math.random() - 0.5) * radius * 0.3;
                positions[i3 + 1] = (Math.random() - 0.5) * 0.5;
                positions[i3 + 2] = Math.sin(branch + spin) * radius + (Math.random() - 0.5) * radius * 0.3;
                const mix = radius / 8;
                colors[i3] = 0 * (1 - mix) + 1 * mix;
                colors[i3 + 1] = 0.85 * (1 - mix) + 0.5 * mix;
                colors[i3 + 2] = 1 * (1 - mix) + 0 * mix;
                break;
            }
            case 'snow': {
                positions[i3] = (Math.random() - 0.5) * 25;
                positions[i3 + 1] = Math.random() * 15;
                positions[i3 + 2] = (Math.random() - 0.5) * 25;
                vel[i3] = (Math.random() - 0.5) * 0.3;
                vel[i3 + 1] = -1 - Math.random() * 1.5;
                vel[i3 + 2] = (Math.random() - 0.5) * 0.3;
                const b = 0.9 + Math.random() * 0.1;
                colors[i3] = colors[i3 + 1] = colors[i3 + 2] = b;
                break;
            }
            case 'fire': {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * 0.5;
                positions[i3] = Math.cos(angle) * r;
                positions[i3 + 1] = Math.random() * 3;
                positions[i3 + 2] = Math.sin(angle) * r;
                vel[i3] = (Math.random() - 0.5) * 0.3;
                vel[i3 + 1] = 1 + Math.random() * 2;
                vel[i3 + 2] = (Math.random() - 0.5) * 0.3;
                life[i] = Math.random();
                colors[i3] = 1;
                colors[i3 + 1] = 0.5;
                colors[i3 + 2] = 0;
                break;
            }
            case 'fountain': {
                const a = Math.random() * Math.PI * 2;
                positions[i3] = Math.cos(a) * 0.2;
                positions[i3 + 1] = 0;
                positions[i3 + 2] = Math.sin(a) * 0.2;
                vel[i3] = Math.cos(a) * 0.5;
                vel[i3 + 1] = 4 + Math.random() * 2;
                vel[i3 + 2] = Math.sin(a) * 0.5;
                life[i] = Math.random();
                colors[i3] = 0;
                colors[i3 + 1] = 0.85;
                colors[i3 + 2] = 1;
                break;
            }
        }
    }
    update(delta) {
        if (!this.geometry || !this.velocities || !this.lifetimes || !this.points)
            return;
        const positions = this.geometry.attributes.position.array;
        const colors = this.geometry.attributes.color.array;
        const vel = this.velocities;
        const life = this.lifetimes;
        const count = positions.length / 3;
        if (this.preset === 'galaxy') {
            this.points.rotation.y += delta * 0.1;
            return;
        }
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            if (this.preset === 'snow') {
                positions[i3] += vel[i3] * delta;
                positions[i3 + 1] += vel[i3 + 1] * delta;
                positions[i3 + 2] += vel[i3 + 2] * delta;
                if (positions[i3 + 1] < 0) {
                    positions[i3] = (Math.random() - 0.5) * 25;
                    positions[i3 + 1] = 15;
                    positions[i3 + 2] = (Math.random() - 0.5) * 25;
                }
            }
            else if (this.preset === 'fire') {
                life[i] += delta;
                positions[i3] += vel[i3] * delta;
                positions[i3 + 1] += vel[i3 + 1] * delta;
                positions[i3 + 2] += vel[i3 + 2] * delta;
                const h = positions[i3 + 1] / 4;
                colors[i3 + 1] = Math.max(0.5 - h * 0.5, 0);
                if (positions[i3 + 1] > 4 || life[i] > 2) {
                    const a = Math.random() * Math.PI * 2;
                    const r = Math.random() * 0.5;
                    positions[i3] = Math.cos(a) * r;
                    positions[i3 + 1] = 0;
                    positions[i3 + 2] = Math.sin(a) * r;
                    life[i] = 0;
                }
            }
            else if (this.preset === 'fountain') {
                life[i] += delta;
                const t = life[i];
                const gravity = -9.8;
                const a = Math.random() * Math.PI * 2;
                positions[i3] = Math.cos(a) * 0.2 + vel[i3] * t;
                positions[i3 + 1] = vel[i3 + 1] * t + 0.5 * gravity * t * t;
                positions[i3 + 2] = Math.sin(a) * 0.2 + vel[i3 + 2] * t;
                if (positions[i3 + 1] < 0) {
                    life[i] = 0;
                    vel[i3] = Math.cos(a) * 0.5;
                    vel[i3 + 1] = 4 + Math.random() * 2;
                    vel[i3 + 2] = Math.sin(a) * 0.5;
                }
            }
        }
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
    }
    setVisible(visible) {
        if (this.points)
            this.points.visible = visible;
    }
    getPoints() {
        return this.points;
    }
    dispose() {
        var _a;
        if (this.points) {
            this.scene.remove(this.points);
            (_a = this.geometry) === null || _a === void 0 ? void 0 : _a.dispose();
            this.points.material.dispose();
            this.points = null;
            this.geometry = null;
        }
    }
}
