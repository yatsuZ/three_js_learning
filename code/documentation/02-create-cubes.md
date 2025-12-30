# Leçon 02 - Créer des Cubes

## Objectif
Créer une interface utilisateur pour générer des cubes dynamiquement.

---

## Concepts Three.js

### 1. Création dynamique d'objets
On peut créer des objets à la volée et les ajouter à la scène.

```typescript
// Créer un cube
const geometry = new THREE.BoxGeometry(size, size, size);
const material = new THREE.MeshBasicMaterial({ color, wireframe });
const mesh = new THREE.Mesh(geometry, material);

// Positionner aléatoirement
mesh.position.set(
    (Math.random() - 0.5) * 10,  // x: -5 à 5
    (Math.random() - 0.5) * 6,   // y: -3 à 3
    (Math.random() - 0.5) * 6    // z: -3 à 3
);

scene.add(mesh);
```

### 2. Suppression d'objets (Memory Management)
**Important:** Toujours libérer la mémoire quand on supprime un objet.

```typescript
function destroy(mesh, scene) {
    scene.remove(mesh);           // Retirer de la scène
    mesh.geometry.dispose();      // Libérer la géométrie
    mesh.material.dispose();      // Libérer le matériau
}
```

⚠️ **Sans dispose()**, les ressources GPU restent en mémoire = memory leak!

### 3. Pattern Manager
Un gestionnaire centralise la création/mise à jour/suppression des objets.

```typescript
class CubeManager {
    private cubes: Cube[] = [];
    private scene: THREE.Scene;

    createCubes(count, wireframe, color) {
        for (let i = 0; i < count; i++) {
            const cube = new Cube(this.scene, { wireframe, color });
            this.cubes.push(cube);
        }
    }

    clearAll() {
        this.cubes.forEach(cube => cube.destroy(this.scene));
        this.cubes = [];
    }

    updateAll() {
        this.cubes.forEach(cube => cube.update());
    }

    getCount() {
        return this.cubes.length;
    }
}
```

### 4. Couleurs en Three.js
Three.js accepte plusieurs formats de couleur:

```typescript
// Format string hexadécimal (recommandé)
material.color.set('#00d9ff');

// Format nombre hexadécimal
material.color.set(0x00d9ff);

// Format RGB (0-1)
material.color.setRGB(0, 0.85, 1);

// Format HSL
material.color.setHSL(0.5, 1, 0.5);
```

---

## Code de la leçon

```typescript
import {
    createScene,
    setupResize,
    CubeManager,
    loadConfig,
    setupCubeControls
} from '../../shared/index.ts';

async function init() {
    // Charger la config (MAX_CUBES depuis l'API)
    await loadConfig();

    // Setup scène
    const ctx = createScene({ backgroundColor: '#1a1a2e' });
    setupResize(ctx);

    // Gestionnaire de cubes
    const cubeManager = new CubeManager(ctx.scene, { useLighting: false });

    // Setup interface utilisateur
    setupCubeControls(cubeManager);

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        cubeManager.updateAll();
        ctx.renderer.render(ctx.scene, ctx.camera);
    }
    animate();
}

init();
```

---

## Interface Utilisateur

### Éléments du DOM
```html
<input type="number" id="cube-count" value="5" min="1" max="50">
<input type="color" id="cube-color" value="#00d9ff">
<input type="checkbox" id="wireframe" checked>
<button id="create-btn">Créer</button>
<button id="clear-btn">Tout supprimer</button>
```

### Gestion des événements
```typescript
createBtn.addEventListener('click', () => {
    const count = parseInt(countInput.value);
    const wireframe = wireframeCheckbox.checked;
    const color = colorInput.value;

    cubeManager.createCubes(count, wireframe, color);
});

clearBtn.addEventListener('click', () => {
    cubeManager.clearAll();
});
```

---

## Configuration depuis l'API

La limite MAX_CUBES est définie côté serveur:

```typescript
// .env
MAX_CUBES=2000

// Backend: /api/config
fastify.get('/config', async () => {
    return { maxCubes: parseInt(process.env.MAX_CUBES) || 1000 };
});

// Frontend: charger la config
async function loadConfig() {
    const response = await fetch('/api/config');
    const data = await response.json();
    MAX_CUBES = data.maxCubes;
}
```

---

## Points clés à retenir

1. **dispose()** est obligatoire pour éviter les memory leaks
2. **Pattern Manager** = gestion centralisée des objets
3. **Math.random() - 0.5** = distribution entre -0.5 et 0.5
4. Les couleurs peuvent être des strings `'#00d9ff'` ou des nombres `0x00d9ff`
5. La config peut venir du serveur via une API
