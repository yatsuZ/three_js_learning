// Core
export { createScene, setupResize } from './core/scene.ts';
export type { SceneOptions, SceneContext } from './core/scene.ts';

export { Cube } from './core/cube.ts';
export type { CubeOptions } from './core/cube.ts';

export { CubeManager } from './core/cubeManager.ts';
export type { CubeManagerOptions } from './core/cubeManager.ts';

export { addLights } from './core/lights.ts';
export type { LightConfig, LightObjects } from './core/lights.ts';

export { createOrbitControls, createBoundingBox } from './core/controls.ts';
export type { ControlsOptions } from './core/controls.ts';

// Config
export { loadConfig, getConfig, getMaxCubes } from './config/loader.ts';
export type { AppConfig } from './config/loader.ts';

// UI
export { setupCubeControls, updateDisplay } from './ui/cubeControls.ts';
