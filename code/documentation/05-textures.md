# Leçon 05 - Textures

## Objectif
Appliquer des images (textures) sur les surfaces des objets 3D.

---

## Concepts Three.js

### 1. Qu'est-ce qu'une texture?

Une **texture** est une image 2D appliquée sur une surface 3D. Elle donne du réalisme sans ajouter de géométrie.

```
Cube sans texture:        Cube avec texture bois:
┌─────────┐              ┌─────────┐
│         │              │ ═══════ │
│  BLEU   │      →       │ ═══════ │
│         │              │ ═══════ │
└─────────┘              └─────────┘
```

### 2. TextureLoader

Charger une image comme texture:

```typescript
const loader = new THREE.TextureLoader();
const texture = loader.load('/path/to/image.jpg');

const material = new THREE.MeshStandardMaterial({
    map: texture  // Appliquer la texture
});
```

**Formats supportés:** JPG, PNG, WebP, GIF

### 3. Textures procédurales (Canvas)

Créer des textures par code avec Canvas 2D:

```typescript
// Créer un canvas
const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext('2d');

// Dessiner un damier
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, 128, 128);
ctx.fillRect(128, 128, 128, 128);
ctx.fillStyle = '#888888';
ctx.fillRect(128, 0, 128, 128);
ctx.fillRect(0, 128, 128, 128);

// Convertir en texture Three.js
const texture = new THREE.CanvasTexture(canvas);
```

### 4. Types de textures procédurales

#### Damier (Checker)
```typescript
function createCheckerTexture(size, color1, color2) {
    const canvas = document.createElement('canvas');
    canvas.width = size * 2;
    canvas.height = size * 2;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, size, size);
    ctx.fillRect(size, size, size, size);

    ctx.fillStyle = color2;
    ctx.fillRect(size, 0, size, size);
    ctx.fillRect(0, size, size, size);

    return new THREE.CanvasTexture(canvas);
}
```

#### Bruit (Noise)
```typescript
function createNoiseTexture(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const imageData = ctx.createImageData(size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
        const value = Math.random() * 255;
        imageData.data[i] = value;      // R
        imageData.data[i + 1] = value;  // G
        imageData.data[i + 2] = value;  // B
        imageData.data[i + 3] = 255;    // A (opaque)
    }
    ctx.putImageData(imageData, 0, 0);

    return new THREE.CanvasTexture(canvas);
}
```

#### Gradient
```typescript
function createGradientTexture(color1, color2) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    return new THREE.CanvasTexture(canvas);
}
```

### 5. Propriétés des textures

```typescript
const texture = new THREE.CanvasTexture(canvas);

// Répétition
texture.wrapS = THREE.RepeatWrapping;  // Horizontal
texture.wrapT = THREE.RepeatWrapping;  // Vertical
texture.repeat.set(2, 2);  // Répéter 2x2

// Filtrage (qualité)
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;

// Espace colorimétrique (important pour les couleurs correctes)
texture.colorSpace = THREE.SRGBColorSpace;
```

### 6. Charger une texture depuis un fichier (Upload)

```typescript
const input = document.getElementById('texture-upload');
input.addEventListener('change', (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const texture = new THREE.Texture(img);
            texture.needsUpdate = true;
            texture.colorSpace = THREE.SRGBColorSpace;

            material.map = texture;
            material.needsUpdate = true;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});
```

---

## Code de la leçon

```typescript
import * as THREE from 'three';
import {
    createScene,
    setupResize,
    addLights,
    createOrbitControls,
    createCheckerTexture,
    createNoiseTexture,
    createGradientTexture
} from '../../shared/index.ts';

const ctx = createScene({ backgroundColor: '#1a1a2e' });
setupResize(ctx);
addLights(ctx.scene);
const controls = createOrbitControls(ctx);

// 4 cubes avec différentes textures
const cubes = [];

// Cube 1: Damier
const checker = createCheckerTexture(32, '#00d9ff', '#1a1a2e');
cubes.push(createTexturedCube(checker, { x: -3, y: 0, z: 0 }));

// Cube 2: Bruit
const noise = createNoiseTexture(128);
cubes.push(createTexturedCube(noise, { x: -1, y: 0, z: 0 }));

// Cube 3: Gradient
const gradient = createGradientTexture('#00d9ff', '#ff6b6b');
cubes.push(createTexturedCube(gradient, { x: 1, y: 0, z: 0 }));

// Cube 4: Custom (upload)
cubes.push(createTexturedCube(null, { x: 3, y: 0, z: 0 }));

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

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    cubes.forEach(cube => {
        cube.rotation.x += 0.005;
        cube.rotation.y += 0.01;
    });
    ctx.renderer.render(ctx.scene, ctx.camera);
}
animate();
```

---

## Autres types de maps (textures avancées)

| Map | Description |
|-----|-------------|
| **map** | Couleur/albedo de base |
| **normalMap** | Faux relief (bumps) |
| **roughnessMap** | Variation de rugosité |
| **metalnessMap** | Variation de métal |
| **aoMap** | Ambient Occlusion (ombres douces) |
| **emissiveMap** | Zones qui émettent de la lumière |
| **displacementMap** | Vrai relief (modifie la géométrie) |

---

## Points clés à retenir

1. **TextureLoader** = charger des images
2. **CanvasTexture** = créer des textures par code
3. **map** = propriété du matériau pour la texture
4. **needsUpdate = true** = forcer la mise à jour
5. **colorSpace = SRGBColorSpace** = couleurs correctes
6. **wrapS/wrapT** = mode de répétition
