import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { SceneContext } from './scene.ts';

export interface ControlsOptions {
	enableDamping?: boolean;
	dampingFactor?: number;
	enableZoom?: boolean;
	enablePan?: boolean;
	minDistance?: number;
	maxDistance?: number;
	maxPolarAngle?: number;
	minPolarAngle?: number;
}

const DEFAULT_OPTIONS: ControlsOptions = {
	enableDamping: true,
	dampingFactor: 0.05,
	enableZoom: true,
	enablePan: true,
	minDistance: 2,
	maxDistance: 50
};

export function createOrbitControls(ctx: SceneContext, options: ControlsOptions = {}): OrbitControls {
	const config = { ...DEFAULT_OPTIONS, ...options };

	const controls = new OrbitControls(ctx.camera, ctx.renderer.domElement);
	controls.enableDamping = config.enableDamping!;
	controls.dampingFactor = config.dampingFactor!;
	controls.enableZoom = config.enableZoom!;
	controls.enablePan = config.enablePan!;
	controls.minDistance = config.minDistance!;
	controls.maxDistance = config.maxDistance!;

	if (config.maxPolarAngle !== undefined) {
		controls.maxPolarAngle = config.maxPolarAngle;
	}
	if (config.minPolarAngle !== undefined) {
		controls.minPolarAngle = config.minPolarAngle;
	}

	return controls;
}

// Creer un cube wireframe pour delimiter une zone
export function createBoundingBox(
	scene: THREE.Scene,
	size: { x: number; y: number; z: number },
	color: string = '#444444'
): THREE.LineSegments {
	const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
	const edges = new THREE.EdgesGeometry(geometry);
	const material = new THREE.LineBasicMaterial({ color });
	const boundingBox = new THREE.LineSegments(edges, material);

	scene.add(boundingBox);
	return boundingBox;
}
