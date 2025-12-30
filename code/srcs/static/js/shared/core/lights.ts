import * as THREE from 'three';

export interface LightConfig {
	ambient?: {
		color: string;
		intensity: number;
	};
	point?: {
		color: string;
		intensity: number;
		distance: number;
		position: { x: number; y: number; z: number };
	};
	directional?: {
		color: string;
		intensity: number;
		position: { x: number; y: number; z: number };
	};
}

export interface LightObjects {
	ambient?: THREE.AmbientLight;
	point?: THREE.PointLight;
	directional?: THREE.DirectionalLight;
}

const DEFAULT_LIGHTS: LightConfig = {
	ambient: {
		color: '#404040',
		intensity: 0.5
	},
	point: {
		color: '#ffffff',
		intensity: 1,
		distance: 100,
		position: { x: 5, y: 5, z: 5 }
	},
	directional: {
		color: '#ffffff',
		intensity: 0.8,
		position: { x: -5, y: 10, z: 5 }
	}
};

export function addLights(scene: THREE.Scene, config: LightConfig = {}): LightObjects {
	const lights: LightObjects = {};

	// Lumiere ambiante
	const ambientCfg = { ...DEFAULT_LIGHTS.ambient!, ...config.ambient };
	lights.ambient = new THREE.AmbientLight(ambientCfg.color, ambientCfg.intensity);
	scene.add(lights.ambient);

	// Lumiere ponctuelle
	const pointCfg = {
		...DEFAULT_LIGHTS.point!,
		...config.point,
		position: { ...DEFAULT_LIGHTS.point!.position, ...config.point?.position }
	};
	lights.point = new THREE.PointLight(pointCfg.color, pointCfg.intensity, pointCfg.distance);
	lights.point.position.set(pointCfg.position.x, pointCfg.position.y, pointCfg.position.z);
	scene.add(lights.point);

	// Lumiere directionnelle
	const dirCfg = {
		...DEFAULT_LIGHTS.directional!,
		...config.directional,
		position: { ...DEFAULT_LIGHTS.directional!.position, ...config.directional?.position }
	};
	lights.directional = new THREE.DirectionalLight(dirCfg.color, dirCfg.intensity);
	lights.directional.position.set(dirCfg.position.x, dirCfg.position.y, dirCfg.position.z);
	scene.add(lights.directional);

	return lights;
}
