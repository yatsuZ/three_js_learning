import * as THREE from 'three';
const DEFAULT_OPTIONS = {
    size: 1,
    color: '#00d9ff',
    wireframe: false,
    transparent: false,
    opacity: 1,
    position: { x: 0, y: 0, z: 0 },
    useLighting: false,
    metalness: 0.3,
    roughness: 0.7
};
export class Cube {
    constructor(scene, options = {}) {
        var _a;
        const config = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
        const geometry = new THREE.BoxGeometry(config.size, config.size, config.size);
        // Choisir le materiau selon si on utilise les lumieres
        const material = config.useLighting
            ? new THREE.MeshStandardMaterial({
                color: config.color,
                wireframe: config.wireframe,
                transparent: config.transparent,
                opacity: config.opacity,
                metalness: config.metalness,
                roughness: config.roughness
            })
            : new THREE.MeshBasicMaterial({
                color: config.color,
                wireframe: config.wireframe,
                transparent: config.transparent,
                opacity: config.opacity
            });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(config.position.x, config.position.y, config.position.z);
        // Rotation speed: utiliser celle fournie ou generer aleatoirement
        this.rotationSpeed = (_a = config.rotationSpeed) !== null && _a !== void 0 ? _a : {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        };
        scene.add(this.mesh);
    }
    update() {
        this.mesh.rotation.x += this.rotationSpeed.x;
        this.mesh.rotation.y += this.rotationSpeed.y;
        this.mesh.rotation.z += this.rotationSpeed.z;
    }
    destroy(scene) {
        scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
}
