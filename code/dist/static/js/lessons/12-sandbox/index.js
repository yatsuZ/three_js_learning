import * as THREE from 'three';
import { LessonBase, createOrbitControls } from "../../shared/index.js";
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { getUIElements } from "./ui.js";
import { SoundManager } from "./sound.js";
import { SandboxParticles } from "./particles.js";
import { SandboxPhysics } from "./physics.js";
import { PlayerController } from "./player.js";
/**
 * Lecon 12 - Sandbox Final
 * Combine: Physics, Particles, Keyboard Controls, Shadows, Export
 */
class Lesson12 extends LessonBase {
    constructor() {
        const config = { id: '12', name: 'Sandbox Final' };
        super(config);
        this.mode = 'physics';
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    }
    setup() {
        this.setupRenderer();
        this.setupLights();
        this.setupControls();
        this.setupModules();
        this.setupUI();
        this.setupEventListeners();
        this.onDispose(() => {
            this.controls.dispose();
            this.soundManager.dispose();
            this.particles.dispose();
            this.player.dispose();
        });
    }
    update(delta) {
        this.controls.update();
        this.physics.update(delta);
        if (this.mode === 'particles') {
            this.particles.update(delta);
        }
        if (this.mode === 'player') {
            this.player.update(delta);
            this.updateKeyDisplay();
            this.updatePositionDisplay();
        }
        this.ui.objectCount.textContent = this.physics.getObjectCount().toString();
    }
    setupRenderer() {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    setupLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambient);
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
    setupControls() {
        this.controls = createOrbitControls(this.sceneContext, {
            minDistance: 5,
            maxDistance: 50,
            enableDamping: true,
            maxPolarAngle: Math.PI / 2 - 0.05
        });
        this.camera.position.set(15, 15, 15);
        this.camera.lookAt(0, 0, 0);
    }
    setupModules() {
        this.soundManager = new SoundManager();
        this.physics = new SandboxPhysics(this.scene, this.soundManager);
        this.particles = new SandboxParticles(this.scene);
        this.particles.create('galaxy', 2000);
        this.player = new PlayerController(this.scene, this.physics.getWorld(), this.physics.getMaterial());
    }
    setupUI() {
        this.ui = getUIElements();
        this.ui.maxObjects.textContent = this.physics.getMaxObjects().toString();
    }
    setupEventListeners() {
        this.addEventListener(this.ui.mode, 'change', () => this.setMode(this.ui.mode.value));
        this.addEventListener(this.ui.spawnBtn, 'click', () => this.spawnObject());
        this.addEventListener(this.ui.explosionBtn, 'click', () => this.physics.createExplosion());
        this.addEventListener(this.ui.exportBtn, 'click', () => this.exportGLB());
        this.addEventListener(this.ui.clearBtn, 'click', () => this.physics.clear());
        this.addEventListener(this.ui.resetBtn, 'click', () => this.reset());
        this.addEventListener(this.ui.soundToggle, 'change', () => this.soundManager.setEnabled(this.ui.soundToggle.checked));
        this.addEventListener(this.ui.shadowsToggle, 'change', () => this.renderer.shadowMap.enabled = this.ui.shadowsToggle.checked);
        this.addEventListener(this.ui.particlePreset, 'change', () => {
            this.particles.create(this.ui.particlePreset.value, parseInt(this.ui.particleCount.value));
            this.particles.setVisible(this.mode === 'particles');
        });
        this.addEventListener(this.ui.particleCount, 'input', () => {
            this.ui.particleCountValue.textContent = this.ui.particleCount.value;
            this.particles.create(this.ui.particlePreset.value, parseInt(this.ui.particleCount.value));
            this.particles.setVisible(this.mode === 'particles');
        });
        this.addEventListener(this.ui.playerSpeed, 'input', () => {
            this.player.setSpeed(parseInt(this.ui.playerSpeed.value));
            this.ui.playerSpeedValue.textContent = this.ui.playerSpeed.value;
        });
        this.addEventListener(this.canvas, 'click', (e) => this.onCanvasClick(e));
    }
    setMode(mode) {
        this.mode = mode;
        this.ui.physicsSection.style.display = mode === 'physics' ? 'block' : 'none';
        this.ui.particlesSection.style.display = mode === 'particles' ? 'block' : 'none';
        this.ui.playerSection.style.display = mode === 'player' ? 'block' : 'none';
        this.player.setVisible(mode === 'player');
        this.particles.setVisible(mode === 'particles');
    }
    spawnObject() {
        const pos = new THREE.Vector3((Math.random() - 0.5) * 10, 8 + Math.random() * 4, (Math.random() - 0.5) * 10);
        this.physics.spawnObject(this.ui.shape.value, pos, this.ui.breakableToggle.checked, parseFloat(this.ui.restitution.value));
    }
    onCanvasClick(event) {
        if (this.mode !== 'physics' || !this.physics.canSpawn())
            return;
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersection = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(this.groundPlane, intersection)) {
            intersection.x = Math.max(-14, Math.min(14, intersection.x));
            intersection.z = Math.max(-14, Math.min(14, intersection.z));
            const pos = new THREE.Vector3(intersection.x, 6, intersection.z);
            this.physics.spawnObject(this.ui.shape.value, pos, this.ui.breakableToggle.checked, parseFloat(this.ui.restitution.value));
        }
    }
    updateKeyDisplay() {
        const keys = this.player.getActiveKeys();
        this.ui.keyZ.classList.toggle('active', keys.z);
        this.ui.keyQ.classList.toggle('active', keys.q);
        this.ui.keyS.classList.toggle('active', keys.s);
        this.ui.keyD.classList.toggle('active', keys.d);
        this.ui.keySpace.classList.toggle('active', keys.space);
    }
    updatePositionDisplay() {
        const pos = this.player.getPosition();
        this.ui.posX.textContent = pos.x.toFixed(1);
        this.ui.posY.textContent = pos.y.toFixed(1);
        this.ui.posZ.textContent = pos.z.toFixed(1);
    }
    exportGLB() {
        const exporter = new GLTFExporter();
        exporter.parse(this.scene, (gltf) => {
            const blob = new Blob([gltf], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'sandbox-scene.glb';
            link.click();
        }, (err) => console.error(err), { binary: true });
    }
    reset() {
        this.physics.clear();
        this.setMode('physics');
        this.ui.mode.value = 'physics';
        this.ui.shape.value = 'box';
        this.ui.breakableToggle.checked = false;
        this.ui.restitution.value = '0.5';
        this.ui.particlePreset.value = 'galaxy';
        this.ui.particleCount.value = '2000';
        this.ui.particleCountValue.textContent = '2000';
        this.ui.playerSpeed.value = '5';
        this.ui.playerSpeedValue.textContent = '5';
        this.ui.soundToggle.checked = true;
        this.ui.shadowsToggle.checked = true;
        this.soundManager.setEnabled(true);
        this.renderer.shadowMap.enabled = true;
        this.player.reset();
        this.particles.create('galaxy', 2000);
        this.camera.position.set(15, 15, 15);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }
}
new Lesson12().start();
