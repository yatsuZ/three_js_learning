import * as THREE from 'three';
import { Cube, CubeOptions } from './cube.ts';

export interface CubeManagerOptions {
	useLighting?: boolean;
	metalness?: number;
	roughness?: number;
}

export class CubeManager {
	private cubes: Cube[] = [];
	private scene: THREE.Scene;
	private options: CubeManagerOptions;

	constructor(scene: THREE.Scene, options: CubeManagerOptions = {}) {
		this.scene = scene;
		this.options = options;
	}

	createCubes(count: number, wireframe: boolean, color: string): void {
		for (let i = 0; i < count; i++) {
			const position = {
				x: (Math.random() - 0.5) * 10,
				y: (Math.random() - 0.5) * 6,
				z: (Math.random() - 0.5) * 6
			};

			const cubeOptions: CubeOptions = {
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

	createSingleCube(options: CubeOptions): Cube {
		const cubeOptions: CubeOptions = {
			...options,
			useLighting: options.useLighting ?? this.options.useLighting,
			metalness: options.metalness ?? this.options.metalness,
			roughness: options.roughness ?? this.options.roughness
		};
		const cube = new Cube(this.scene, cubeOptions);
		this.cubes.push(cube);
		return cube;
	}

	clearAll(): void {
		for (const cube of this.cubes) {
			cube.destroy(this.scene);
		}
		this.cubes = [];
	}

	updateAll(): void {
		for (const cube of this.cubes) {
			cube.update();
		}
	}

	getCount(): number {
		return this.cubes.length;
	}

	getCubes(): Cube[] {
		return this.cubes;
	}
}
