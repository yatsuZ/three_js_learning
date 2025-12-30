import {
	createScene,
	setupResize,
	CubeManager,
	loadConfig,
	setupCubeControls
} from '../../shared/index.ts';

// === INIT ===
async function init(): Promise<void> {
	// Charger la config depuis l'API
	await loadConfig();

	// Setup scene
	const ctx = createScene({ backgroundColor: '#1a1a2e' });
	setupResize(ctx);

	// Cube manager (sans lumières)
	const cubeManager = new CubeManager(ctx.scene, { useLighting: false });

	// Setup UI
	setupCubeControls(cubeManager);

	// Animation
	function animate(): void {
		requestAnimationFrame(animate);
		cubeManager.updateAll();
		ctx.renderer.render(ctx.scene, ctx.camera);
	}

	animate();
	console.log('Lesson 02 - Create Cubes loaded!');
}

init();
