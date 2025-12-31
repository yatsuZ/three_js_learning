/**
 * Lecon 06 - Gestion des modeles 3D
 */
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
import { loadGLTF, loadGLTFFromFile, fitModelToView, Logger } from "../../shared/index.js";
/**
 * Controleur pour la gestion des modeles 3D
 */
export class ModelController {
    constructor(scene, initialScale = 3) {
        this.currentModel = null;
        this.originalMaterials = new Map();
        this.scene = scene;
        this.modelScale = initialScale;
    }
    /**
     * Charge un modele depuis une URL
     */
    loadFromUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            this.clear();
            try {
                this.currentModel = yield loadGLTF(url);
                this.addToScene();
                return this.currentModel;
            }
            catch (error) {
                Logger.error('Erreur chargement modele:', error);
                return null;
            }
        });
    }
    /**
     * Charge un modele depuis un fichier
     */
    loadFromFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            this.clear();
            try {
                this.currentModel = yield loadGLTFFromFile(file);
                this.addToScene();
                return this.currentModel;
            }
            catch (error) {
                Logger.error('Erreur chargement modele:', error);
                throw error;
            }
        });
    }
    /**
     * Ajoute le modele a la scene avec le bon scale
     */
    addToScene() {
        if (!this.currentModel)
            return;
        fitModelToView(this.currentModel.scene, this.modelScale);
        this.scene.add(this.currentModel.scene);
    }
    /**
     * Supprime le modele actuel de la scene
     */
    clear() {
        if (this.currentModel) {
            this.scene.remove(this.currentModel.scene);
            this.currentModel = null;
        }
        this.originalMaterials.clear();
    }
    /**
     * Joue la premiere animation si disponible
     */
    playFirstAnimation() {
        var _a;
        if (((_a = this.currentModel) === null || _a === void 0 ? void 0 : _a.mixer) && this.currentModel.animations.length > 0) {
            const action = this.currentModel.mixer.clipAction(this.currentModel.animations[0]);
            action.play();
        }
    }
    /**
     * Active/desactive le mode wireframe
     */
    setWireframe(enabled) {
        if (!this.currentModel)
            return;
        this.currentModel.scene.traverse((child) => {
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
    /**
     * Force les materiaux a reagir a la lumiere
     */
    enhanceMaterials(enabled, wireframeEnabled) {
        if (!this.currentModel)
            return;
        this.currentModel.scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                if (enabled) {
                    if (!this.originalMaterials.has(child)) {
                        this.originalMaterials.set(child, child.material);
                    }
                    const oldMat = Array.isArray(child.material) ? child.material[0] : child.material;
                    const newMat = new THREE.MeshStandardMaterial({
                        color: oldMat.color || '#888888',
                        map: oldMat.map || null,
                        metalness: 0.1,
                        roughness: 0.8,
                        wireframe: wireframeEnabled
                    });
                    child.material = newMat;
                }
                else {
                    const original = this.originalMaterials.get(child);
                    if (original) {
                        child.material = original;
                    }
                }
            }
        });
    }
    /**
     * Redimensionne le modele
     */
    rescale(scale) {
        this.modelScale = scale;
        if (!this.currentModel)
            return;
        this.currentModel.scene.scale.set(1, 1, 1);
        this.currentModel.scene.position.set(0, 0, 0);
        fitModelToView(this.currentModel.scene, scale);
    }
    /**
     * Met a jour les animations
     */
    updateAnimations(delta, speed) {
        var _a;
        if ((_a = this.currentModel) === null || _a === void 0 ? void 0 : _a.mixer) {
            this.currentModel.mixer.update(delta * speed);
        }
    }
    /**
     * Applique une rotation au modele
     */
    rotate(amount) {
        if (this.currentModel) {
            this.currentModel.scene.rotation.y += amount;
        }
    }
    /**
     * Retourne les infos du modele actuel
     */
    getInfo() {
        if (!this.currentModel)
            return null;
        return {
            name: '',
            animCount: this.currentModel.animations.length
        };
    }
    /**
     * Verifie si un modele est charge
     */
    hasModel() {
        return this.currentModel !== null;
    }
}
