import * as THREE from 'three';
import {
	LessonBase,
	addLights,
	createOrbitControls,
	createCheckerTexture,
	createNoiseTexture,
	createGradientTexture,
	Logger,
	DOM
} from '../../shared/index.ts';
import type { LessonConfig } from '../../shared/index.ts';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Lecon 05 - Textures procedurales et custom
 */
class Lesson05 extends LessonBase {
	private cubes: THREE.Mesh[] = [];
	private controls!: OrbitControls;

	constructor() {
		const config: LessonConfig = {
			id: '05',
			name: 'Textures'
		};
		super(config);
	}

	protected setup(): void {
		// Lumieres
		addLights(this.scene, {
			ambient: { color: '#ffffff', intensity: 0.8 },
			point: { color: '#ffffff', intensity: 1.5, distance: 100, position: { x: 5, y: 5, z: 5 } },
			directional: { color: '#ffffff', intensity: 1, position: { x: -5, y: 10, z: 5 } }
		});

		// Controles camera
		this.controls = createOrbitControls(this.sceneContext, { minDistance: 3, maxDistance: 20 });

		// Setup cubes et labels
		this.setupCubes();
		this.createLabels();
		this.setupUpload();

		// Cleanup
		this.onDispose(() => {
			this.cubes.forEach(cube => {
				cube.geometry.dispose();
				if (cube.material instanceof THREE.Material) {
					cube.material.dispose();
				}
			});
			this.controls.dispose();
		});
	}

	protected update(_delta: number): void {
		this.controls.update();
		this.rotateCubes();
	}

	private createTexturedCube(texture: THREE.Texture | null, position: { x: number; y: number; z: number }): THREE.Mesh {
		const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
		const material = new THREE.MeshStandardMaterial({
			map: texture,
			metalness: 0.1,
			roughness: 0.8
		});
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(position.x, position.y, position.z);
		this.scene.add(mesh);
		return mesh;
	}

	private setupCubes(): void {
		// Cube 1: Damier
		const checker = createCheckerTexture(32, '#00d9ff', '#1a1a2e');
		this.cubes.push(this.createTexturedCube(checker, { x: -3, y: 0, z: 0 }));

		// Cube 2: Bruit
		const noise = createNoiseTexture(128);
		this.cubes.push(this.createTexturedCube(noise, { x: -1, y: 0, z: 0 }));

		// Cube 3: Gradient
		const gradient = createGradientTexture('#00d9ff', '#ff6b6b');
		this.cubes.push(this.createTexturedCube(gradient, { x: 1, y: 0, z: 0 }));

		// Cube 4: Custom (vide par defaut)
		this.cubes.push(this.createTexturedCube(null, { x: 3, y: 0, z: 0 }));
		(this.cubes[3].material as THREE.MeshStandardMaterial).color.set('#888888');
	}

	private createLabels(): void {
		const labels = ['Damier', 'Bruit', 'Gradient', 'Custom'];
		const positions = [-3, -1, 1, 3];

		labels.forEach((text, i) => {
			const canvas = document.createElement('canvas');
			canvas.width = 256;
			canvas.height = 64;
			const context = canvas.getContext('2d')!;
			context.fillStyle = '#00d9ff';
			context.font = 'bold 32px Arial';
			context.textAlign = 'center';
			context.fillText(text, 128, 40);

			const texture = new THREE.CanvasTexture(canvas);
			const material = new THREE.SpriteMaterial({ map: texture });
			const sprite = new THREE.Sprite(material);
			sprite.position.set(positions[i], -1.5, 0);
			sprite.scale.set(2, 0.5, 1);
			this.scene.add(sprite);
		});
	}

	private setupUpload(): void {
		const input = DOM.input('texture-upload');
		this.addEventListener(input, 'change', (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = (event) => {
				const img = new Image();
				img.onload = () => {
					const texture = new THREE.Texture(img);
					texture.needsUpdate = true;
					texture.colorSpace = THREE.SRGBColorSpace;

					// Appliquer au cube custom (index 3)
					const material = this.cubes[3].material as THREE.MeshStandardMaterial;
					material.map = texture;
					material.color.set('#ffffff');
					material.needsUpdate = true;
					Logger.info('Texture custom appliquee');
				};
				img.src = event.target?.result as string;
			};
			reader.readAsDataURL(file);
		});
	}

	private rotateCubes(): void {
		this.cubes.forEach(cube => {
			cube.rotation.x += 0.005;
			cube.rotation.y += 0.01;
		});
	}
}

// Demarrer la lecon
const lesson = new Lesson05();
lesson.start();
