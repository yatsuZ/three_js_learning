// Core
export { createScene, setupResize } from './core/scene.ts';
export type { SceneOptions, SceneContext } from './core/scene.ts';

export { LessonBase } from './core/lesson.ts';
export type { LessonConfig } from './core/lesson.ts';

export { Cube } from './core/cube.ts';
export type { CubeOptions } from './core/cube.ts';

export { CubeManager } from './core/cubeManager.ts';
export type { CubeManagerOptions } from './core/cubeManager.ts';

export { addLights } from './core/lights.ts';
export type { LightConfig, LightObjects } from './core/lights.ts';

export { createOrbitControls, createBoundingBox } from './core/controls.ts';
export type { ControlsOptions } from './core/controls.ts';

export { loadTexture, createCheckerTexture, createNoiseTexture, createGradientTexture } from './core/textures.ts';

export { loadGLTF, loadGLTFFromFile, fitModelToView } from './core/modelLoader.ts';
export type { LoadedModel } from './core/modelLoader.ts';

// Config
export { loadConfig, getConfig, getMaxCubes } from './config/loader.ts';
export type { AppConfig } from './config/loader.ts';

// UI
export { setupCubeControls, updateDisplay } from './ui/cubeControls.ts';

// Utils
export { Logger } from './utils/logger.ts';
export { fetchWithRetry, safeFetch } from './utils/fetch.ts';
export type { FetchOptions } from './utils/fetch.ts';
export { getElement, getElementOrNull, DOM } from './utils/dom.ts';
export { DOMElementNotFoundError, DOMElementTypeError } from './utils/dom.ts';
