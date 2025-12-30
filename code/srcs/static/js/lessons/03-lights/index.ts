import {
	createScene,
	setupResize,
	CubeManager,
	loadConfig,
	setupCubeControls,
	addLights
} from '../../shared/index.ts';

// === INIT ===
async function init(): Promise<void> {
	// Charger la config depuis l'API
	await loadConfig();

	// Setup scene
	const ctx = createScene({ backgroundColor: '#1a1a2e' });
	setupResize(ctx);

	// Ajouter les lumieres
	addLights(ctx.scene, {
		ambient: { color: '#404040', intensity: 0.5 },
		point: { color: '#ffffff', intensity: 1, distance: 100, position: { x: 5, y: 5, z: 5 } },
		directional: { color: '#ffffff', intensity: 0.8, position: { x: -5, y: 10, z: 5 } }
	});

	// Cube manager AVEC lumieres (MeshStandardMaterial)
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
		cubeManager.updateAll();
		ctx.renderer.render(ctx.scene, ctx.camera);
	}

	animate();
	console.log('Lesson 03 - Lights loaded!');
}

init();
