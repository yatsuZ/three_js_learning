import * as THREE from 'three';
import { createScene, setupResize, addLights, createOrbitControls, createCheckerTexture, createNoiseTexture, createGradientTexture } from "../../shared/index.js";
// === INIT ===
const ctx = createScene({ backgroundColor: '#1a1a2e' });
setupResize(ctx);
// Lumieres
addLights(ctx.scene, {
    ambient: { color: '#ffffff', intensity: 0.8 },
    point: { color: '#ffffff', intensity: 1.5, distance: 100, position: { x: 5, y: 5, z: 5 } },
    directional: { color: '#ffffff', intensity: 1, position: { x: -5, y: 10, z: 5 } }
});
// Controles camera
const controls = createOrbitControls(ctx, { minDistance: 3, maxDistance: 20 });
// Cubes avec differentes textures
const cubes = [];
const textureTypes = ['checker', 'noise', 'gradient', 'custom'];
function createTexturedCube(texture, position) {
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.1,
        roughness: 0.8
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    ctx.scene.add(mesh);
    return mesh;
}
// Creer les 4 cubes avec differentes textures
function setupCubes() {
    // Cube 1: Damier
    const checker = createCheckerTexture(32, '#00d9ff', '#1a1a2e');
    cubes.push(createTexturedCube(checker, { x: -3, y: 0, z: 0 }));
    // Cube 2: Bruit
    const noise = createNoiseTexture(128);
    cubes.push(createTexturedCube(noise, { x: -1, y: 0, z: 0 }));
    // Cube 3: Gradient
    const gradient = createGradientTexture('#00d9ff', '#ff6b6b');
    cubes.push(createTexturedCube(gradient, { x: 1, y: 0, z: 0 }));
    // Cube 4: Custom (vide par defaut, sera rempli par upload)
    cubes.push(createTexturedCube(null, { x: 3, y: 0, z: 0 }));
    // Couleur par defaut pour le cube custom
    cubes[3].material.color.set('#888888');
}
// Labels pour les cubes
function createLabels() {
    const labels = ['Damier', 'Bruit', 'Gradient', 'Custom'];
    const positions = [-3, -1, 1, 3];
    labels.forEach((text, i) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        context.fillStyle = '#00d9ff';
        context.font = 'bold 32px Arial';
        context.textAlign = 'center';
        context.fillText(text, 128, 40);
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.position.set(positions[i], -1.5, 0);
        sprite.scale.set(2, 0.5, 1);
        ctx.scene.add(sprite);
    });
}
// Gestion de l'upload de texture custom
function setupUpload() {
    const input = document.getElementById('texture-upload');
    input.addEventListener('change', (e) => {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (event) => {
            var _a;
            const img = new Image();
            img.onload = () => {
                const texture = new THREE.Texture(img);
                texture.needsUpdate = true;
                texture.colorSpace = THREE.SRGBColorSpace;
                // Appliquer au cube custom (index 3)
                const material = cubes[3].material;
                material.map = texture;
                material.color.set('#ffffff');
                material.needsUpdate = true;
            };
            img.src = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
        };
        reader.readAsDataURL(file);
    });
}
// Rotation des cubes
function rotateCubes() {
    cubes.forEach(cube => {
        cube.rotation.x += 0.005;
        cube.rotation.y += 0.01;
    });
}
// Setup
setupCubes();
createLabels();
setupUpload();
// Animation
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    rotateCubes();
    ctx.renderer.render(ctx.scene, ctx.camera);
}
animate();
console.log('Lesson 05 - Textures loaded!');
