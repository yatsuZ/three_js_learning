import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import type { ShapeType } from './ui.ts';
import type { SoundManager } from './sound.ts';

const MAX_OBJECTS = 30;

export interface PhysicsObject {
	mesh: THREE.Mesh;
	body: CANNON.Body;
	breakable: boolean;
	health: number;
}

/**
 * Gestionnaire de physique pour le sandbox
 */
export class SandboxPhysics {
	private scene: THREE.Scene;
	private world: CANNON.World;
	private objects: PhysicsObject[] = [];
	private defaultMaterial: CANNON.Material;
	private soundManager: SoundManager;

	constructor(scene: THREE.Scene, soundManager: SoundManager) {
		this.scene = scene;
		this.soundManager = soundManager;

		// Creer le monde
		this.world = new CANNON.World();
		this.world.gravity.set(0, -10, 0);
		this.world.broadphase = new CANNON.NaiveBroadphase();

		// Materiaux
		this.defaultMaterial = new CANNON.Material('default');
		const groundMaterial = new CANNON.Material('ground');

		this.world.addContactMaterial(new CANNON.ContactMaterial(
			this.defaultMaterial, groundMaterial, { friction: 0.3, restitution: 0.5 }
		));
		this.world.addContactMaterial(new CANNON.ContactMaterial(
			this.defaultMaterial, this.defaultMaterial, { friction: 0.3, restitution: 0.5 }
		));

		// Sol
		const floorMesh = new THREE.Mesh(
			new THREE.PlaneGeometry(30, 30),
			new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 })
		);
		floorMesh.rotation.x = -Math.PI / 2;
		floorMesh.receiveShadow = true;
		this.scene.add(floorMesh);

		const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
		groundBody.addShape(new CANNON.Plane());
		groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
		this.world.addBody(groundBody);

		// Grille
		const grid = new THREE.GridHelper(30, 30, 0x00d9ff, 0x444444);
		grid.position.y = 0.01;
		this.scene.add(grid);

		// Murs
		this.createWalls();
	}

	private createWalls(): void {
		const wallShape = new CANNON.Box(new CANNON.Vec3(15, 10, 0.1));
		[
			{ x: 0, z: 15 }, { x: 0, z: -15 },
			{ x: 15, z: 0, rotY: Math.PI / 2 }, { x: -15, z: 0, rotY: Math.PI / 2 }
		].forEach(pos => {
			const body = new CANNON.Body({ mass: 0 });
			body.addShape(wallShape);
			body.position.set(pos.x, 5, pos.z);
			if (pos.rotY) body.quaternion.setFromEuler(0, pos.rotY, 0);
			this.world.addBody(body);
		});
	}

	getWorld(): CANNON.World {
		return this.world;
	}

	getMaterial(): CANNON.Material {
		return this.defaultMaterial;
	}

	getMaxObjects(): number {
		return MAX_OBJECTS;
	}

	getObjectCount(): number {
		return this.objects.length;
	}

	canSpawn(): boolean {
		return this.objects.length < MAX_OBJECTS;
	}

	spawnObject(shape: ShapeType, pos: THREE.Vector3, breakable: boolean, restitution: number): void {
		if (!this.canSpawn()) return;

		let mesh: THREE.Mesh;
		let cannonShape: CANNON.Shape;
		const color = this.getRandomColor();

		switch (shape) {
			case 'sphere':
				mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({ color, roughness: 0.4 }));
				cannonShape = new CANNON.Sphere(0.5);
				break;
			case 'cylinder':
				mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1, 32), new THREE.MeshStandardMaterial({ color, roughness: 0.4 }));
				cannonShape = new CANNON.Cylinder(0.4, 0.4, 1, 16);
				break;
			default:
				mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color, roughness: 0.4 }));
				cannonShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
		}

		mesh.position.copy(pos);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		this.scene.add(mesh);

		const body = new CANNON.Body({ mass: 1, material: this.defaultMaterial });
		body.addShape(cannonShape);
		body.position.set(pos.x, pos.y, pos.z);
		body.material!.restitution = restitution;
		body.angularVelocity.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);

		const obj: PhysicsObject = { mesh, body, breakable, health: 100 };

		body.addEventListener('collide', (event: unknown) => {
			const e = event as { contact: { getImpactVelocityAlongNormal: () => number } };
			const impact = Math.abs(e.contact.getImpactVelocityAlongNormal());
			if (impact > 2) {
				this.soundManager.playCollision(impact);
				if (obj.breakable && impact > 5) {
					obj.health -= impact * 5;
					if (obj.health <= 0) this.breakObject(obj);
				}
			}
		});

		this.world.addBody(body);
		this.objects.push(obj);
	}

	private breakObject(obj: PhysicsObject): void {
		const pos = obj.body.position;
		const vel = obj.body.velocity;
		const color = (obj.mesh.material as THREE.MeshStandardMaterial).color.getHex();

		this.scene.remove(obj.mesh);
		this.world.removeBody(obj.body);

		for (let i = 0; i < 5; i++) {
			const size = 0.15 + Math.random() * 0.15;
			const debrisMesh = new THREE.Mesh(
				new THREE.BoxGeometry(size, size, size),
				new THREE.MeshStandardMaterial({ color, roughness: 0.6 })
			);
			debrisMesh.position.set(pos.x + (Math.random() - 0.5) * 0.5, pos.y, pos.z + (Math.random() - 0.5) * 0.5);
			debrisMesh.castShadow = true;
			this.scene.add(debrisMesh);

			const debrisBody = new CANNON.Body({ mass: 0.2, material: this.defaultMaterial });
			debrisBody.addShape(new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2)));
			debrisBody.position.set(debrisMesh.position.x, debrisMesh.position.y, debrisMesh.position.z);
			debrisBody.velocity.set(vel.x + (Math.random() - 0.5) * 5, vel.y + 3, vel.z + (Math.random() - 0.5) * 5);
			debrisBody.angularVelocity.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
			this.world.addBody(debrisBody);

			this.objects.push({ mesh: debrisMesh, body: debrisBody, breakable: false, health: 100 });
		}

		this.soundManager.playBreak();
		const idx = this.objects.indexOf(obj);
		if (idx > -1) this.objects.splice(idx, 1);
	}

	createExplosion(): void {
		const center = new CANNON.Vec3(0, 0, 0);
		for (const obj of this.objects) {
			const dir = new CANNON.Vec3();
			dir.copy(obj.body.position);
			dir.vsub(center, dir);
			const dist = dir.length();
			if (dist < 15) {
				dir.normalize();
				const force = (15 - dist) * 50;
				obj.body.applyImpulse(new CANNON.Vec3(dir.x * force, force * 0.5, dir.z * force), obj.body.position);
			}
		}
		this.soundManager.playBreak();
	}

	update(delta: number): void {
		this.world.step(1 / 60, delta, 3);

		this.objects = this.objects.filter(obj => {
			if (obj.body.position.y < -20) {
				this.scene.remove(obj.mesh);
				this.world.removeBody(obj.body);
				obj.mesh.geometry.dispose();
				(obj.mesh.material as THREE.Material).dispose();
				return false;
			}
			obj.mesh.position.copy(obj.body.position as unknown as THREE.Vector3);
			obj.mesh.quaternion.copy(obj.body.quaternion as unknown as THREE.Quaternion);
			return true;
		});
	}

	clear(): void {
		for (const obj of this.objects) {
			this.scene.remove(obj.mesh);
			this.world.removeBody(obj.body);
			obj.mesh.geometry.dispose();
			(obj.mesh.material as THREE.Material).dispose();
		}
		this.objects = [];
	}

	private getRandomColor(): number {
		const colors = [0x00d9ff, 0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181, 0xaa96da, 0xfcbad3];
		return colors[Math.floor(Math.random() * colors.length)];
	}
}
