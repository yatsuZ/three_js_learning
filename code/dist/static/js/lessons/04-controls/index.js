var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LessonBase, CubeManager, loadConfig, setupCubeControls, addLights, createOrbitControls, createBoundingBox } from "../../shared/index.js";
// Zone de spawn des cubes (doit correspondre a cubeManager)
const SPAWN_ZONE = { x: 10, y: 6, z: 6 };
/**
 * Lecon 04 - OrbitControls et navigation camera
 */
class Lesson04 extends LessonBase {
    constructor() {
        const config = {
            id: '04',
            name: 'Controls'
        };
        super(config);
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            // Charger la config depuis l'API
            yield loadConfig();
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
        });
    }
    update(_delta) {
        this.controls.update(); // Necessaire pour le damping
        this.cubeManager.updateAll();
    }
}
// Demarrer la lecon
const lesson = new Lesson04();
lesson.start();
