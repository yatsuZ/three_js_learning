import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { PhysicsSoundManager } from "./sound.js";
import { getRandomColor, createMeshAndShape, createDebris, disposeObject } from "./objects.js";
// Limite d'objets
const MAX_OBJECTS = 50;
/**
 * Gestionnaire de physique avec Cannon.js
 */
export class PhysicsWorld {
    constructor(scene) {
        this.objects = [];
        this.groundBody = null;
        this.scene = scene;
        this.soundManager = new PhysicsSoundManager();
        // Creer le monde physique
        this.world = new CANNON.World();
        this.world.gravity.set(0, -10, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        // Materiaux physiques
        this.defaultMaterial = new CANNON.Material('default');
        this.groundMaterial = new CANNON.Material('ground');
        // Contact entre materiaux
        const contactMaterial = new CANNON.ContactMaterial(this.defaultMaterial, this.groundMaterial, { friction: 0.3, restitution: 0.5 });
        this.world.addContactMaterial(contactMaterial);
        // Contact entre objets
        const objectContact = new CANNON.ContactMaterial(this.defaultMaterial, this.defaultMaterial, { friction: 0.3, restitution: 0.5 });
        this.world.addContactMaterial(objectContact);
    }
    /**
     * Cree le sol
     */
    createGround(size = 20) {
        const geometry = new THREE.PlaneGeometry(size, size);
        const material = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        const shape = new CANNON.Plane();
        this.groundBody = new CANNON.Body({
            mass: 0,
            material: this.groundMaterial
        });
        this.groundBody.addShape(shape);
        this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.world.addBody(this.groundBody);
        return mesh;
    }
    /**
     * Cree des murs invisibles
     */
    createWalls(size = 10, height = 10) {
        const wallShape = new CANNON.Box(new CANNON.Vec3(size, height, 0.1));
        const positions = [
            { x: 0, z: size },
            { x: 0, z: -size },
            { x: size, z: 0 },
            { x: -size, z: 0 }
        ];
        const rotations = [0, 0, Math.PI / 2, Math.PI / 2];
        positions.forEach((pos, i) => {
            const body = new CANNON.Body({ mass: 0 });
            body.addShape(wallShape);
            body.position.set(pos.x, height / 2, pos.z);
            if (i >= 2) {
                body.quaternion.setFromEuler(0, rotations[i], 0);
            }
            this.world.addBody(body);
        });
    }
    canAddObject() {
        return this.objects.length < MAX_OBJECTS;
    }
    getMaxObjects() {
        return MAX_OBJECTS;
    }
    /**
     * Ajoute un objet physique
     */
    addObject(config) {
        if (!this.canAddObject())
            return null;
        const { shape, position, mass, restitution, friction, color, breakable } = config;
        const meshColor = color !== null && color !== void 0 ? color : getRandomColor();
        const { mesh, cannonShape } = createMeshAndShape(shape, meshColor);
        mesh.position.copy(position);
        this.scene.add(mesh);
        const body = new CANNON.Body({
            mass,
            material: this.defaultMaterial
        });
        body.addShape(cannonShape);
        body.position.set(position.x, position.y, position.z);
        body.material.friction = friction;
        body.material.restitution = restitution;
        body.angularVelocity.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
        this.world.addBody(body);
        const obj = {
            mesh,
            body,
            breakable: breakable !== null && breakable !== void 0 ? breakable : false,
            health: 100
        };
        this.objects.push(obj);
        // Event de collision
        body.addEventListener('collide', (event) => {
            const e = event;
            const impactVelocity = Math.abs(e.contact.getImpactVelocityAlongNormal());
            if (impactVelocity > 2) {
                this.soundManager.playCollision(impactVelocity);
                if (obj.breakable && impactVelocity > 5) {
                    obj.health -= impactVelocity * 5;
                    if (obj.health <= 0) {
                        this.breakObject(obj);
                    }
                }
            }
        });
        return obj;
    }
    spawnRandom(config) {
        if (!this.canAddObject())
            return null;
        const position = new THREE.Vector3((Math.random() - 0.5) * 8, 5 + Math.random() * 5, (Math.random() - 0.5) * 8);
        return this.addObject(Object.assign(Object.assign({}, config), { position }));
    }
    spawnAt(x, y, z, config) {
        if (!this.canAddObject())
            return null;
        const position = new THREE.Vector3(x, y, z);
        return this.addObject(Object.assign(Object.assign({}, config), { position }));
    }
    spawnRain(count, config) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                if (this.canAddObject()) {
                    this.spawnRandom(config);
                }
            }, i * 100);
        }
    }
    update(delta) {
        this.world.step(1 / 60, delta, 3);
        for (const obj of this.objects) {
            obj.mesh.position.copy(obj.body.position);
            obj.mesh.quaternion.copy(obj.body.quaternion);
        }
        // Supprimer les objets tombes trop bas
        this.objects = this.objects.filter(obj => {
            if (obj.body.position.y < -20) {
                disposeObject(obj, this.scene, this.world);
                return false;
            }
            return true;
        });
    }
    setGravity(y) {
        this.world.gravity.set(0, y, 0);
    }
    updateContactProperties(friction, restitution) {
        this.defaultMaterial.friction = friction;
        this.defaultMaterial.restitution = restitution;
    }
    clearObjects() {
        for (const obj of this.objects) {
            disposeObject(obj, this.scene, this.world);
        }
        this.objects = [];
    }
    setDebug(enabled) {
        // Le debug visuel sera gere si necessaire
    }
    getObjectCount() {
        return this.objects.length;
    }
    setSoundEnabled(enabled) {
        this.soundManager.setEnabled(enabled);
    }
    breakObject(obj) {
        const pos = obj.body.position;
        const vel = obj.body.velocity;
        const originalColor = obj.mesh.material.color.getHex();
        // Supprimer l'objet original
        this.scene.remove(obj.mesh);
        this.world.removeBody(obj.body);
        if (obj.mesh.geometry)
            obj.mesh.geometry.dispose();
        // Creer des debris
        const debris = createDebris(pos, vel, originalColor, this.scene, this.world, this.defaultMaterial);
        this.objects.push(...debris);
        this.soundManager.playBreak();
        // Retirer l'objet de la liste
        const index = this.objects.indexOf(obj);
        if (index > -1) {
            this.objects.splice(index, 1);
        }
    }
    getObjects() {
        return this.objects;
    }
    dispose() {
        this.clearObjects();
        if (this.groundBody) {
            this.world.removeBody(this.groundBody);
        }
        this.soundManager.dispose();
    }
}
