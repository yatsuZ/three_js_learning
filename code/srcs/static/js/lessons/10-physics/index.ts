import * as THREE from 'three';
import { LessonBase, addLights, createOrbitControls } from '../../shared/index.ts';
import type { LessonConfig } from '../../shared/index.ts';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { getUIElements, type UIElements, type ShapeType } from './ui.ts';
import { PhysicsWorld } from './physics.ts';

/**
 * Lecon 10 - Physics avec Cannon.js
 */
class Lesson10 extends LessonBase {
	private controls!: OrbitControls;
	private ui!: UIElements;
	private physics!: PhysicsWorld;
	private raycaster = new THREE.Raycaster();
	private mouse = new THREE.Vector2();
	private groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

	constructor() {
		const config: LessonConfig = { id: '10', name: 'Physics' };
		super(config);
	}

	protected setup(): void {
		this.setupLights();
		this.setupControls();
		this.setupPhysics();
		this.setupUI();
		this.setupEventListeners();

		// Activer les ombres
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.onDispose(() => {
			this.physics.dispose();
			this.controls.dispose();
		});
	}

	protected update(delta: number): void {
		this.controls.update();
		this.physics.update(delta);
		this.updateObjectCount();
	}

	private setupLights(): void {
		// Ambient light
		const ambient = new THREE.AmbientLight(0xffffff, 0.4);
		this.scene.add(ambient);

		// Directional light avec ombres
		const dirLight = new THREE.DirectionalLight(0xffffff, 1);
		dirLight.position.set(10, 20, 10);
		dirLight.castShadow = true;
		dirLight.shadow.mapSize.set(2048, 2048);
		dirLight.shadow.camera.near = 0.5;
		dirLight.shadow.camera.far = 50;
		dirLight.shadow.camera.left = -15;
		dirLight.shadow.camera.right = 15;
		dirLight.shadow.camera.top = 15;
		dirLight.shadow.camera.bottom = -15;
		this.scene.add(dirLight);
	}

	private setupControls(): void {
		this.controls = createOrbitControls(this.sceneContext, {
			minDistance: 5,
			maxDistance: 40,
			enableDamping: true,
			maxPolarAngle: Math.PI / 2 - 0.1 // Empecher de passer sous le sol
		});
		this.camera.position.set(10, 10, 10);
		this.camera.lookAt(0, 0, 0);
	}

	private setupPhysics(): void {
		this.physics = new PhysicsWorld(this.scene);
		this.physics.createGround(20);
		this.physics.createWalls(10, 20);

		// Grille de reference
		const grid = new THREE.GridHelper(20, 20, 0x00d9ff, 0x444444);
		grid.position.y = 0.01;
		this.scene.add(grid);
	}

	private setupUI(): void {
		this.ui = getUIElements();
	}

	private setupEventListeners(): void {
		// Spawn button
		this.addEventListener(this.ui.spawnBtn, 'click', () => {
			this.spawnObject();
		});

		// Rain button
		this.addEventListener(this.ui.rainBtn, 'click', () => {
			this.physics.spawnRain(10, this.getObjectConfig());
		});

		// Clear button
		this.addEventListener(this.ui.clearBtn, 'click', () => {
			this.physics.clearObjects();
		});

		// Reset button
		this.addEventListener(this.ui.resetBtn, 'click', () => {
			this.reset();
		});

		// Mass slider
		this.addEventListener(this.ui.mass, 'input', () => {
			this.ui.massValue.textContent = this.ui.mass.value;
		});

		// Restitution slider
		this.addEventListener(this.ui.restitution, 'input', () => {
			this.ui.restitutionValue.textContent = this.ui.restitution.value;
			this.updatePhysicsProperties();
		});

		// Friction slider
		this.addEventListener(this.ui.friction, 'input', () => {
			this.ui.frictionValue.textContent = this.ui.friction.value;
			this.updatePhysicsProperties();
		});

		// Gravity slider
		this.addEventListener(this.ui.gravity, 'input', () => {
			this.ui.gravityValue.textContent = this.ui.gravity.value;
			this.physics.setGravity(parseFloat(this.ui.gravity.value));
		});

		// Debug toggle
		this.addEventListener(this.ui.debugToggle, 'change', () => {
			this.physics.setDebug(this.ui.debugToggle.checked);
		});

		// Sound toggle
		this.addEventListener(this.ui.soundToggle, 'change', () => {
			this.physics.setSoundEnabled(this.ui.soundToggle.checked);
		});

		// Export button
		this.addEventListener(this.ui.exportBtn, 'click', () => {
			this.exportGLB();
		});

		// Click sur le canvas pour spawn
		this.addEventListener(this.canvas, 'click', (e: Event) => {
			const mouseEvent = e as MouseEvent;
			this.onCanvasClick(mouseEvent);
		});

		// Afficher le max d'objets
		this.ui.maxObjects.textContent = this.physics.getMaxObjects().toString();
	}

	private onCanvasClick(event: MouseEvent): void {
		// Calculer la position du clic
		const rect = this.canvas.getBoundingClientRect();
		this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		// Raycaster pour trouver le point sur le sol
		this.raycaster.setFromCamera(this.mouse, this.camera);
		const intersection = new THREE.Vector3();

		if (this.raycaster.ray.intersectPlane(this.groundPlane, intersection)) {
			// Limiter aux bounds
			intersection.x = Math.max(-9, Math.min(9, intersection.x));
			intersection.z = Math.max(-9, Math.min(9, intersection.z));

			// Spawn au-dessus du point clique
			this.physics.spawnAt(
				intersection.x,
				5,
				intersection.z,
				this.getObjectConfig()
			);
		}
	}

	private spawnObject(): void {
		this.physics.spawnRandom(this.getObjectConfig());
	}

	private getObjectConfig() {
		return {
			shape: this.ui.shape.value as ShapeType,
			mass: parseFloat(this.ui.mass.value),
			restitution: parseFloat(this.ui.restitution.value),
			friction: parseFloat(this.ui.friction.value),
			breakable: this.ui.breakableToggle.checked
		};
	}

	private updatePhysicsProperties(): void {
		this.physics.updateContactProperties(
			parseFloat(this.ui.friction.value),
			parseFloat(this.ui.restitution.value)
		);
	}

	private updateObjectCount(): void {
		this.ui.objectCount.textContent = this.physics.getObjectCount().toString();
	}

	private reset(): void {
		// Clear objects
		this.physics.clearObjects();

		// Reset UI
		this.ui.shape.value = 'box';
		this.ui.mass.value = '1';
		this.ui.massValue.textContent = '1';
		this.ui.restitution.value = '0.5';
		this.ui.restitutionValue.textContent = '0.5';
		this.ui.friction.value = '0.3';
		this.ui.frictionValue.textContent = '0.3';
		this.ui.gravity.value = '-10';
		this.ui.gravityValue.textContent = '-10';
		this.ui.debugToggle.checked = false;
		this.ui.soundToggle.checked = true;
		this.ui.breakableToggle.checked = false;

		// Reset physics
		this.physics.setGravity(-10);
		this.physics.setSoundEnabled(true);
		this.updatePhysicsProperties();

		// Reset camera
		this.camera.position.set(10, 10, 10);
		this.camera.lookAt(0, 0, 0);
		this.controls.target.set(0, 0, 0);
		this.controls.update();
	}

	private exportGLB(): void {
		const exporter = new GLTFExporter();

		// Exporter la scene
		exporter.parse(
			this.scene,
			(gltf) => {
				// Convertir en blob
				const blob = new Blob([gltf as ArrayBuffer], { type: 'application/octet-stream' });
				const url = URL.createObjectURL(blob);

				// Telecharger
				const link = document.createElement('a');
				link.href = url;
				link.download = 'physics-scene.glb';
				link.click();

				URL.revokeObjectURL(url);
			},
			(error) => {
				console.error('Erreur export GLB:', error);
			},
			{ binary: true }
		);
	}
}

// Demarrer la lecon
new Lesson10().start();
