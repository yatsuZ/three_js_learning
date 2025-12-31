import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const DEFAULT_OPTIONS = {
    enableDamping: true,
    dampingFactor: 0.05,
    enableZoom: true,
    enablePan: true,
    minDistance: 2,
    maxDistance: 50
};
export function createOrbitControls(ctx, options = {}) {
    const config = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
    const controls = new OrbitControls(ctx.camera, ctx.renderer.domElement);
    controls.enableDamping = config.enableDamping;
    controls.dampingFactor = config.dampingFactor;
    controls.enableZoom = config.enableZoom;
    controls.enablePan = config.enablePan;
    controls.minDistance = config.minDistance;
    controls.maxDistance = config.maxDistance;
    if (config.maxPolarAngle !== undefined) {
        controls.maxPolarAngle = config.maxPolarAngle;
    }
    if (config.minPolarAngle !== undefined) {
        controls.minPolarAngle = config.minPolarAngle;
    }
    return controls;
}
// Creer un cube wireframe pour delimiter une zone
export function createBoundingBox(scene, size, color = '#444444') {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color });
    const boundingBox = new THREE.LineSegments(edges, material);
    scene.add(boundingBox);
    return boundingBox;
}
