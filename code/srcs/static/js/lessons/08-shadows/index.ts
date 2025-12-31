import * as THREE from 'three';
import { LessonBase, createOrbitControls } from '../../shared/index.ts';
import type { LessonConfig } from '../../shared/index.ts';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getUIElements, DEFAULT_VALUES } from './ui.ts';
import type { UIElements } from './ui.ts';
import { createFloor, createCubes, createSphere, createDirectionalLight } from './scene.ts';

// Position initiale de la camera
const CAMERA_SPAWN = { x: 5, y: 5, z: 10 };

/**
 * Lecon 08 - Shadows
 */
class Lesson08 extends LessonBase {
	private controls!: OrbitControls;
	private ui!: UIElements;
	private directionalLight!: THREE.DirectionalLight;
	private shadowHelper!: THREE.CameraHelper;
	private cubes: THREE.Mesh[] = [];

	constructor() {
		const config: LessonConfig = { id: '08', name: 'Shadows' };
		super(config);
	}

	protected setup(): void {
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFShadowMap;

		this.setupLights();
		this.setupControls();
		this.setupScene();
		this.setupUI();
		this.setupEventListeners();

		this.onDispose(() => {
			this.controls.dispose();
		});
	}

	protected update(_delta: number): void {
		this.controls.update();
		this.cubes.forEach(cube => {
			cube.rotation.x += 0.005;
			cube.rotation.y += 0.01;
		});
	}

	private setupLights(): void {
		const ambient = new THREE.AmbientLight(0xffffff, 0.3);
		this.scene.add(ambient);

		const { light, helper } = createDirectionalLight(
			this.scene,
			{ x: DEFAULT_VALUES.lightX, y: DEFAULT_VALUES.lightY, z: DEFAULT_VALUES.lightZ },
			DEFAULT_VALUES.shadowQuality,
			DEFAULT_VALUES.shadowBias
		);
		this.directionalLight = light;
		this.shadowHelper = helper;
	}

	private setupControls(): void {
		this.controls = createOrbitControls(this.sceneContext, {
			minDistance: 5,
			maxDistance: 30,
			enableDamping: true
		});
	}

	private setupScene(): void {
		createFloor(this.scene);
		this.cubes = createCubes(this.scene);
		createSphere(this.scene);
	}

	private setupUI(): void {
		this.ui = getUIElements();
	}

	private setupEventListeners(): void {
		this.addEventListener(this.ui.shadowsToggle, 'change', () => {
			this.renderer.shadowMap.enabled = this.ui.shadowsToggle.checked;
			this.directionalLight.shadow.needsUpdate = true;
		});

		this.addEventListener(this.ui.helperToggle, 'change', () => {
			this.shadowHelper.visible = this.ui.helperToggle.checked;
		});

		this.addEventListener(this.ui.shadowType, 'change', () => {
			this.updateShadowType(this.ui.shadowType.value);
		});

		this.addEventListener(this.ui.shadowQuality, 'change', () => {
			const size = parseInt(this.ui.shadowQuality.value);
			this.directionalLight.shadow.mapSize.set(size, size);
			this.directionalLight.shadow.map?.dispose();
			this.directionalLight.shadow.map = null as unknown as THREE.WebGLRenderTarget;
		});

		this.addEventListener(this.ui.lightX, 'input', () => {
			const val = parseFloat(this.ui.lightX.value);
			this.ui.lightXValue.textContent = val.toString();
			this.directionalLight.position.x = val;
			this.shadowHelper.update();
		});

		this.addEventListener(this.ui.lightY, 'input', () => {
			const val = parseFloat(this.ui.lightY.value);
			this.ui.lightYValue.textContent = val.toString();
			this.directionalLight.position.y = val;
			this.shadowHelper.update();
		});

		this.addEventListener(this.ui.lightZ, 'input', () => {
			const val = parseFloat(this.ui.lightZ.value);
			this.ui.lightZValue.textContent = val.toString();
			this.directionalLight.position.z = val;
			this.shadowHelper.update();
		});

		this.addEventListener(this.ui.shadowBias, 'input', () => {
			const val = parseFloat(this.ui.shadowBias.value);
			this.ui.shadowBiasValue.textContent = val.toFixed(4);
			this.directionalLight.shadow.bias = val;
		});

		this.addEventListener(this.ui.resetBtn, 'click', () => {
			this.resetAll();
		});
	}

	private updateShadowType(type: string): void {
		switch (type) {
			case 'basic':
				this.renderer.shadowMap.type = THREE.BasicShadowMap;
				break;
			case 'pcf':
				this.renderer.shadowMap.type = THREE.PCFShadowMap;
				break;
			case 'pcfsoft':
				this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
				break;
			case 'vsm':
				this.renderer.shadowMap.type = THREE.VSMShadowMap;
				break;
		}
		this.directionalLight.shadow.map?.dispose();
		this.directionalLight.shadow.map = null as unknown as THREE.WebGLRenderTarget;
	}

	private resetAll(): void {
		this.directionalLight.position.set(
			DEFAULT_VALUES.lightX,
			DEFAULT_VALUES.lightY,
			DEFAULT_VALUES.lightZ
		);
		this.directionalLight.shadow.bias = DEFAULT_VALUES.shadowBias;

		this.ui.lightX.value = DEFAULT_VALUES.lightX.toString();
		this.ui.lightXValue.textContent = DEFAULT_VALUES.lightX.toString();
		this.ui.lightY.value = DEFAULT_VALUES.lightY.toString();
		this.ui.lightYValue.textContent = DEFAULT_VALUES.lightY.toString();
		this.ui.lightZ.value = DEFAULT_VALUES.lightZ.toString();
		this.ui.lightZValue.textContent = DEFAULT_VALUES.lightZ.toString();
		this.ui.shadowBias.value = DEFAULT_VALUES.shadowBias.toString();
		this.ui.shadowBiasValue.textContent = DEFAULT_VALUES.shadowBias.toFixed(4);
		this.ui.shadowType.value = DEFAULT_VALUES.shadowType;
		this.ui.shadowQuality.value = DEFAULT_VALUES.shadowQuality.toString();
		this.ui.shadowsToggle.checked = true;
		this.ui.helperToggle.checked = false;

		this.renderer.shadowMap.enabled = true;
		this.updateShadowType(DEFAULT_VALUES.shadowType);
		this.shadowHelper.visible = false;
		this.shadowHelper.update();

		this.camera.position.set(CAMERA_SPAWN.x, CAMERA_SPAWN.y, CAMERA_SPAWN.z);
		this.camera.lookAt(0, 0, 0);
		this.controls.target.set(0, 0, 0);
		this.controls.update();
	}
}

new Lesson08().start();
