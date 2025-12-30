import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const loader = new GLTFLoader();
export function loadGLTF(url) {
    return new Promise((resolve, reject) => {
        loader.load(url, (gltf) => {
            const model = {
                scene: gltf.scene,
                animations: gltf.animations
            };
            // Si le modele a des animations, creer un mixer
            if (gltf.animations.length > 0) {
                model.mixer = new THREE.AnimationMixer(gltf.scene);
            }
            resolve(model);
        }, (progress) => {
            console.log(`Loading: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
        }, (error) => {
            reject(error);
        });
    });
}
// Charger depuis un fichier (File API)
export function loadGLTFFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            var _a;
            const arrayBuffer = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            loader.parse(arrayBuffer, '', (gltf) => {
                const model = {
                    scene: gltf.scene,
                    animations: gltf.animations
                };
                if (gltf.animations.length > 0) {
                    model.mixer = new THREE.AnimationMixer(gltf.scene);
                }
                resolve(model);
            }, (error) => {
                reject(error);
            });
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}
// Centrer et redimensionner un modele
export function fitModelToView(model, targetSize = 3) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    // Calculer le facteur d'echelle
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = targetSize / maxDim;
    model.scale.multiplyScalar(scale);
    // Centrer le modele
    box.setFromObject(model);
    box.getCenter(center);
    model.position.sub(center);
}
