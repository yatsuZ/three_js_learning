var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LessonBase, CubeManager, loadConfig, setupCubeControls } from "../../shared/index.js";
/**
 * Lecon 02 - Creation dynamique de cubes
 */
class Lesson02 extends LessonBase {
    constructor() {
        const config = {
            id: '02',
            name: 'Create Cubes'
        };
        super(config);
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            // Charger la config depuis l'API
            yield loadConfig();
            // Cube manager (sans lumieres)
            this.cubeManager = new CubeManager(this.scene, { useLighting: false });
            // Setup UI avec les controles
            setupCubeControls(this.cubeManager);
            // Cleanup du CubeManager quand la lecon s'arrete
            this.onDispose(() => {
                this.cubeManager.clearAll();
            });
        });
    }
    update(_delta) {
        this.cubeManager.updateAll();
    }
}
// Demarrer la lecon
const lesson = new Lesson02();
lesson.start();
