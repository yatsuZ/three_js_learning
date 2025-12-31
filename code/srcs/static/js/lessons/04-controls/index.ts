import {
	LessonBase,
	CubeManager,
	loadConfig,
	setupCubeControls,
	addLights,
	createOrbitControls,
	createBoundingBox
} from '../../shared/index.ts';
import type { LessonConfig } from '../../shared/index.ts';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Zone de spawn des cubes (doit correspondre a cubeManager)
const SPAWN_ZONE = { x: 10, y: 6, z: 6 };

/**
 * Lecon 04 - OrbitControls et navigation camera
 */
class Lesson04 extends LessonBase {
	private cubeManager!: CubeManager;
	private controls!: OrbitControls;

	constructor() {
		const config: LessonConfig = {
			id: '04',
			name: 'Controls'
		};
		super(config);
	}

	protected async setup(): Promise<void> {
		// Charger la config depuis l'API
		await loadConfig();

		// Ajouter les lumieres
		addLights(this.scene, {
			ambient: { color: '#ffffff', intensity: 0.8 },
			point: { color: '#ffffff', intensity: 1.5, distance: 100, position: { x: 5, y: 5, z: 5 } },
			directional: { color: '#ffffff', intensity: 1, position: { x: -5, y: 10, z: 5 } }
		});

		// Creer le bounding box (zone de spawn)
		createBoundingBox(this.scene, SPAWN_ZONE, '#666666');

		// Controles de camera (OrbitControls)
		this.controls = createOrbitControls(this.sceneContext, {
			enableDamping: true,
			dampingFactor: 0.05,
			minDistance: 5,
			maxDistance: 30
		});

		// Cube manager avec lumieres
		this.cubeManager = new CubeManager(this.scene, {
			useLighting: true,
			metalness: 0.3,
			roughness: 0.7
		});

		// Setup UI
		setupCubeControls(this.cubeManager);

		// Cleanup
		this.onDispose(() => {
			this.cubeManager.clearAll();
			this.controls.dispose();
		});
	}

	protected update(_delta: number): void {
		this.controls.update(); // Necessaire pour le damping
		this.cubeManager.updateAll();
	}
}

// Demarrer la lecon
const lesson = new Lesson04();
lesson.start();
