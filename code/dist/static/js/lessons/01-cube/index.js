import { LessonBase, CubeManager, addLights, DOM } from "../../shared/index.js";
// Configuration des cubes
const CUBES_CONFIG = [
    { color: '#00d9ff', wireframe: true, position: { x: 0, y: 0, z: 0 }, rotationSpeed: { x: 0.01, y: 0.01, z: 0 } },
    { color: '#ff6b6b', wireframe: false, position: { x: -2.5, y: 0, z: 0 }, rotationSpeed: { x: 0.02, y: 0, z: 0.01 } },
    { color: '#4ecdc4', wireframe: false, transparent: true, opacity: 0.5, position: { x: 2.5, y: 0, z: 0 }, rotationSpeed: { x: 0, y: 0.02, z: 0.01 } }
];
/**
 * Lecon 01 - Introduction aux cubes 3D
 */
class Lesson01 extends LessonBase {
    constructor() {
        const config = {
            id: '01',
            name: 'Cube 3D'
        };
        super(config);
        this.lights = null;
        this.useLighting = false;
    }
    setup() {
        // Creer les cubes initiaux
        this.cubeManager = new CubeManager(this.scene, { useLighting: false });
        this.createCubes();
        // Setup UI - toggle lumieres
        const lightingToggle = DOM.input('lighting-toggle');
        this.addEventListener(lightingToggle, 'change', () => {
            this.toggleLighting(lightingToggle.checked);
        });
        // Cleanup
        this.onDispose(() => {
            this.cubeManager.clearAll();
            if (this.lights) {
                if (this.lights.ambient)
                    this.scene.remove(this.lights.ambient);
                if (this.lights.point)
                    this.scene.remove(this.lights.point);
                if (this.lights.directional)
                    this.scene.remove(this.lights.directional);
            }
        });
    }
    update(_delta) {
        this.cubeManager.updateAll();
    }
    createCubes(savedRotations) {
        this.cubeManager.clearAll();
        this.cubeManager = new CubeManager(this.scene, {
            useLighting: this.useLighting,
            metalness: 0.3,
            roughness: 0.7
        });
        CUBES_CONFIG.forEach((config, index) => {
            const cube = this.cubeManager.createSingleCube(Object.assign(Object.assign({}, config), { size: 0.8 }));
            // Restaurer la rotation si disponible
            if (savedRotations && savedRotations[index]) {
                cube.mesh.rotation.x = savedRotations[index].x;
                cube.mesh.rotation.y = savedRotations[index].y;
                cube.mesh.rotation.z = savedRotations[index].z;
            }
        });
    }
    toggleLighting(enabled) {
        // Sauvegarder les rotations actuelles
        const savedRotations = this.cubeManager.getCubes().map(cube => ({
            x: cube.mesh.rotation.x,
            y: cube.mesh.rotation.y,
            z: cube.mesh.rotation.z
        }));
        this.useLighting = enabled;
        if (enabled && !this.lights) {
            this.lights = addLights(this.scene, {
                ambient: { color: '#ffffff', intensity: 1 },
                point: { color: '#ffffff', intensity: 2, distance: 100, position: { x: 5, y: 5, z: 5 } },
                directional: { color: '#ffffff', intensity: 1.5, position: { x: -5, y: 10, z: 5 } }
            });
        }
        else if (!enabled && this.lights) {
            if (this.lights.ambient)
                this.scene.remove(this.lights.ambient);
            if (this.lights.point)
                this.scene.remove(this.lights.point);
            if (this.lights.directional)
                this.scene.remove(this.lights.directional);
            this.lights = null;
        }
        // Recreer les cubes avec le bon materiau ET restaurer les rotations
        this.createCubes(savedRotations);
    }
}
// Demarrer la lecon
const lesson = new Lesson01();
lesson.start();
