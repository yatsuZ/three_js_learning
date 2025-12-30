var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createScene, setupResize, CubeManager, loadConfig, setupCubeControls, addLights } from "../../shared/index.js";
// === INIT ===
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        // Charger la config depuis l'API
        yield loadConfig();
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
        function animate() {
            requestAnimationFrame(animate);
            cubeManager.updateAll();
            ctx.renderer.render(ctx.scene, ctx.camera);
        }
        animate();
        console.log('Lesson 03 - Lights loaded!');
    });
}
init();
