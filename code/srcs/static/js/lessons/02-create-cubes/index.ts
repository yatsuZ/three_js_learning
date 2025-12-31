import {
	LessonBase,
	CubeManager,
	loadConfig,
	setupCubeControls
} from '../../shared/index.ts';
import type { LessonConfig } from '../../shared/index.ts';

/**
 * Lecon 02 - Creation dynamique de cubes
 */
class Lesson02 extends LessonBase {
	private cubeManager!: CubeManager;

	constructor() {
		const config: LessonConfig = {
			id: '02',
			name: 'Create Cubes'
		};
		super(config);
	}

	protected async setup(): Promise<void> {
		// Charger la config depuis l'API
		await loadConfig();

		// Cube manager (sans lumieres)
		this.cubeManager = new CubeManager(this.scene, { useLighting: false });

		// Setup UI avec les controles
		setupCubeControls(this.cubeManager);

		// Cleanup du CubeManager quand la lecon s'arrete
		this.onDispose(() => {
			this.cubeManager.clearAll();
		});
	}

	protected update(_delta: number): void {
		this.cubeManager.updateAll();
	}
}

// Demarrer la lecon
const lesson = new Lesson02();
lesson.start();
