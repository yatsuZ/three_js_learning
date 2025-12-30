import { Cube } from "./cube.js";
export class CubeManager {
    constructor(scene, options = {}) {
        this.cubes = [];
        this.scene = scene;
        this.options = options;
    }
    createCubes(count, wireframe, color) {
        for (let i = 0; i < count; i++) {
            const position = {
                x: (Math.random() - 0.5) * 10,
                y: (Math.random() - 0.5) * 6,
                z: (Math.random() - 0.5) * 6
            };
            const cubeOptions = {
                size: 0.5 + Math.random() * 0.5,
                color: color,
                wireframe: wireframe,
                position: position,
                useLighting: this.options.useLighting,
                metalness: this.options.metalness,
                roughness: this.options.roughness
            };
            const cube = new Cube(this.scene, cubeOptions);
            this.cubes.push(cube);
        }
    }
    createSingleCube(options) {
        var _a, _b, _c;
        const cubeOptions = Object.assign(Object.assign({}, options), { useLighting: (_a = options.useLighting) !== null && _a !== void 0 ? _a : this.options.useLighting, metalness: (_b = options.metalness) !== null && _b !== void 0 ? _b : this.options.metalness, roughness: (_c = options.roughness) !== null && _c !== void 0 ? _c : this.options.roughness });
        const cube = new Cube(this.scene, cubeOptions);
        this.cubes.push(cube);
        return cube;
    }
    clearAll() {
        for (const cube of this.cubes) {
            cube.destroy(this.scene);
        }
        this.cubes = [];
    }
    updateAll() {
        for (const cube of this.cubes) {
            cube.update();
        }
    }
    getCount() {
        return this.cubes.length;
    }
    getCubes() {
        return this.cubes;
    }
}
