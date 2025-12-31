import * as THREE from 'three';
import { LessonBase, addLights, createOrbitControls } from '../../shared/index.ts';
import type { LessonConfig } from '../../shared/index.ts';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getUIElements, getAnimationOptions } from './ui.ts';
import type { UIElements } from './ui.ts';
import { AnimationController } from './animations/index.ts';

/**
 * Lecon 07 - Animations avec GSAP
 */
// Position initiale de la camera
const CAMERA_SPAWN = { x: 0, y: 2, z: 10 };

class Lesson07 extends LessonBase {
	private controls!: OrbitControls;
	private cubes: THREE.Mesh[] = [];
	private ui!: UIElements;
	private animator!: AnimationController;

	constructor() {
		const config: LessonConfig = { id: '07', name: 'Animations GSAP' };
		super(config);
	}

	protected setup(): void {
		this.setupLights();
		this.setupControls();
		this.setupCubes();
		this.setupUI();
		this.setupEventListeners();

		this.onDispose(() => {
			this.animator.killAll();
			this.controls.dispose();
		});
	}

	protected update(_delta: number): void {
		this.controls.update();
	}

	private setupLights(): void {
		addLights(this.scene, {
			ambient: { color: '#ffffff', intensity: 0.6 },
			point: { color: '#ffffff', intensity: 1.5, distance: 100, position: { x: 5, y: 5, z: 5 } },
			directional: { color: '#ffffff', intensity: 1, position: { x: -5, y: 10, z: 5 } }
		});
	}

	private setupControls(): void {
		this.controls = createOrbitControls(this.sceneContext, {
			minDistance: 5,
			maxDistance: 20,
			enableDamping: true
		});
	}

	private setupCubes(): void {
		const colors = ['#00d9ff', '#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3'];
		const positions = [
			{ x: -4, y: 0, z: 0 },
			{ x: -2, y: 0, z: 0 },
			{ x: 0, y: 0, z: 0 },
			{ x: 2, y: 0, z: 0 },
			{ x: 4, y: 0, z: 0 }
		];

		positions.forEach((pos, i) => {
			const geometry = new THREE.BoxGeometry(1, 1, 1);
			const material = new THREE.MeshStandardMaterial({
				color: colors[i],
				metalness: 0.3,
				roughness: 0.7
			});
			const cube = new THREE.Mesh(geometry, material);
			cube.position.set(pos.x, pos.y, pos.z);
			this.scene.add(cube);
			this.cubes.push(cube);
		});

		this.animator = new AnimationController(this.cubes);
	}

	private setupUI(): void {
		this.ui = getUIElements();
	}

	private setupEventListeners(): void {
		// Play button
		this.addEventListener(this.ui.playBtn, 'click', () => {
			const options = getAnimationOptions(this.ui);
			this.animator.play(this.ui.animationSelect.value, options);
		});

		// Reset button - reset cubes + camera
		this.addEventListener(this.ui.resetBtn, 'click', () => {
			this.animator.reset();
			this.resetCamera();
		});

		// Duration slider
		this.addEventListener(this.ui.duration, 'input', () => {
			this.ui.durationValue.textContent = `${this.ui.duration.value}s`;
		});

		// Timeline controls
		this.addEventListener(this.ui.pauseBtn, 'click', () => this.animator.pause());
		this.addEventListener(this.ui.resumeBtn, 'click', () => this.animator.resume());
		this.addEventListener(this.ui.reverseBtn, 'click', () => this.animator.reverse());
	}

	private resetCamera(): void {
		this.camera.position.set(CAMERA_SPAWN.x, CAMERA_SPAWN.y, CAMERA_SPAWN.z);
		this.camera.lookAt(0, 0, 0);
		this.controls.target.set(0, 0, 0);
		this.controls.update();
	}
}

// Demarrer la lecon
new Lesson07().start();
