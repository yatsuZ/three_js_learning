var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as THREE from 'three';
import { LessonBase, addLights, createOrbitControls, loadGLTF, fitModelToView, Logger } from "../../shared/index.js";
import { getUIElements, getAnimationOptions } from "./ui.js";
import { AnimationController } from "./animations/index.js";
// Position initiale de la camera
const CAMERA_SPAWN = { x: 0, y: 2, z: 10 };
const GLB_URL = '/static/assets/exemple_default.glb';
/**
 * Lecon 07 - Animations avec GSAP
 */
class Lesson07 extends LessonBase {
    constructor() {
        const config = { id: '07', name: 'Animations GSAP' };
        super(config);
        this.cubes = [];
        this.glbModel = null;
        this.isGlbMode = false;
    }
    setup() {
        this.setupLights();
        this.setupControls();
        this.setupCubes();
        this.setupUI();
        this.setupEventListeners();
        this.onDispose(() => {
            this.animator.killAll();
            this.controls.dispose();
            if (this.glbModel) {
                this.scene.remove(this.glbModel.scene);
            }
        });
    }
    update(_delta) {
        this.controls.update();
        this.updateProgressBar();
    }
    updateProgressBar() {
        const progress = this.animator.getProgress() * 100;
        this.ui.progressBar.style.width = `${progress}%`;
    }
    setupLights() {
        addLights(this.scene, {
            ambient: { color: '#ffffff', intensity: 0.6 },
            point: { color: '#ffffff', intensity: 1.5, distance: 100, position: { x: 5, y: 5, z: 5 } },
            directional: { color: '#ffffff', intensity: 1, position: { x: -5, y: 10, z: 5 } }
        });
    }
    setupControls() {
        this.controls = createOrbitControls(this.sceneContext, {
            minDistance: 5,
            maxDistance: 20,
            enableDamping: true
        });
    }
    setupCubes() {
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
    setupUI() {
        this.ui = getUIElements();
    }
    setupEventListeners() {
        // Play button
        this.addEventListener(this.ui.playBtn, 'click', () => {
            const options = getAnimationOptions(this.ui);
            this.animator.play(this.ui.animationSelect.value, options);
        });
        // Reset button - reset cubes + camera + UI
        this.addEventListener(this.ui.resetBtn, 'click', () => {
            this.animator.reset();
            this.resetCamera();
            this.resetUI();
        });
        // Duration slider
        this.addEventListener(this.ui.duration, 'input', () => {
            this.ui.durationValue.textContent = `${this.ui.duration.value}s`;
        });
        // Speed slider (temps reel)
        this.addEventListener(this.ui.speed, 'input', () => {
            const speed = parseFloat(this.ui.speed.value);
            this.ui.speedValue.textContent = `${speed}x`;
            this.animator.setSpeed(speed);
        });
        // Timeline controls
        this.addEventListener(this.ui.pauseBtn, 'click', () => this.animator.pause());
        this.addEventListener(this.ui.resumeBtn, 'click', () => this.animator.resume());
        this.addEventListener(this.ui.reverseBtn, 'click', () => this.animator.reverse());
        // GLB mode toggle
        this.addEventListener(this.ui.glbModeToggle, 'change', () => {
            this.toggleGlbMode(this.ui.glbModeToggle.checked);
        });
    }
    toggleGlbMode(enabled) {
        return __awaiter(this, void 0, void 0, function* () {
            this.isGlbMode = enabled;
            this.animator.reset();
            Logger.info('Toggle GLB mode:', enabled);
            if (enabled) {
                // Cacher les cubes
                this.cubes.forEach(c => c.visible = false);
                // Charger le modele GLB si pas deja fait
                if (!this.glbModel) {
                    try {
                        Logger.info('Chargement du modele GLB...');
                        this.glbModel = yield loadGLTF(GLB_URL);
                        Logger.info('Modele charge:', this.glbModel);
                        fitModelToView(this.glbModel.scene, 3);
                        Logger.info('Position apres fit:', this.glbModel.scene.position);
                        Logger.info('Scale apres fit:', this.glbModel.scene.scale);
                        this.scene.add(this.glbModel.scene);
                        Logger.info('Modele ajoute a la scene');
                    }
                    catch (error) {
                        Logger.error('Erreur chargement GLB:', error);
                        // Revenir aux cubes en cas d'erreur
                        this.cubes.forEach(c => c.visible = true);
                        this.ui.glbModeToggle.checked = false;
                        this.isGlbMode = false;
                        return;
                    }
                }
                else {
                    this.glbModel.scene.visible = true;
                }
                // Mettre a jour les cibles de l'animator
                this.animator.setTargets([this.glbModel.scene]);
            }
            else {
                // Cacher le modele GLB
                if (this.glbModel) {
                    this.glbModel.scene.visible = false;
                }
                // Montrer les cubes
                this.cubes.forEach(c => c.visible = true);
                // Remettre les cubes comme cibles
                this.animator.setTargets(this.cubes);
            }
        });
    }
    resetCamera() {
        this.camera.position.set(CAMERA_SPAWN.x, CAMERA_SPAWN.y, CAMERA_SPAWN.z);
        this.camera.lookAt(0, 0, 0);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }
    resetUI() {
        // Reset duration
        this.ui.duration.value = '1';
        this.ui.durationValue.textContent = '1s';
        // Reset speed
        this.ui.speed.value = '1';
        this.ui.speedValue.textContent = '1x';
        this.animator.setSpeed(1);
        // Reset easing
        this.ui.easingSelect.value = 'power2.inOut';
        // Reset toggles
        this.ui.repeatToggle.checked = false;
        this.ui.yoyoToggle.checked = false;
        // Reset progress bar
        this.ui.progressBar.style.width = '0%';
        // Reset GLB mode if needed
        if (this.isGlbMode) {
            this.ui.glbModeToggle.checked = false;
            this.toggleGlbMode(false);
        }
    }
}
// Demarrer la lecon
new Lesson07().start();
