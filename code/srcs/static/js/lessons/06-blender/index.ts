import * as THREE from 'three';
import { LessonBase, createOrbitControls, Logger } from '../../shared/index.ts';
import type { LessonConfig } from '../../shared/index.ts';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { getUIElements, resetUIValues, DEFAULT_VALUES } from './ui.ts';
import type { UIElements } from './ui.ts';
import { ModelController } from './model.ts';

// Config
const DEFAULT_MODEL_URL = '/static/assets/exemple_default.glb';

/**
 * Lecon 06 - Import de modeles Blender (GLB/GLTF)
 */
class Lesson06 extends LessonBase {
	// Three.js objects
	private ambientLight!: THREE.AmbientLight;
	private pointLight!: THREE.PointLight;
	private directionalLight!: THREE.DirectionalLight;
	private backLight!: THREE.DirectionalLight;
	private gridHelper!: THREE.GridHelper;
	private controls!: OrbitControls;

	// Controllers
	private modelController!: ModelController;
	private ui!: UIElements;

	// State
	private autoRotate: boolean = DEFAULT_VALUES.autoRotate;
	private rotationSpeed: number = DEFAULT_VALUES.rotationSpeed;
	private animationSpeed: number = DEFAULT_VALUES.animSpeed;

	constructor() {
		const config: LessonConfig = { id: '06', name: 'Blender Import' };
		super(config);
	}

	protected async setup(): Promise<void> {
		this.setupLights();
		this.setupGrid();
		this.setupControls();
		this.ui = getUIElements();
		this.modelController = new ModelController(this.scene, DEFAULT_VALUES.modelScale);

		this.setupEventListeners();
		await this.loadDefaultModel();

		this.onDispose(() => {
			this.modelController.clear();
			this.controls.dispose();
		});
	}

	protected update(delta: number): void {
		this.modelController.updateAnimations(delta, this.animationSpeed);

		if (this.autoRotate) {
			this.modelController.rotate(0.005 * this.rotationSpeed);
		}

		this.controls.update();
	}

	// === Setup methods ===

	private setupLights(): void {
		this.ambientLight = new THREE.AmbientLight('#ffffff', DEFAULT_VALUES.ambientIntensity);
		this.pointLight = new THREE.PointLight('#ffffff', DEFAULT_VALUES.pointIntensity, 100);
		this.pointLight.position.set(5, 5, 5);
		this.directionalLight = new THREE.DirectionalLight('#ffffff', DEFAULT_VALUES.directionalIntensity);
		this.directionalLight.position.set(-5, 10, 5);
		this.backLight = new THREE.DirectionalLight('#ffffff', 0.8);
		this.backLight.position.set(0, -5, -5);

		this.scene.add(this.ambientLight, this.pointLight, this.directionalLight, this.backLight);
	}

	private setupGrid(): void {
		this.gridHelper = new THREE.GridHelper(10, 10, '#444444', '#333333');
		this.scene.add(this.gridHelper);
	}

	private setupControls(): void {
		this.controls = createOrbitControls(this.sceneContext, {
			minDistance: 1,
			maxDistance: 20,
			enableDamping: true
		});
	}

	private setupEventListeners(): void {
		// Upload
		this.addEventListener(this.ui.uploadInput, 'change', (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) this.loadModelFile(file);
		});

		// Rotation
		this.addEventListener(this.ui.autoRotate, 'change', () => {
			this.autoRotate = this.ui.autoRotate.checked;
		});
		this.addEventListener(this.ui.rotationSpeed, 'input', () => {
			this.rotationSpeed = parseFloat(this.ui.rotationSpeed.value);
		});

		// Lights
		this.addEventListener(this.ui.ambientSlider, 'input', () => {
			this.ambientLight.intensity = parseFloat(this.ui.ambientSlider.value);
		});
		this.addEventListener(this.ui.pointSlider, 'input', () => {
			this.pointLight.intensity = parseFloat(this.ui.pointSlider.value);
		});
		this.addEventListener(this.ui.directionalSlider, 'input', () => {
			this.directionalLight.intensity = parseFloat(this.ui.directionalSlider.value);
		});

		// Display
		this.addEventListener(this.ui.showGrid, 'change', () => {
			this.gridHelper.visible = this.ui.showGrid.checked;
		});
		this.addEventListener(this.ui.wireframe, 'change', () => {
			this.modelController.setWireframe(this.ui.wireframe.checked);
		});
		this.addEventListener(this.ui.enhanceMaterials, 'change', () => {
			this.modelController.enhanceMaterials(this.ui.enhanceMaterials.checked, this.ui.wireframe.checked);
		});
		this.addEventListener(this.ui.bgColor, 'input', () => {
			this.scene.background = new THREE.Color(this.ui.bgColor.value);
		});

		// Animation & Scale
		this.addEventListener(this.ui.animSpeed, 'input', () => {
			this.animationSpeed = parseFloat(this.ui.animSpeed.value);
		});
		this.addEventListener(this.ui.modelScale, 'input', () => {
			this.modelController.rescale(parseFloat(this.ui.modelScale.value));
		});

		// Reset
		this.addEventListener(this.ui.resetBtn, 'click', () => this.resetAll());
	}

	// === Model loading ===

	private async loadDefaultModel(): Promise<void> {
		this.ui.loading.style.display = 'block';
		const model = await this.modelController.loadFromUrl(DEFAULT_MODEL_URL);
		this.ui.loading.style.display = 'none';

		if (model) {
			this.updateModelInfo('exemple_default.glb', model.animations.length);
			this.modelController.playFirstAnimation();
		}
	}

	private async loadModelFile(file: File): Promise<void> {
		this.ui.loading.style.display = 'block';
		this.ui.enhanceMaterials.checked = false;

		try {
			const model = await this.modelController.loadFromFile(file);
			if (model) {
				this.updateModelInfo(file.name, model.animations.length);
				this.modelController.playFirstAnimation();
				Logger.success(`Model loaded: ${file.name}`);
			}
		} catch {
			alert('Erreur lors du chargement. Verifiez le format (.glb ou .gltf)');
		} finally {
			this.ui.loading.style.display = 'none';
		}
	}

	private updateModelInfo(name: string, animCount: number): void {
		this.ui.modelName.textContent = name;
		this.ui.animCount.textContent = String(animCount);
	}

	// === Reset ===

	private resetAll(): void {
		resetUIValues(this.ui);

		this.autoRotate = DEFAULT_VALUES.autoRotate;
		this.rotationSpeed = DEFAULT_VALUES.rotationSpeed;
		this.animationSpeed = DEFAULT_VALUES.animSpeed;

		this.ambientLight.intensity = DEFAULT_VALUES.ambientIntensity;
		this.pointLight.intensity = DEFAULT_VALUES.pointIntensity;
		this.directionalLight.intensity = DEFAULT_VALUES.directionalIntensity;
		this.gridHelper.visible = DEFAULT_VALUES.showGrid;

		this.modelController.setWireframe(false);
		this.modelController.enhanceMaterials(false, false);
		this.modelController.rescale(DEFAULT_VALUES.modelScale);

		this.scene.background = new THREE.Color(DEFAULT_VALUES.bgColor);
	}
}

// Start
new Lesson06().start();
