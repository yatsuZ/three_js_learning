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
import { createScene, setupResize, createOrbitControls, loadGLTF, loadGLTFFromFile, fitModelToView } from "../../shared/index.js";
// === CONFIG PAR DEFAUT ===
const DEFAULT_MODEL_URL = '/static/assets/exemple_default.glb';
// === INIT ===
const ctx = createScene({ backgroundColor: '#1a1a2e' });
setupResize(ctx);
// Lumieres (stockees pour pouvoir les modifier)
const ambientLight = new THREE.AmbientLight('#ffffff', 1.2);
const pointLight = new THREE.PointLight('#ffffff', 2, 100);
pointLight.position.set(5, 5, 5);
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5);
directionalLight.position.set(-5, 10, 5);
const backLight = new THREE.DirectionalLight('#ffffff', 0.8);
backLight.position.set(0, -5, -5);
ctx.scene.add(ambientLight);
ctx.scene.add(pointLight);
ctx.scene.add(directionalLight);
ctx.scene.add(backLight);
// Controles camera
const controls = createOrbitControls(ctx, {
    minDistance: 1,
    maxDistance: 20,
    enableDamping: true
});
// Grille au sol
const gridHelper = new THREE.GridHelper(10, 10, '#444444', '#333333');
ctx.scene.add(gridHelper);
// Variables
let currentModel = null;
let autoRotate = true;
let rotationSpeed = 1;
let animationSpeed = 1;
let modelScale = 3;
// Elements UI
const uploadInput = document.getElementById('model-upload');
const modelNameEl = document.getElementById('model-name');
const animCountEl = document.getElementById('anim-count');
const loadingEl = document.getElementById('loading');
// Controles
const autoRotateCheckbox = document.getElementById('auto-rotate');
const rotationSpeedSlider = document.getElementById('rotation-speed');
const ambientSlider = document.getElementById('ambient-intensity');
const pointSlider = document.getElementById('point-intensity');
const directionalSlider = document.getElementById('directional-intensity');
const showGridCheckbox = document.getElementById('show-grid');
const wireframeCheckbox = document.getElementById('wireframe-mode');
const enhanceMaterialsCheckbox = document.getElementById('enhance-materials');
const bgColorInput = document.getElementById('bg-color');
const animSpeedSlider = document.getElementById('anim-speed');
const modelScaleSlider = document.getElementById('model-scale');
const resetBtn = document.getElementById('reset-btn');
// Charger un modele depuis une URL
function loadModelFromUrl(url, name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (currentModel) {
            ctx.scene.remove(currentModel.scene);
            currentModel = null;
        }
        originalMaterials.clear();
        enhanceMaterialsCheckbox.checked = false;
        loadingEl.style.display = 'block';
        try {
            currentModel = yield loadGLTF(url);
            fitModelToView(currentModel.scene, modelScale);
            ctx.scene.add(currentModel.scene);
            modelNameEl.textContent = name;
            animCountEl.textContent = currentModel.animations.length.toString();
            if (currentModel.mixer && currentModel.animations.length > 0) {
                const action = currentModel.mixer.clipAction(currentModel.animations[0]);
                action.play();
            }
            console.log(`Model loaded: ${name}`);
        }
        catch (error) {
            console.error('Erreur chargement modele:', error);
        }
        finally {
            loadingEl.style.display = 'none';
        }
    });
}
// Charger un modele depuis un fichier
function loadModelFromFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (currentModel) {
            ctx.scene.remove(currentModel.scene);
            currentModel = null;
        }
        originalMaterials.clear();
        enhanceMaterialsCheckbox.checked = false;
        loadingEl.style.display = 'block';
        try {
            currentModel = yield loadGLTFFromFile(file);
            fitModelToView(currentModel.scene, modelScale);
            ctx.scene.add(currentModel.scene);
            modelNameEl.textContent = file.name;
            animCountEl.textContent = currentModel.animations.length.toString();
            if (currentModel.mixer && currentModel.animations.length > 0) {
                const action = currentModel.mixer.clipAction(currentModel.animations[0]);
                action.play();
            }
            console.log(`Model loaded: ${file.name}`);
        }
        catch (error) {
            console.error('Erreur chargement modele:', error);
            alert('Erreur lors du chargement du modele. Verifiez le format (.glb ou .gltf)');
        }
        finally {
            loadingEl.style.display = 'none';
        }
    });
}
// Appliquer wireframe a tout le modele
function setWireframe(enabled) {
    if (!currentModel)
        return;
    currentModel.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(mat => mat.wireframe = enabled);
            }
            else {
                child.material.wireframe = enabled;
            }
        }
    });
}
// Stocker les materiaux originaux pour pouvoir les restaurer
const originalMaterials = new Map();
// Forcer les materiaux a reagir a la lumiere
function enhanceMaterials(enabled) {
    if (!currentModel)
        return;
    currentModel.scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
            if (enabled) {
                // Sauvegarder le materiau original
                if (!originalMaterials.has(child)) {
                    originalMaterials.set(child, child.material);
                }
                // Convertir en MeshStandardMaterial pour reagir a la lumiere
                const oldMat = Array.isArray(child.material) ? child.material[0] : child.material;
                const newMat = new THREE.MeshStandardMaterial({
                    color: oldMat.color || '#888888',
                    map: oldMat.map || null,
                    metalness: 0.1,
                    roughness: 0.8,
                    wireframe: wireframeCheckbox.checked
                });
                child.material = newMat;
            }
            else {
                // Restaurer le materiau original
                const original = originalMaterials.get(child);
                if (original) {
                    child.material = original;
                }
            }
        }
    });
}
// Redimensionner le modele
function rescaleModel(scale) {
    if (!currentModel)
        return;
    // Reset et refit
    currentModel.scene.scale.set(1, 1, 1);
    currentModel.scene.position.set(0, 0, 0);
    fitModelToView(currentModel.scene, scale);
}
// === EVENT LISTENERS ===
// Upload fichier
uploadInput.addEventListener('change', (e) => {
    var _a;
    const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
    if (file) {
        loadModelFromFile(file);
    }
});
// Auto-rotation
autoRotateCheckbox.addEventListener('change', () => {
    autoRotate = autoRotateCheckbox.checked;
});
// Vitesse rotation
rotationSpeedSlider.addEventListener('input', () => {
    rotationSpeed = parseFloat(rotationSpeedSlider.value);
});
// Lumieres
ambientSlider.addEventListener('input', () => {
    ambientLight.intensity = parseFloat(ambientSlider.value);
});
pointSlider.addEventListener('input', () => {
    pointLight.intensity = parseFloat(pointSlider.value);
});
directionalSlider.addEventListener('input', () => {
    directionalLight.intensity = parseFloat(directionalSlider.value);
});
// Grille
showGridCheckbox.addEventListener('change', () => {
    gridHelper.visible = showGridCheckbox.checked;
});
// Wireframe
wireframeCheckbox.addEventListener('change', () => {
    setWireframe(wireframeCheckbox.checked);
});
// Forcer reaction lumiere
enhanceMaterialsCheckbox.addEventListener('change', () => {
    enhanceMaterials(enhanceMaterialsCheckbox.checked);
});
// Couleur de fond
bgColorInput.addEventListener('input', () => {
    ctx.scene.background = new THREE.Color(bgColorInput.value);
});
// Vitesse animation
animSpeedSlider.addEventListener('input', () => {
    animationSpeed = parseFloat(animSpeedSlider.value);
});
// Echelle modele
modelScaleSlider.addEventListener('input', () => {
    modelScale = parseFloat(modelScaleSlider.value);
    rescaleModel(modelScale);
});
// Reset
resetBtn.addEventListener('click', () => {
    // Reset tous les sliders et checkboxes
    autoRotateCheckbox.checked = true;
    autoRotate = true;
    rotationSpeedSlider.value = '1';
    rotationSpeed = 1;
    ambientSlider.value = '1.2';
    ambientLight.intensity = 1.2;
    pointSlider.value = '2';
    pointLight.intensity = 2;
    directionalSlider.value = '1.5';
    directionalLight.intensity = 1.5;
    showGridCheckbox.checked = true;
    gridHelper.visible = true;
    wireframeCheckbox.checked = false;
    setWireframe(false);
    enhanceMaterialsCheckbox.checked = false;
    enhanceMaterials(false);
    bgColorInput.value = '#1a1a2e';
    ctx.scene.background = new THREE.Color('#1a1a2e');
    animSpeedSlider.value = '1';
    animationSpeed = 1;
    modelScaleSlider.value = '3';
    modelScale = 3;
    rescaleModel(3);
});
// === CHARGER LE MODELE PAR DEFAUT ===
loadModelFromUrl(DEFAULT_MODEL_URL, 'exemple_default.glb');
// Clock pour les animations
const clock = new THREE.Clock();
// Animation
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    // Mise a jour des animations du modele
    if (currentModel === null || currentModel === void 0 ? void 0 : currentModel.mixer) {
        currentModel.mixer.update(delta * animationSpeed);
    }
    // Auto-rotation du modele
    if (currentModel && autoRotate) {
        currentModel.scene.rotation.y += 0.005 * rotationSpeed;
    }
    controls.update();
    ctx.renderer.render(ctx.scene, ctx.camera);
}
animate();
console.log('Lesson 06 - Blender Import loaded!');
