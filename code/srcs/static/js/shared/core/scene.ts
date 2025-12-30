import * as THREE from 'three';

export interface SceneOptions {
	backgroundColor?: string;
	cameraPosition?: { x: number; y: number; z: number };
	fov?: number;
}

export interface SceneContext {
	canvas: HTMLCanvasElement;
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	renderer: THREE.WebGLRenderer;
}

const DEFAULT_OPTIONS: SceneOptions = {
	backgroundColor: '#1a1a2e',
	cameraPosition: { x: 0, y: 0, z: 8 },
	fov: 75
};

export function createScene(options: SceneOptions = {}): SceneContext {
	const config = { ...DEFAULT_OPTIONS, ...options };

	// Canvas
	const canvas = document.getElementById('canvas') as HTMLCanvasElement;

	// Scene
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(config.backgroundColor);

	// Camera
	const camera = new THREE.PerspectiveCamera(
		config.fov,
		canvas.clientWidth / canvas.clientHeight,
		0.1,
		1000
	);
	camera.position.set(
		config.cameraPosition!.x,
		config.cameraPosition!.y,
		config.cameraPosition!.z
	);

	// Renderer
	const renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		antialias: true
	});
	renderer.setSize(canvas.clientWidth, canvas.clientHeight);

	return { canvas, scene, camera, renderer };
}

export function setupResize(ctx: SceneContext): void {
	window.addEventListener('resize', () => {
		ctx.camera.aspect = ctx.canvas.clientWidth / ctx.canvas.clientHeight;
		ctx.camera.updateProjectionMatrix();
		ctx.renderer.setSize(ctx.canvas.clientWidth, ctx.canvas.clientHeight);
	});
}
