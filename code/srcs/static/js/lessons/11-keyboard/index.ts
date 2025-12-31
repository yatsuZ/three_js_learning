import * as THREE from 'three';
import { LessonBase, addLights, createOrbitControls, loadGLTF, fitModelToView, Logger } from '../../shared/index.ts';
import type { LessonConfig, LoadedModel } from '../../shared/index.ts';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getUIElements, updateKeyDisplay, updatePositionDisplay } from './ui.ts';
import type { UIElements } from './ui.ts';
import { KeyboardController } from './keyboard.ts';

// Position initiale
const CAMERA_SPAWN = { x: 0, y: 5, z: 10 };
const OBJECT_SPAWN = { x: 0, y: 0.5, z: 0 };
const GLB_URL = '/static/assets/exemple_default.glb';

/**
 * Lecon 11 - Keyboard Controls
 */
class Lesson11 extends LessonBase {
	private controls!: OrbitControls;
	private ui!: UIElements;
	private cube!: THREE.Mesh;
	private keyboardController!: KeyboardController;
	private glbModel: LoadedModel | null = null;
	private isGlbMode = false;
	private currentTarget!: THREE.Object3D;

	constructor() {
		const config: LessonConfig = { id: '11', name: 'Keyboard Controls' };
		super(config);
	}

	protected setup(): void {
		this.setupLights();
		this.setupControls();
		this.setupScene();
		this.setupUI();
		this.setupEventListeners();

		// Creer le controleur clavier
		this.keyboardController = new KeyboardController(this.cube, {
			speed: 5,
			normalize: true,
			boundaries: { min: -8, max: 8 }
		});
		this.currentTarget = this.cube;

		this.onDispose(() => {
			this.keyboardController.dispose();
			this.controls.dispose();
			if (this.glbModel) {
				this.scene.remove(this.glbModel.scene);
			}
		});
	}

	protected update(delta: number): void {
		this.controls.update();

		// Mettre a jour le mouvement clavier
		this.keyboardController.update(delta);

		// Mettre a jour l'affichage des touches
		const keys = this.keyboardController.getActiveKeys();
		updateKeyDisplay(this.ui, keys);

		// Mettre a jour l'affichage de la position
		const pos = this.currentTarget.position;
		updatePositionDisplay(this.ui, pos.x, pos.y, pos.z);
	}

	private setupLights(): void {
		addLights(this.scene, {
			ambient: { color: '#ffffff', intensity: 0.5 },
			directional: { color: '#ffffff', intensity: 1, position: { x: 5, y: 10, z: 5 } }
		});
	}

	private setupControls(): void {
		this.controls = createOrbitControls(this.sceneContext, {
			minDistance: 5,
			maxDistance: 30,
			enableDamping: true
		});
	}

	private setupScene(): void {
		// Sol avec grille
		const floorGeometry = new THREE.PlaneGeometry(20, 20);
		const floorMaterial = new THREE.MeshStandardMaterial({
			color: 0x333333,
			roughness: 0.8
		});
		const floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.rotation.x = -Math.PI / 2;
		floor.position.y = 0;
		this.scene.add(floor);

		// Grille
		const grid = new THREE.GridHelper(20, 20, 0x00d9ff, 0x444444);
		grid.position.y = 0.01;
		this.scene.add(grid);

		// Zone limite (wireframe)
		const boundaryGeometry = new THREE.BoxGeometry(16, 10, 16);
		const boundaryMaterial = new THREE.MeshBasicMaterial({
			color: 0x00d9ff,
			wireframe: true,
			transparent: true,
			opacity: 0.2
		});
		const boundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
		boundary.position.y = 5;
		this.scene.add(boundary);

		// Cube controlable
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshStandardMaterial({
			color: 0x00d9ff,
			roughness: 0.5,
			metalness: 0.3
		});
		this.cube = new THREE.Mesh(geometry, material);
		this.cube.position.set(OBJECT_SPAWN.x, OBJECT_SPAWN.y, OBJECT_SPAWN.z);
		this.scene.add(this.cube);

		// Indicateur de direction (fleche)
		const arrowGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
		const arrowMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
		const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
		arrow.position.set(0, 0.5, -0.7);
		arrow.rotation.x = -Math.PI / 2;
		this.cube.add(arrow);
	}

	private setupUI(): void {
		this.ui = getUIElements();
	}

	private setupEventListeners(): void {
		// GLB mode toggle
		this.addEventListener(this.ui.glbModeToggle, 'change', () => {
			this.toggleGlbMode(this.ui.glbModeToggle.checked);
		});

		// Speed slider
		this.addEventListener(this.ui.speed, 'input', () => {
			const speed = parseInt(this.ui.speed.value);
			this.ui.speedValue.textContent = speed.toString();
			this.keyboardController.setSpeed(speed);
		});

		// Normalize toggle
		this.addEventListener(this.ui.normalizeToggle, 'change', () => {
			this.keyboardController.setNormalize(this.ui.normalizeToggle.checked);
		});

		// Boundaries toggle
		this.addEventListener(this.ui.boundariesToggle, 'change', () => {
			this.keyboardController.setBoundaries(
				this.ui.boundariesToggle.checked ? { min: -8, max: 8 } : null
			);
		});

		// Reset button
		this.addEventListener(this.ui.resetBtn, 'click', () => {
			this.resetPosition();
		});
	}

	private async toggleGlbMode(enabled: boolean): Promise<void> {
		this.isGlbMode = enabled;

		if (enabled) {
			// Cacher le cube
			this.cube.visible = false;

			// Charger le modele GLB si pas deja fait
			if (!this.glbModel) {
				try {
					Logger.info('Chargement du modele GLB...');
					this.glbModel = await loadGLTF(GLB_URL);
					fitModelToView(this.glbModel.scene, 2);
					this.glbModel.scene.position.set(OBJECT_SPAWN.x, OBJECT_SPAWN.y, OBJECT_SPAWN.z);
					this.scene.add(this.glbModel.scene);
				} catch (error) {
					Logger.error('Erreur chargement GLB:', error);
					this.cube.visible = true;
					this.ui.glbModeToggle.checked = false;
					this.isGlbMode = false;
					return;
				}
			} else {
				this.glbModel.scene.visible = true;
			}

			// Changer la cible du controleur
			this.currentTarget = this.glbModel.scene;
			this.keyboardController.setTarget(this.glbModel.scene);
		} else {
			// Cacher le modele GLB
			if (this.glbModel) {
				this.glbModel.scene.visible = false;
			}

			// Montrer le cube
			this.cube.visible = true;

			// Remettre le cube comme cible
			this.currentTarget = this.cube;
			this.keyboardController.setTarget(this.cube);
		}
	}

	private resetPosition(): void {
		this.currentTarget.position.set(OBJECT_SPAWN.x, OBJECT_SPAWN.y, OBJECT_SPAWN.z);

		// Reset camera
		this.camera.position.set(CAMERA_SPAWN.x, CAMERA_SPAWN.y, CAMERA_SPAWN.z);
		this.camera.lookAt(0, 0, 0);
		this.controls.target.set(0, 0, 0);
		this.controls.update();
	}
}

// Demarrer la lecon
new Lesson11().start();
