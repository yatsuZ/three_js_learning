import * as THREE from 'three';
import { DOM } from "../utils/dom.js";
const DEFAULT_OPTIONS = {
    backgroundColor: '#1a1a2e',
    cameraPosition: { x: 0, y: 0, z: 8 },
    fov: 75
};
export function createScene(options = {}) {
    const config = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
    // Canvas
    const canvas = DOM.canvas('canvas');
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.backgroundColor);
    // Camera
    const camera = new THREE.PerspectiveCamera(config.fov, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(config.cameraPosition.x, config.cameraPosition.y, config.cameraPosition.z);
    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    return { canvas, scene, camera, renderer };
}
export function setupResize(ctx) {
    window.addEventListener('resize', () => {
        ctx.camera.aspect = ctx.canvas.clientWidth / ctx.canvas.clientHeight;
        ctx.camera.updateProjectionMatrix();
        ctx.renderer.setSize(ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    });
}
