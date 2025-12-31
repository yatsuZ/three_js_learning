import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import type { ShapeType } from './ui.ts';

/**
 * Configuration d'un objet physique
 */
export interface PhysicsObjectConfig {
	shape: ShapeType;
	position: THREE.Vector3;
	mass: number;
	restitution: number;
	friction: number;
	color?: number;
	breakable?: boolean;
}

/**
 * Paire mesh/body pour la synchronisation
 */
export interface PhysicsObject {
	mesh: THREE.Mesh;
	body: CANNON.Body;
	breakable: boolean;
	health: number;
}

/**
 * Couleurs disponibles pour les objets
 */
const OBJECT_COLORS = [
	0x00d9ff, // Cyan
	0xff6b6b, // Rouge
	0x4ecdc4, // Turquoise
	0xffe66d, // Jaune
	0x95e1d3, // Vert menthe
	0xf38181, // Corail
	0xaa96da, // Violet
	0xfcbad3  // Rose
];

/**
 * Retourne une couleur aleatoire
 */
export function getRandomColor(): number {
	return OBJECT_COLORS[Math.floor(Math.random() * OBJECT_COLORS.length)];
}

/**
 * Cree un mesh et shape selon la forme
 */
export function createMeshAndShape(
	shape: ShapeType,
	color: number
): { mesh: THREE.Mesh; cannonShape: CANNON.Shape } {
	let mesh: THREE.Mesh;
	let cannonShape: CANNON.Shape;

	switch (shape) {
		case 'sphere': {
			const radius = 0.5;
			mesh = new THREE.Mesh(
				new THREE.SphereGeometry(radius, 32, 32),
				new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.3 })
			);
			cannonShape = new CANNON.Sphere(radius);
			break;
		}
		case 'cylinder': {
			const radius = 0.4;
			const height = 1;
			mesh = new THREE.Mesh(
				new THREE.CylinderGeometry(radius, radius, height, 32),
				new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.3 })
			);
			cannonShape = new CANNON.Cylinder(radius, radius, height, 16);
			break;
		}
		case 'box':
		default: {
			const size = 1;
			mesh = new THREE.Mesh(
				new THREE.BoxGeometry(size, size, size),
				new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.3 })
			);
			cannonShape = new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2));
			break;
		}
	}

	mesh.castShadow = true;
	mesh.receiveShadow = true;

	return { mesh, cannonShape };
}

/**
 * Cree des debris a partir d'un objet casse
 */
export function createDebris(
	pos: CANNON.Vec3,
	vel: CANNON.Vec3,
	originalColor: number,
	scene: THREE.Scene,
	world: CANNON.World,
	material: CANNON.Material
): PhysicsObject[] {
	const debris: PhysicsObject[] = [];
	const debrisCount = 4 + Math.floor(Math.random() * 4);

	for (let i = 0; i < debrisCount; i++) {
		const size = 0.15 + Math.random() * 0.2;

		// Mesh debris
		const debrisMesh = new THREE.Mesh(
			new THREE.BoxGeometry(size, size, size),
			new THREE.MeshStandardMaterial({
				color: originalColor,
				roughness: 0.6
			})
		);
		debrisMesh.castShadow = true;
		debrisMesh.position.set(
			pos.x + (Math.random() - 0.5) * 0.5,
			pos.y + (Math.random() - 0.5) * 0.5,
			pos.z + (Math.random() - 0.5) * 0.5
		);
		scene.add(debrisMesh);

		// Body debris
		const debrisBody = new CANNON.Body({
			mass: 0.2,
			material
		});
		debrisBody.addShape(new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2)));
		debrisBody.position.set(debrisMesh.position.x, debrisMesh.position.y, debrisMesh.position.z);

		// Explosion velocity
		debrisBody.velocity.set(
			vel.x + (Math.random() - 0.5) * 5,
			vel.y + Math.random() * 3,
			vel.z + (Math.random() - 0.5) * 5
		);
		debrisBody.angularVelocity.set(
			(Math.random() - 0.5) * 10,
			(Math.random() - 0.5) * 10,
			(Math.random() - 0.5) * 10
		);

		world.addBody(debrisBody);

		debris.push({
			mesh: debrisMesh,
			body: debrisBody,
			breakable: false,
			health: 100
		});
	}

	return debris;
}

/**
 * Dispose un objet physique
 */
export function disposeObject(obj: PhysicsObject, scene: THREE.Scene, world: CANNON.World): void {
	scene.remove(obj.mesh);
	world.removeBody(obj.body);
	if (obj.mesh.geometry) obj.mesh.geometry.dispose();
	if (obj.mesh.material) {
		if (Array.isArray(obj.mesh.material)) {
			obj.mesh.material.forEach(m => m.dispose());
		} else {
			obj.mesh.material.dispose();
		}
	}
}
