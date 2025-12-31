import * as THREE from 'three';
import { LessonBase, addLights, createOrbitControls } from '../../shared/index.ts';
import type { LessonConfig } from '../../shared/index.ts';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getUIElements, type UIElements, type PresetType } from './ui.ts';
import { ParticleSystem } from './particles.ts';

/**
 * Lecon 09 - Particles
 */
class Lesson09 extends LessonBase {
	private controls!: OrbitControls;
	private ui!: UIElements;
	private particleSystem!: ParticleSystem;
	private autoRotate = true;

	constructor() {
		const config: LessonConfig = { id: '09', name: 'Particles' };
		super(config);
	}

	protected setup(): void {
		this.setupLights();
		this.setupControls();
		this.setupScene();
		this.setupUI();
		this.setupEventListeners();

		// Creer le systeme de particules
		this.particleSystem = new ParticleSystem(this.scene, {
			count: 1000,
			size: 0.1,
			color: new THREE.Color(0x00d9ff),
			transparent: true,
			speed: 1
		});
		this.particleSystem.create('galaxy');

		this.onDispose(() => {
			this.particleSystem.dispose();
			this.controls.dispose();
		});
	}

	protected update(delta: number): void {
		this.controls.update();
		this.particleSystem.update(delta);

		// Rotation auto si active (pour les presets qui ne tournent pas seuls)
		const points = this.particleSystem.getPoints();
		if (points && this.autoRotate && this.ui.preset.value !== 'galaxy') {
			points.rotation.y += delta * 0.2;
		}
	}

	private setupLights(): void {
		addLights(this.scene, {
			ambient: { color: '#ffffff', intensity: 0.3 }
		});
	}

	private setupControls(): void {
		this.controls = createOrbitControls(this.sceneContext, {
			minDistance: 2,
			maxDistance: 50,
			enableDamping: true
		});
		this.camera.position.set(0, 5, 10);
	}

	private setupScene(): void {
		// Sol leger pour reference
		const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
		gridHelper.position.y = -0.01;
		this.scene.add(gridHelper);
	}

	private setupUI(): void {
		this.ui = getUIElements();
	}

	private setupEventListeners(): void {
		// Preset
		this.addEventListener(this.ui.preset, 'change', () => {
			const preset = this.ui.preset.value as PresetType;
			this.particleSystem.create(preset);
			this.updateParticleCount();

			// Ajuster le bouton trigger
			this.ui.triggerBtn.style.display = preset === 'explosion' ? 'block' : 'none';
		});

		// Count
		this.addEventListener(this.ui.count, 'input', () => {
			const count = parseInt(this.ui.count.value);
			this.ui.countValue.textContent = count.toString();
			this.particleSystem.setConfig({ count });
			this.updateParticleCount();
		});

		// Size
		this.addEventListener(this.ui.size, 'input', () => {
			const size = parseFloat(this.ui.size.value);
			this.ui.sizeValue.textContent = size.toFixed(2);
			this.particleSystem.setConfig({ size });
		});

		// Color
		this.addEventListener(this.ui.color, 'input', () => {
			const color = new THREE.Color(this.ui.color.value);
			this.particleSystem.setConfig({ color });
		});

		// Speed
		this.addEventListener(this.ui.speed, 'input', () => {
			const speed = parseFloat(this.ui.speed.value);
			this.ui.speedValue.textContent = speed.toFixed(1);
			this.particleSystem.setConfig({ speed });
		});

		// Rotate toggle
		this.addEventListener(this.ui.rotateToggle, 'change', () => {
			this.autoRotate = this.ui.rotateToggle.checked;
		});

		// Transparent toggle
		this.addEventListener(this.ui.transparentToggle, 'change', () => {
			this.particleSystem.setConfig({ transparent: this.ui.transparentToggle.checked });
		});

		// Trigger button
		this.addEventListener(this.ui.triggerBtn, 'click', () => {
			this.particleSystem.trigger();
		});

		// Reset button
		this.addEventListener(this.ui.resetBtn, 'click', () => {
			this.reset();
		});

		// Initial trigger button visibility
		this.ui.triggerBtn.style.display = 'none';
	}

	private updateParticleCount(): void {
		this.ui.particleCount.textContent = this.particleSystem.getCount().toString();
	}

	private reset(): void {
		// Reset UI values
		this.ui.preset.value = 'galaxy';
		this.ui.count.value = '1000';
		this.ui.countValue.textContent = '1000';
		this.ui.size.value = '0.1';
		this.ui.sizeValue.textContent = '0.10';
		this.ui.color.value = '#00d9ff';
		this.ui.speed.value = '1';
		this.ui.speedValue.textContent = '1.0';
		this.ui.rotateToggle.checked = true;
		this.ui.transparentToggle.checked = true;

		this.autoRotate = true;

		// Recreer le systeme
		this.particleSystem.setConfig({
			count: 1000,
			size: 0.1,
			color: new THREE.Color(0x00d9ff),
			transparent: true,
			speed: 1
		});
		this.particleSystem.create('galaxy');
		this.updateParticleCount();

		// Reset camera
		this.camera.position.set(0, 5, 10);
		this.camera.lookAt(0, 0, 0);
		this.controls.target.set(0, 0, 0);
		this.controls.update();

		// Hide trigger button
		this.ui.triggerBtn.style.display = 'none';
	}
}

// Demarrer la lecon
new Lesson09().start();
