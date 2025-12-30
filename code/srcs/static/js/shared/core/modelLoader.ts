import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export interface LoadedModel {
	scene: THREE.Group;
	animations: THREE.AnimationClip[];
	mixer?: THREE.AnimationMixer;
}

const loader = new GLTFLoader();

export function loadGLTF(url: string): Promise<LoadedModel> {
	return new Promise((resolve, reject) => {
		loader.load(
			url,
			(gltf) => {
				const model: LoadedModel = {
					scene: gltf.scene,
					animations: gltf.animations
				};

				// Si le modele a des animations, creer un mixer
				if (gltf.animations.length > 0) {
					model.mixer = new THREE.AnimationMixer(gltf.scene);
				}

				resolve(model);
			},
			(progress) => {
				console.log(`Loading: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
			},
			(error) => {
				reject(error);
			}
		);
	});
}

// Charger depuis un fichier (File API)
export function loadGLTFFromFile(file: File): Promise<LoadedModel> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const arrayBuffer = e.target?.result as ArrayBuffer;
			loader.parse(
				arrayBuffer,
				'',
				(gltf) => {
					const model: LoadedModel = {
						scene: gltf.scene,
						animations: gltf.animations
					};

					if (gltf.animations.length > 0) {
						model.mixer = new THREE.AnimationMixer(gltf.scene);
					}

					resolve(model);
				},
				(error) => {
					reject(error);
				}
			);
		};
		reader.onerror = reject;
		reader.readAsArrayBuffer(file);
	});
}

// Centrer et redimensionner un modele
export function fitModelToView(model: THREE.Group, targetSize: number = 3): void {
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
