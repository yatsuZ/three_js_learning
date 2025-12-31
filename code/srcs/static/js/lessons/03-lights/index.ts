import {
	LessonBase,
	CubeManager,
	loadConfig,
	setupCubeControls,
	addLights
} from '../../shared/index.ts';
import type { LessonConfig } from '../../shared/index.ts';

/**
 * Lecon 03 - Systeme de lumieres
 */
class Lesson03 extends LessonBase {
	private cubeManager!: CubeManager;

	constructor() {
		const config: LessonConfig = {
			id: '03',
			name: 'Lights'
		};
		super(config);
	}

	protected async setup(): Promise<void> {
		// Charger la config depuis l'API
		await loadConfig();

		// Ajouter les lumieres
		addLights(this.scene, {
			ambient: { color: '#404040', intensity: 0.5 },
			point: { color: '#ffffff', intensity: 1, distance: 100, position: { x: 5, y: 5, z: 5 } },
			directional: { color: '#ffffff', intensity: 0.8, position: { x: -5, y: 10, z: 5 } }
		});

		// Cube manager AVEC lumieres (MeshStandardMaterial)
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
		});
	}

	protected update(_delta: number): void {
		this.cubeManager.updateAll();
	}
}

// Demarrer la lecon
const lesson = new Lesson03();
lesson.start();
