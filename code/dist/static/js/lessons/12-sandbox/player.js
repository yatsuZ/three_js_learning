import * as THREE from 'three';
import * as CANNON from 'cannon-es';
/**
 * Controleur du joueur avec physique
 */
export class PlayerController {
    constructor(scene, world, material) {
        this.keys = {};
        this.speed = 5;
        this.scene = scene;
        this.world = world;
        // Mesh joueur
        this.mesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.4, 1, 8, 16), new THREE.MeshStandardMaterial({ color: 0x00d9ff, roughness: 0.3, metalness: 0.5 }));
        this.mesh.position.set(0, 1, 0);
        this.mesh.castShadow = true;
        this.mesh.visible = false;
        this.scene.add(this.mesh);
        // Body joueur
        this.body = new CANNON.Body({ mass: 5, material });
        this.body.addShape(new CANNON.Cylinder(0.4, 0.4, 1.8, 8));
        this.body.position.set(0, 1, 0);
        this.body.linearDamping = 0.9;
        this.body.angularDamping = 0.99;
        this.world.addBody(this.body);
        // Bind des handlers
        this.boundKeyDown = this.onKeyDown.bind(this);
        this.boundKeyUp = this.onKeyUp.bind(this);
        window.addEventListener('keydown', this.boundKeyDown);
        window.addEventListener('keyup', this.boundKeyUp);
    }
    onKeyDown(e) {
        if (e.key === ' ')
            e.preventDefault();
        this.keys[e.key.toLowerCase()] = true;
    }
    onKeyUp(e) {
        this.keys[e.key.toLowerCase()] = false;
    }
    update(delta) {
        let dx = 0, dz = 0, dy = 0;
        if (this.keys['z'] || this.keys['w'])
            dz -= 1;
        if (this.keys['s'])
            dz += 1;
        if (this.keys['q'] || this.keys['a'])
            dx -= 1;
        if (this.keys['d'])
            dx += 1;
        if (this.keys[' '] && Math.abs(this.body.velocity.y) < 0.5)
            dy = 5;
        // Normaliser diagonal
        const len = Math.sqrt(dx * dx + dz * dz);
        if (len > 0) {
            dx /= len;
            dz /= len;
        }
        // Appliquer mouvement
        const force = this.speed * 20;
        this.body.velocity.x = dx * force * delta * 10;
        this.body.velocity.z = dz * force * delta * 10;
        if (dy > 0)
            this.body.velocity.y = dy;
        // Garder droit
        this.body.quaternion.setFromEuler(0, 0, 0);
        // Sync mesh
        this.mesh.position.copy(this.body.position);
    }
    setSpeed(speed) {
        this.speed = speed;
    }
    setVisible(visible) {
        this.mesh.visible = visible;
    }
    getPosition() {
        return this.mesh.position;
    }
    getActiveKeys() {
        return {
            z: this.keys['z'] || this.keys['w'] || false,
            q: this.keys['q'] || this.keys['a'] || false,
            s: this.keys['s'] || false,
            d: this.keys['d'] || false,
            space: this.keys[' '] || false
        };
    }
    reset() {
        this.body.position.set(0, 1, 0);
        this.body.velocity.set(0, 0, 0);
    }
    dispose() {
        window.removeEventListener('keydown', this.boundKeyDown);
        window.removeEventListener('keyup', this.boundKeyUp);
        this.scene.remove(this.mesh);
        this.world.removeBody(this.body);
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
}
