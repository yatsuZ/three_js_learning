import * as THREE from 'three';

export interface CubeOptions {
	size?: number;
	color?: string;
	wireframe?: boolean;
	transparent?: boolean;
	opacity?: number;
	position?: { x: number; y: number; z: number };
	rotationSpeed?: { x: number; y: number; z: number };
	// Pour les materiaux qui reagissent a la lumiere
	useLighting?: boolean;
	metalness?: number;
	roughness?: number;
}

const DEFAULT_OPTIONS: CubeOptions = {
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
	mesh: THREE.Mesh;
	rotationSpeed: { x: number; y: number; z: number };

	constructor(scene: THREE.Scene, options: CubeOptions = {}) {
		const config = { ...DEFAULT_OPTIONS, ...options };

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
		this.mesh.position.set(config.position!.x, config.position!.y, config.position!.z);

		// Rotation speed: utiliser celle fournie ou generer aleatoirement
		this.rotationSpeed = config.rotationSpeed ?? {
			x: (Math.random() - 0.5) * 0.02,
			y: (Math.random() - 0.5) * 0.02,
			z: (Math.random() - 0.5) * 0.02
		};

		scene.add(this.mesh);
	}

	update(): void {
		this.mesh.rotation.x += this.rotationSpeed.x;
		this.mesh.rotation.y += this.rotationSpeed.y;
		this.mesh.rotation.z += this.rotationSpeed.z;
	}

	destroy(scene: THREE.Scene): void {
		scene.remove(this.mesh);
		this.mesh.geometry.dispose();
		(this.mesh.material as THREE.Material).dispose();
	}
}
