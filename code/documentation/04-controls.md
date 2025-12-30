# Leçon 04 - Controls

## Objectif
Permettre à l'utilisateur de naviguer dans la scène 3D avec la souris.

---

## Concepts Three.js

### 1. OrbitControls

**OrbitControls** permet de tourner autour d'un point central (orbite), zoomer et se déplacer.

```typescript
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);
```

**Contrôles par défaut:**
| Action | Souris |
|--------|--------|
| Rotation (orbite) | Clic gauche + drag |
| Zoom | Molette |
| Pan (déplacement) | Clic droit + drag |

### 2. Options OrbitControls

```typescript
const controls = new OrbitControls(camera, renderer.domElement);

// Damping = mouvement fluide avec inertie
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Limites de zoom
controls.minDistance = 2;   // Distance minimum
controls.maxDistance = 50;  // Distance maximum

// Activer/désactiver les contrôles
controls.enableZoom = true;
controls.enablePan = true;
controls.enableRotate = true;

// Limiter la rotation verticale
controls.minPolarAngle = 0;              // Regarder depuis dessus
controls.maxPolarAngle = Math.PI / 2;    // Pas en dessous de l'horizon
```

⚠️ **Important:** Avec `enableDamping`, il faut appeler `controls.update()` dans la boucle d'animation!

```typescript
function animate() {
    requestAnimationFrame(animate);
    controls.update();  // Obligatoire pour le damping!
    renderer.render(scene, camera);
}
```

### 3. Autres types de Controls

| Control | Description |
|---------|-------------|
| **OrbitControls** | Orbite autour d'un point (le plus courant) |
| **TrackballControls** | Rotation libre sans contrainte |
| **FlyControls** | Vol libre style jeu vidéo |
| **FirstPersonControls** | Vue première personne |
| **PointerLockControls** | FPS avec verrouillage du curseur |
| **DragControls** | Glisser-déposer des objets |

---

### 4. Bounding Box (Zone de spawn)

Afficher une boîte wireframe pour délimiter une zone:

```typescript
function createBoundingBox(scene, size, color = '#444444') {
    const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const edges = new THREE.EdgesGeometry(geometry);  // Seulement les arêtes
    const material = new THREE.LineBasicMaterial({ color });
    const box = new THREE.LineSegments(edges, material);
    scene.add(box);
    return box;
}

// Zone de spawn: 10 x 6 x 6
createBoundingBox(scene, { x: 10, y: 6, z: 6 }, '#666666');
```

**EdgesGeometry** extrait uniquement les arêtes d'une géométrie, créant un effet wireframe propre (sans diagonales).

---

## Code de la leçon

```typescript
import {
    createScene,
    setupResize,
    CubeManager,
    loadConfig,
    setupCubeControls,
    addLights,
    createOrbitControls,
    createBoundingBox
} from '../../shared/index.ts';

const SPAWN_ZONE = { x: 10, y: 6, z: 6 };

async function init() {
    await loadConfig();

    const ctx = createScene({ backgroundColor: '#1a1a2e' });
    setupResize(ctx);

    // Lumières
    addLights(ctx.scene);

    // Zone de spawn visible
    createBoundingBox(ctx.scene, SPAWN_ZONE, '#666666');

    // Contrôles caméra
    const controls = createOrbitControls(ctx, {
        enableDamping: true,
        dampingFactor: 0.05,
        minDistance: 5,
        maxDistance: 30
    });

    // Cubes
    const cubeManager = new CubeManager(ctx.scene, {
        useLighting: true,
        metalness: 0.3,
        roughness: 0.7
    });

    setupCubeControls(cubeManager);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();  // Important pour le damping!
        cubeManager.updateAll();
        ctx.renderer.render(ctx.scene, ctx.camera);
    }
    animate();
}

init();
```

---

## Import Map pour les addons

Les contrôles sont des **addons** (pas dans le core de Three.js):

```html
<script type="importmap">
{
    "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
    }
}
</script>
```

Puis dans le code:
```typescript
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
```

---

## Points clés à retenir

1. **OrbitControls** = navigation souris standard (orbite + zoom + pan)
2. **enableDamping** = mouvement fluide avec inertie
3. **controls.update()** obligatoire dans la boucle avec damping
4. **minDistance/maxDistance** = limites de zoom
5. **EdgesGeometry** = wireframe propre (arêtes seulement)
6. Les controls sont des **addons** (`three/addons/`)
