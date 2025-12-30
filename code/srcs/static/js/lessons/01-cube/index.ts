import { createScene, setupResize, CubeManager, addLights } from '../../shared/index.ts';
import type { LightObjects } from '../../shared/index.ts';

// Configuration des cubes
const CUBES_CONFIG = [
	{ color: '#00d9ff', wireframe: true, position: { x: 0, y: 0, z: 0 }, rotationSpeed: { x: 0.01, y: 0.01, z: 0 } },
	{ color: '#ff6b6b', wireframe: false, position: { x: -2.5, y: 0, z: 0 }, rotationSpeed: { x: 0.02, y: 0, z: 0.01 } },
	{ color: '#4ecdc4', wireframe: false, transparent: true, opacity: 0.5, position: { x: 2.5, y: 0, z: 0 }, rotationSpeed: { x: 0, y: 0.02, z: 0.01 } }
];

// === INIT ===
const ctx = createScene({ backgroundColor: '#1a1a2e' });
setupResize(ctx);

let cubeManager = new CubeManager(ctx.scene, { useLighting: false });
let lights: LightObjects | null = null;
let useLighting = false;

// Creer les cubes (avec option de restaurer les rotations)
function createCubes(savedRotations?: Array<{ x: number; y: number; z: number }>): void {
	cubeManager.clearAll();
	cubeManager = new CubeManager(ctx.scene, {
		useLighting: useLighting,
		metalness: 0.3,
		roughness: 0.7
	});

	CUBES_CONFIG.forEach((config, index) => {
		const cube = cubeManager.createSingleCube({ ...config, size: 0.8 });

		// Restaurer la rotation si disponible
		if (savedRotations && savedRotations[index]) {
			cube.mesh.rotation.x = savedRotations[index].x;
			cube.mesh.rotation.y = savedRotations[index].y;
			cube.mesh.rotation.z = savedRotations[index].z;
		}
	});
}

// Toggle lumieres
function toggleLighting(enabled: boolean): void {
	// Sauvegarder les rotations actuelles
	const savedRotations = cubeManager.getCubes().map(cube => ({
		x: cube.mesh.rotation.x,
		y: cube.mesh.rotation.y,
		z: cube.mesh.rotation.z
	}));

	useLighting = enabled;

	if (enabled && !lights) {
		// Lumieres plus brillantes
		lights = addLights(ctx.scene, {
			ambient: { color: '#ffffff', intensity: 1 },
			point: { color: '#ffffff', intensity: 2, distance: 100, position: { x: 5, y: 5, z: 5 } },
			directional: { color: '#ffffff', intensity: 1.5, position: { x: -5, y: 10, z: 5 } }
		});
	} else if (!enabled && lights) {
		if (lights.ambient) ctx.scene.remove(lights.ambient);
		if (lights.point) ctx.scene.remove(lights.point);
		if (lights.directional) ctx.scene.remove(lights.directional);
		lights = null;
	}

	// Recreer les cubes avec le bon materiau ET restaurer les rotations
	createCubes(savedRotations);
}

// Setup UI
const lightingToggle = document.getElementById('lighting-toggle') as HTMLInputElement;
lightingToggle.addEventListener('change', () => {
	toggleLighting(lightingToggle.checked);
});

// Creer les cubes initiaux
createCubes();

// === ANIMATION ===
function animate(): void {
	requestAnimationFrame(animate);
	cubeManager.updateAll();
	ctx.renderer.render(ctx.scene, ctx.camera);
}

animate();
console.log('Lesson 01 - Cubes loaded!');
