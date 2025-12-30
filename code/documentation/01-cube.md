# Leçon 01 - Cube 3D

## Objectif
Afficher des cubes 3D qui tournent et comprendre les bases de Three.js.

---

## Concepts Three.js

### 1. Scene
La **Scene** est le conteneur principal qui contient tous les objets 3D.

```typescript
const scene = new THREE.Scene();
scene.background = new THREE.Color('#1a1a2e');
```

### 2. Camera
La **PerspectiveCamera** simule la vision humaine avec une perspective réaliste.

```typescript
const camera = new THREE.PerspectiveCamera(
    75,     // FOV (Field of View) - angle de vue en degrés
    width / height,  // Aspect ratio
    0.1,    // Near plane - distance minimum de rendu
    1000    // Far plane - distance maximum de rendu
);
camera.position.z = 8;  // Reculer la caméra
```

**Paramètres FOV:**
- 75° = vue standard
- < 50° = effet zoom/téléobjectif
- > 90° = effet grand angle (déformation)

### 3. Renderer
Le **WebGLRenderer** dessine la scène dans un canvas HTML.

```typescript
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas'),
    antialias: true  // Lisse les bords (anti-aliasing)
});
renderer.setSize(width, height);
```

### 4. Geometry
La **BoxGeometry** définit la forme d'un cube.

```typescript
const geometry = new THREE.BoxGeometry(1, 1, 1);  // largeur, hauteur, profondeur
```

**Autres géométries courantes:**
- `SphereGeometry` - Sphère
- `PlaneGeometry` - Plan 2D
- `CylinderGeometry` - Cylindre
- `TorusGeometry` - Donut

### 5. Material
Le **Material** définit l'apparence de la surface.

```typescript
// MeshBasicMaterial - Ne réagit PAS à la lumière
const material = new THREE.MeshBasicMaterial({
    color: '#00d9ff',
    wireframe: true  // Affiche uniquement les arêtes
});

// Avec transparence
const transparentMaterial = new THREE.MeshBasicMaterial({
    color: '#4ecdc4',
    transparent: true,
    opacity: 0.5
});
```

### 6. Mesh
Le **Mesh** combine une géométrie et un matériau pour créer un objet 3D.

```typescript
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);  // Ajouter à la scène
```

### 7. Animation Loop
La boucle d'animation utilise `requestAnimationFrame` pour un rendu fluide à 60 FPS.

```typescript
function animate() {
    requestAnimationFrame(animate);  // Appel récursif

    // Mettre à jour les rotations
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;

    renderer.render(scene, camera);  // Dessiner
}
animate();
```

---

## Code de la leçon

```typescript
import { createScene, setupResize, CubeManager, addLights } from '../../shared/index.ts';

// Configuration des 3 cubes
const CUBES_CONFIG = [
    { color: '#00d9ff', wireframe: true, position: { x: 0, y: 0, z: 0 } },
    { color: '#ff6b6b', wireframe: false, position: { x: -2.5, y: 0, z: 0 } },
    { color: '#4ecdc4', transparent: true, opacity: 0.5, position: { x: 2.5, y: 0, z: 0 } }
];

// Créer la scène
const ctx = createScene({ backgroundColor: '#1a1a2e' });
setupResize(ctx);

// Créer les cubes
const cubeManager = new CubeManager(ctx.scene);
CUBES_CONFIG.forEach(config => {
    cubeManager.createSingleCube({ ...config, size: 0.8 });
});

// Boucle d'animation
function animate() {
    requestAnimationFrame(animate);
    cubeManager.updateAll();
    ctx.renderer.render(ctx.scene, ctx.camera);
}
animate();
```

---

## Fonctionnalité bonus: Toggle lumières

Cette leçon inclut un toggle pour activer/désactiver les lumières:

- **Sans lumières**: `MeshBasicMaterial` - Couleur plate
- **Avec lumières**: `MeshStandardMaterial` - Réagit à l'éclairage

Quand on change de mode, les cubes sont recréés avec le bon type de matériau tout en préservant leur rotation actuelle.

---

## Points clés à retenir

1. **Scene + Camera + Renderer** = Base de tout projet Three.js
2. **Geometry + Material = Mesh** = Objet 3D visible
3. **requestAnimationFrame** = Animation fluide 60 FPS
4. **MeshBasicMaterial** = Pas d'éclairage, couleur fixe
5. La **rotation** s'exprime en radians (0.01 rad ≈ 0.57°)
