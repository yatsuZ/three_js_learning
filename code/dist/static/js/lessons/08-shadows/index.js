import * as THREE from 'three';
import { LessonBase, createOrbitControls } from "../../shared/index.js";
import { getUIElements, DEFAULT_VALUES } from "./ui.js";
// Position initiale de la camera
const CAMERA_SPAWN = { x: 5, y: 5, z: 10 };
/**
 * Lecon 08 - Shadows
 */
class Lesson08 extends LessonBase {
    constructor() {
        const config = { id: '08', name: 'Shadows' };
        super(config);
        this.cubes = [];
    }
    setup() {
        // Activer les ombres sur le renderer
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
    update(_delta) {
        this.controls.update();
        // Faire tourner les cubes
        this.cubes.forEach(cube => {
            cube.rotation.x += 0.005;
            cube.rotation.y += 0.01;
        });
    }
    setupLights() {
        // Lumiere ambiante (pas d'ombre)
        const ambient = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambient);
        // Lumiere directionnelle (avec ombres)
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(DEFAULT_VALUES.lightX, DEFAULT_VALUES.lightY, DEFAULT_VALUES.lightZ);
        this.directionalLight.castShadow = true;
        // Configuration de la shadow camera
        this.directionalLight.shadow.mapSize.width = DEFAULT_VALUES.shadowQuality;
        this.directionalLight.shadow.mapSize.height = DEFAULT_VALUES.shadowQuality;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 50;
        this.directionalLight.shadow.camera.left = -10;
        this.directionalLight.shadow.camera.right = 10;
        this.directionalLight.shadow.camera.top = 10;
        this.directionalLight.shadow.camera.bottom = -10;
        this.directionalLight.shadow.bias = DEFAULT_VALUES.shadowBias;
        this.scene.add(this.directionalLight);
        // Helper pour visualiser la shadow camera
        this.shadowHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
        this.shadowHelper.visible = false;
        this.scene.add(this.shadowHelper);
    }
    setupControls() {
        this.controls = createOrbitControls(this.sceneContext, {
            minDistance: 5,
            maxDistance: 30,
            enableDamping: true
        });
    }
    setupScene() {
        // Sol
        const floorGeometry = new THREE.PlaneGeometry(20, 20);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.8
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -1;
        floor.receiveShadow = true;
        this.scene.add(floor);
        // Grille sur le sol
        const grid = new THREE.GridHelper(20, 20, 0x444444, 0x444444);
        grid.position.y = -0.99;
        this.scene.add(grid);
        // Cubes avec ombres
        const colors = ['#00d9ff', '#ff6b6b', '#4ecdc4'];
        const positions = [
            { x: -3, y: 0.5, z: 0 },
            { x: 0, y: 1, z: 0 },
            { x: 3, y: 0.5, z: 0 }
        ];
        positions.forEach((pos, i) => {
            const size = i === 1 ? 1.5 : 1;
            const geometry = new THREE.BoxGeometry(size, size, size);
            const material = new THREE.MeshStandardMaterial({
                color: colors[i],
                roughness: 0.7,
                metalness: 0.3
            });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(pos.x, pos.y, pos.z);
            cube.castShadow = true;
            cube.receiveShadow = true;
            this.scene.add(cube);
            this.cubes.push(cube);
        });
        // Sphere
        const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: '#ffe66d',
            roughness: 0.3,
            metalness: 0.5
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(-1.5, 0, 2);
        sphere.castShadow = true;
        this.scene.add(sphere);
    }
    setupUI() {
        this.ui = getUIElements();
    }
    setupEventListeners() {
        // Toggle ombres
        this.addEventListener(this.ui.shadowsToggle, 'change', () => {
            this.renderer.shadowMap.enabled = this.ui.shadowsToggle.checked;
            // Force la mise a jour
            this.directionalLight.shadow.needsUpdate = true;
        });
        // Toggle helper
        this.addEventListener(this.ui.helperToggle, 'change', () => {
            this.shadowHelper.visible = this.ui.helperToggle.checked;
        });
        // Type de shadow map
        this.addEventListener(this.ui.shadowType, 'change', () => {
            this.updateShadowType(this.ui.shadowType.value);
        });
        // Qualite
        this.addEventListener(this.ui.shadowQuality, 'change', () => {
            var _a;
            const size = parseInt(this.ui.shadowQuality.value);
            this.directionalLight.shadow.mapSize.set(size, size);
            (_a = this.directionalLight.shadow.map) === null || _a === void 0 ? void 0 : _a.dispose();
            this.directionalLight.shadow.map = null;
        });
        // Position X
        this.addEventListener(this.ui.lightX, 'input', () => {
            const val = parseFloat(this.ui.lightX.value);
            this.ui.lightXValue.textContent = val.toString();
            this.directionalLight.position.x = val;
            this.shadowHelper.update();
        });
        // Position Y
        this.addEventListener(this.ui.lightY, 'input', () => {
            const val = parseFloat(this.ui.lightY.value);
            this.ui.lightYValue.textContent = val.toString();
            this.directionalLight.position.y = val;
            this.shadowHelper.update();
        });
        // Position Z
        this.addEventListener(this.ui.lightZ, 'input', () => {
            const val = parseFloat(this.ui.lightZ.value);
            this.ui.lightZValue.textContent = val.toString();
            this.directionalLight.position.z = val;
            this.shadowHelper.update();
        });
        // Shadow bias
        this.addEventListener(this.ui.shadowBias, 'input', () => {
            const val = parseFloat(this.ui.shadowBias.value);
            this.ui.shadowBiasValue.textContent = val.toFixed(4);
            this.directionalLight.shadow.bias = val;
        });
        // Reset
        this.addEventListener(this.ui.resetBtn, 'click', () => {
            this.resetAll();
        });
    }
    updateShadowType(type) {
        var _a;
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
        // Force la recompilation des shaders
        (_a = this.directionalLight.shadow.map) === null || _a === void 0 ? void 0 : _a.dispose();
        this.directionalLight.shadow.map = null;
    }
    resetAll() {
        // Reset light position
        this.directionalLight.position.set(DEFAULT_VALUES.lightX, DEFAULT_VALUES.lightY, DEFAULT_VALUES.lightZ);
        this.directionalLight.shadow.bias = DEFAULT_VALUES.shadowBias;
        // Reset UI
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
        // Apply
        this.renderer.shadowMap.enabled = true;
        this.updateShadowType(DEFAULT_VALUES.shadowType);
        this.shadowHelper.visible = false;
        this.shadowHelper.update();
        // Reset camera
        this.camera.position.set(CAMERA_SPAWN.x, CAMERA_SPAWN.y, CAMERA_SPAWN.z);
        this.camera.lookAt(0, 0, 0);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }
}
// Demarrer la lecon
new Lesson08().start();
