import {
	createScene,
	setupResize,
	CubeManager,
	loadConfig,
	setupCubeControls,
	addLights,
	createOrbitControls,
	createBoundingBox
} from '../../shared/index.ts';

// Zone de spawn des cubes (doit correspondre a cubeManager)
const SPAWN_ZONE = { x: 10, y: 6, z: 6 };

// === INIT ===
async function init(): Promise<void> {
	// Charger la config depuis l'API
	await loadConfig();

	// Setup scene
	const ctx = createScene({ backgroundColor: '#1a1a2e' });
	setupResize(ctx);

	// Ajouter les lumieres
	addLights(ctx.scene, {
		ambient: { color: '#ffffff', intensity: 0.8 },
		point: { color: '#ffffff', intensity: 1.5, distance: 100, position: { x: 5, y: 5, z: 5 } },
		directional: { color: '#ffffff', intensity: 1, position: { x: -5, y: 10, z: 5 } }
	});

	// Creer le bounding box (zone de spawn)
	createBoundingBox(ctx.scene, SPAWN_ZONE, '#666666');

	// Controles de camera (OrbitControls)
	const controls = createOrbitControls(ctx, {
		enableDamping: true,
		dampingFactor: 0.05,
		minDistance: 5,
		maxDistance: 30
	});

	// Cube manager avec lumieres
	const cubeManager = new CubeManager(ctx.scene, {
		useLighting: true,
		metalness: 0.3,
		roughness: 0.7
	});

	// Setup UI
	setupCubeControls(cubeManager);

	// Animation
	function animate(): void {
		requestAnimationFrame(animate);
		controls.update(); // Necessaire pour le damping
		cubeManager.updateAll();
		ctx.renderer.render(ctx.scene, ctx.camera);
	}

	animate();
	console.log('Lesson 04 - Controls loaded!');
}

init();
