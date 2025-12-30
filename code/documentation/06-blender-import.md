# Leçon 06 - Blender Import

## Objectif
Charger des modèles 3D créés dans Blender (.glb/.gltf) dans Three.js.

---

## Le format glTF / GLB

### Qu'est-ce que glTF?

**glTF** (GL Transmission Format) est le "JPEG de la 3D" - un format standard pour les modèles 3D sur le web.

| Format | Extension | Description |
|--------|-----------|-------------|
| **glTF** | `.gltf` + `.bin` + images | JSON lisible + fichiers séparés |
| **GLB** | `.glb` | Binaire unique (tout inclus) ✅ |

**GLB est recommandé** car:
- Fichier unique = pas de dépendances
- Plus compact (binaire)
- Plus rapide à charger

### Contenu d'un fichier GLB

```
📦 model.glb
├── 🎨 Meshes (géométrie)
├── 🖼️ Textures (images intégrées)
├── 🎭 Materials (PBR)
├── 🦴 Skeleton (os pour l'animation)
├── 🎬 Animations
├── 📷 Cameras
└── 💡 Lights
```

---

## Exporter depuis Blender

### Étapes d'export

1. **File > Export > glTF 2.0 (.glb/.gltf)**

2. **Format:** `glTF Binary (.glb)` ✅

3. **Options importantes:**
   ```
   ☑️ Export all layers
   ☑️ Export materials
   ☑️ Export texture coordinates
   ☑️ Export normals
   ☑️ Export animations (si présentes)
   ☐ Custom Properties (optionnel)
   ☐ Cameras (optionnel)
   ☐ Punctual Lights (optionnel)
   ```

4. **Cliquer "Export glTF 2.0"**

### Conseils pour l'export

```
✅ Appliquer les transformations: Ctrl+A > All Transforms
✅ Vérifier les UV maps
✅ Réduire la taille des textures (1024x1024 max pour le web)
✅ Optimiser le mesh (pas trop de polygones)
```

---

## Charger dans Three.js

### GLTFLoader

```typescript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

loader.load(
    '/models/pasteque.glb',  // URL du fichier
    (gltf) => {
        // Succès
        scene.add(gltf.scene);
    },
    (progress) => {
        // Progression
        console.log((progress.loaded / progress.total * 100) + '%');
    },
    (error) => {
        // Erreur
        console.error('Erreur:', error);
    }
);
```

### Charger depuis un fichier uploadé

```typescript
function loadFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            loader.parse(
                arrayBuffer,
                '',
                (gltf) => resolve(gltf),
                (error) => reject(error)
            );
        };
        reader.readAsArrayBuffer(file);
    });
}

// Usage
const input = document.getElementById('model-upload');
input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const gltf = await loadFromFile(file);
    scene.add(gltf.scene);
});
```

### Structure du résultat GLTF

```typescript
loader.load('/model.glb', (gltf) => {
    gltf.scene;       // THREE.Group - le modèle 3D
    gltf.scenes;      // Array de scènes (si plusieurs)
    gltf.animations;  // Array de THREE.AnimationClip
    gltf.cameras;     // Array de caméras
    gltf.asset;       // Métadonnées (version, générateur...)
});
```

---

## Centrer et redimensionner

Les modèles Blender ont souvent une taille/position différente:

```typescript
function fitModelToView(model, targetSize = 3) {
    // Calculer la bounding box
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Calculer le facteur d'échelle
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = targetSize / maxDim;
    model.scale.multiplyScalar(scale);

    // Centrer le modèle
    box.setFromObject(model);
    box.getCenter(center);
    model.position.sub(center);
}

// Usage
loader.load('/model.glb', (gltf) => {
    fitModelToView(gltf.scene, 3);  // Taille max = 3 unités
    scene.add(gltf.scene);
});
```

---

## Animations

Si le modèle a des animations:

```typescript
let mixer;
const clock = new THREE.Clock();

loader.load('/model.glb', (gltf) => {
    scene.add(gltf.scene);

    if (gltf.animations.length > 0) {
        // Créer le mixer
        mixer = new THREE.AnimationMixer(gltf.scene);

        // Jouer la première animation
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
    }
});

function animate() {
    requestAnimationFrame(animate);

    // Mettre à jour l'animation
    if (mixer) {
        const delta = clock.getDelta();
        mixer.update(delta);
    }

    renderer.render(scene, camera);
}
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
    loadGLTFFromFile,
    fitModelToView
} from '../../shared/index.ts';

const ctx = createScene({ backgroundColor: '#1a1a2e' });
setupResize(ctx);

// Lumières fortes pour bien voir le modèle
addLights(ctx.scene, {
    ambient: { color: '#ffffff', intensity: 1.2 },
    point: { color: '#ffffff', intensity: 2, distance: 100, position: { x: 5, y: 5, z: 5 } },
    directional: { color: '#ffffff', intensity: 1.5, position: { x: -5, y: 10, z: 5 } }
});

// Grille au sol
const grid = new THREE.GridHelper(10, 10, '#444444', '#333333');
ctx.scene.add(grid);

// Contrôles
const controls = createOrbitControls(ctx);

// Variables
let currentModel = null;
const clock = new THREE.Clock();

// Upload
const input = document.getElementById('model-upload');
input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Supprimer l'ancien modèle
    if (currentModel) {
        ctx.scene.remove(currentModel.scene);
    }

    // Charger le nouveau
    currentModel = await loadGLTFFromFile(file);
    fitModelToView(currentModel.scene, 3);
    ctx.scene.add(currentModel.scene);

    // Jouer l'animation si présente
    if (currentModel.mixer && currentModel.animations.length > 0) {
        const action = currentModel.mixer.clipAction(currentModel.animations[0]);
        action.play();
    }
});

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Mise à jour animation
    if (currentModel?.mixer) {
        currentModel.mixer.update(delta);
    }

    // Auto-rotation
    if (currentModel) {
        currentModel.scene.rotation.y += 0.005;
    }

    controls.update();
    ctx.renderer.render(ctx.scene, ctx.camera);
}
animate();
```

---

## Ressources et tutoriels

### Documentation officielle
- [Three.js GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)
- [glTF Specification](https://www.khronos.org/gltf/)

### Tutoriels recommandés
- [Discover three.js - Load Models](https://discoverthreejs.com/book/first-steps/load-models/)
- [Medium - Blender to Three.js](https://medium.com/@matthewmain/how-to-import-a-3d-blender-object-into-a-three-js-project-as-a-gltf-file-5a67290f65f2)

### Outils utiles
- [glTF Viewer](https://gltf-viewer.donmccurdy.com/) - Visualiser vos fichiers GLB
- [Blender](https://www.blender.org/) - Logiciel 3D gratuit
- [Sketchfab](https://sketchfab.com/) - Modèles 3D gratuits en GLB

---

## Points clés à retenir

1. **GLB** = format recommandé (binaire, tout-en-un)
2. **GLTFLoader** = chargeur Three.js pour glTF/GLB
3. **gltf.scene** = le modèle 3D (THREE.Group)
4. **gltf.animations** = animations intégrées
5. **AnimationMixer** = contrôler les animations
6. **fitModelToView()** = centrer et redimensionner automatiquement
7. Blender export: **File > Export > glTF 2.0 (.glb)**
