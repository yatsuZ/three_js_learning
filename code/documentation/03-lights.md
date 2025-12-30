# Leçon 03 - Lumières

## Objectif
Comprendre les différents types de lumières et les matériaux qui réagissent à l'éclairage.

---

## Concepts Three.js

### 1. Types de lumières

#### AmbientLight (Lumière ambiante)
Éclaire **uniformément** tous les objets. Pas d'ombre, pas de direction.

```typescript
const ambientLight = new THREE.AmbientLight(
    '#ffffff',  // couleur
    0.5         // intensité (0-1+)
);
scene.add(ambientLight);
```

**Usage:** Éclairer les zones d'ombre, éviter le noir total.

#### PointLight (Lumière ponctuelle)
Comme une **ampoule** - émet dans toutes les directions depuis un point.

```typescript
const pointLight = new THREE.PointLight(
    '#ffffff',  // couleur
    1,          // intensité
    100         // distance max (0 = infini)
);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);
```

**Usage:** Lampes, bougies, étoiles.

#### DirectionalLight (Lumière directionnelle)
Comme le **soleil** - rayons parallèles depuis l'infini.

```typescript
const directionalLight = new THREE.DirectionalLight(
    '#ffffff',  // couleur
    0.8         // intensité
);
directionalLight.position.set(-5, 10, 5);  // Direction de la lumière
scene.add(directionalLight);
```

**Usage:** Soleil, éclairage extérieur.

#### SpotLight (Spot)
Comme une **lampe torche** - cône de lumière directionnel.

```typescript
const spotLight = new THREE.SpotLight(
    '#ffffff',      // couleur
    1,              // intensité
    100,            // distance
    Math.PI / 6,    // angle du cône
    0.5             // penumbra (flou des bords)
);
spotLight.position.set(0, 10, 0);
spotLight.target.position.set(0, 0, 0);  // Cible
scene.add(spotLight);
```

---

### 2. Matériaux et lumières

#### MeshBasicMaterial
**Ne réagit PAS** à la lumière. Couleur fixe.

```typescript
new THREE.MeshBasicMaterial({ color: '#00d9ff' });
```

#### MeshStandardMaterial
**Réagit à la lumière.** Basé sur le modèle PBR (Physically Based Rendering).

```typescript
new THREE.MeshStandardMaterial({
    color: '#00d9ff',
    metalness: 0.3,   // 0 = plastique, 1 = métal
    roughness: 0.7    // 0 = miroir, 1 = mat
});
```

**Propriétés PBR:**
| Propriété | 0 | 1 |
|-----------|---|---|
| metalness | Plastique, bois | Métal, chrome |
| roughness | Miroir, verre poli | Béton, tissu |

#### MeshPhongMaterial
Réagit à la lumière avec des **reflets spéculaires** (brillance).

```typescript
new THREE.MeshPhongMaterial({
    color: '#00d9ff',
    shininess: 100,   // Intensité des reflets
    specular: '#ffffff'
});
```

---

### 3. Comparaison visuelle

```
Sans lumière (MeshBasicMaterial):
┌─────────┐
│  ████   │  Couleur plate, pas de profondeur
│  ████   │
└─────────┘

Avec lumière (MeshStandardMaterial):
┌─────────┐
│  ▓▓██   │  Dégradé de lumière = perception 3D
│  ░░▓▓   │
└─────────┘
```

---

## Code de la leçon

```typescript
import {
    createScene,
    setupResize,
    CubeManager,
    loadConfig,
    setupCubeControls,
    addLights
} from '../../shared/index.ts';

async function init() {
    await loadConfig();

    const ctx = createScene({ backgroundColor: '#1a1a2e' });
    setupResize(ctx);

    // Ajouter les 3 types de lumières
    addLights(ctx.scene, {
        ambient: { color: '#404040', intensity: 0.5 },
        point: { color: '#ffffff', intensity: 1, distance: 100, position: { x: 5, y: 5, z: 5 } },
        directional: { color: '#ffffff', intensity: 0.8, position: { x: -5, y: 10, z: 5 } }
    });

    // CubeManager avec useLighting: true
    const cubeManager = new CubeManager(ctx.scene, {
        useLighting: true,     // Utilise MeshStandardMaterial
        metalness: 0.3,
        roughness: 0.7
    });

    setupCubeControls(cubeManager);

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

## Configuration des lumières

Notre module `addLights()` simplifie la création:

```typescript
// shared/core/lights.ts
export function addLights(scene, config = {}) {
    // Ambient - toujours présent
    const ambient = new THREE.AmbientLight(color, intensity);
    scene.add(ambient);

    // Point - position dans l'espace
    const point = new THREE.PointLight(color, intensity, distance);
    point.position.set(x, y, z);
    scene.add(point);

    // Directional - comme le soleil
    const directional = new THREE.DirectionalLight(color, intensity);
    directional.position.set(x, y, z);
    scene.add(directional);
}
```

---

## Points clés à retenir

1. **AmbientLight** = éclairage global uniforme (pas d'ombre)
2. **PointLight** = ampoule (rayons depuis un point)
3. **DirectionalLight** = soleil (rayons parallèles)
4. **MeshBasicMaterial** = ignore la lumière
5. **MeshStandardMaterial** = réagit à la lumière (PBR)
6. **metalness/roughness** = contrôle l'apparence du matériau
