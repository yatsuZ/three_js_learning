/**
 * Lecon 06 - Gestion des modeles 3D
 */

import * as THREE from 'three';
import { loadGLTF, loadGLTFFromFile, fitModelToView, Logger } from '../../shared/index.ts';
import type { LoadedModel } from '../../shared/index.ts';

/**
 * Controleur pour la gestion des modeles 3D
 */
export class ModelController {
	private scene: THREE.Scene;
	private currentModel: LoadedModel | null = null;
	private originalMaterials = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
	private modelScale: number;

	constructor(scene: THREE.Scene, initialScale: number = 3) {
		this.scene = scene;
		this.modelScale = initialScale;
	}

	/**
	 * Charge un modele depuis une URL
	 */
	async loadFromUrl(url: string): Promise<LoadedModel | null> {
		this.clear();

		try {
			this.currentModel = await loadGLTF(url);
			this.addToScene();
			return this.currentModel;
		} catch (error) {
			Logger.error('Erreur chargement modele:', error);
			return null;
		}
	}

	/**
	 * Charge un modele depuis un fichier
	 */
	async loadFromFile(file: File): Promise<LoadedModel | null> {
		this.clear();

		try {
			this.currentModel = await loadGLTFFromFile(file);
			this.addToScene();
			return this.currentModel;
		} catch (error) {
			Logger.error('Erreur chargement modele:', error);
			throw error;
		}
	}

	/**
	 * Ajoute le modele a la scene avec le bon scale
	 */
	private addToScene(): void {
		if (!this.currentModel) return;
		fitModelToView(this.currentModel.scene, this.modelScale);
		this.scene.add(this.currentModel.scene);
	}

	/**
	 * Supprime le modele actuel de la scene
	 */
	clear(): void {
		if (this.currentModel) {
			this.scene.remove(this.currentModel.scene);
			this.currentModel = null;
		}
		this.originalMaterials.clear();
	}

	/**
	 * Joue la premiere animation si disponible
	 */
	playFirstAnimation(): void {
		if (this.currentModel?.mixer && this.currentModel.animations.length > 0) {
			const action = this.currentModel.mixer.clipAction(this.currentModel.animations[0]);
			action.play();
		}
	}

	/**
	 * Active/desactive le mode wireframe
	 */
	setWireframe(enabled: boolean): void {
		if (!this.currentModel) return;

		this.currentModel.scene.traverse((child) => {
			if (child instanceof THREE.Mesh && child.material) {
				if (Array.isArray(child.material)) {
					child.material.forEach(mat => mat.wireframe = enabled);
				} else {
					child.material.wireframe = enabled;
				}
			}
		});
	}

	/**
	 * Force les materiaux a reagir a la lumiere
	 */
	enhanceMaterials(enabled: boolean, wireframeEnabled: boolean): void {
		if (!this.currentModel) return;

		this.currentModel.scene.traverse((child) => {
			if (child instanceof THREE.Mesh && child.material) {
				if (enabled) {
					if (!this.originalMaterials.has(child)) {
						this.originalMaterials.set(child, child.material);
					}

					const oldMat = Array.isArray(child.material) ? child.material[0] : child.material;
					const newMat = new THREE.MeshStandardMaterial({
						color: (oldMat as THREE.MeshBasicMaterial).color || '#888888',
						map: (oldMat as THREE.MeshBasicMaterial).map || null,
						metalness: 0.1,
						roughness: 0.8,
						wireframe: wireframeEnabled
					});
					child.material = newMat;
				} else {
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
	rescale(scale: number): void {
		this.modelScale = scale;
		if (!this.currentModel) return;

		this.currentModel.scene.scale.set(1, 1, 1);
		this.currentModel.scene.position.set(0, 0, 0);
		fitModelToView(this.currentModel.scene, scale);
	}

	/**
	 * Met a jour les animations
	 */
	updateAnimations(delta: number, speed: number): void {
		if (this.currentModel?.mixer) {
			this.currentModel.mixer.update(delta * speed);
		}
	}

	/**
	 * Applique une rotation au modele
	 */
	rotate(amount: number): void {
		if (this.currentModel) {
			this.currentModel.scene.rotation.y += amount;
		}
	}

	/**
	 * Retourne les infos du modele actuel
	 */
	getInfo(): { name: string; animCount: number } | null {
		if (!this.currentModel) return null;
		return {
			name: '',
			animCount: this.currentModel.animations.length
		};
	}

	/**
	 * Verifie si un modele est charge
	 */
	hasModel(): boolean {
		return this.currentModel !== null;
	}
}
