# Lecon 10 - Physique avec Cannon.js

## Objectif

Apprendre a ajouter de la **physique realiste** (gravite, collisions, rebonds) avec **Cannon.js**.

---

## Cannon.js vs Cannon-es

| Version | Description |
|---------|-------------|
| cannon.js | Version originale (abandonnee) |
| **cannon-es** | Fork moderne, ES modules, maintenu |

```javascript
import * as CANNON from 'cannon-es';
```

---

## Architecture

```
Three.js (rendu)          Cannon.js (physique)
     Mesh      <------>        Body
  geometry                     shape
  position    synchronise     position
  quaternion  <------>       quaternion
```

**Principe** : Cannon.js calcule la physique, Three.js affiche le resultat.

---

## Etape 1 : Creer le monde physique

```javascript
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Gravite terrestre
world.broadphase = new CANNON.NaiveBroadphase();
```

### Broadphase (detection de collisions)

| Type | Description | Performance |
|------|-------------|-------------|
| `NaiveBroadphase` | Teste toutes les paires | Simple, OK pour < 100 objets |
| `SAPBroadphase` | Sweep and Prune | Meilleur pour beaucoup d'objets |

---

## Etape 2 : Creer des corps (Bodies)

### Sol statique (masse = 0)

```javascript
const groundBody = new CANNON.Body({
    mass: 0 // 0 = statique, ne bouge pas
});
groundBody.addShape(new CANNON.Plane());
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);
```

### Objet dynamique

```javascript
// Cube
const boxBody = new CANNON.Body({
    mass: 1, // kg
    position: new CANNON.Vec3(0, 5, 0)
});
boxBody.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
world.addBody(boxBody);

// Sphere
const sphereBody = new CANNON.Body({ mass: 1 });
sphereBody.addShape(new CANNON.Sphere(0.5));
world.addBody(sphereBody);
```

---

## Etape 3 : Synchroniser Three.js et Cannon.js

```javascript
// Dans la boucle d'animation
function animate() {
    // 1. Step physique
    world.step(1/60, deltaTime, 3);

    // 2. Copier position/rotation de Cannon vers Three
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);

    renderer.render(scene, camera);
}
```

---

## Formes disponibles (Shapes)

| Shape | Description | Three.js equivalent |
|-------|-------------|---------------------|
| `Box` | Cube/boite | BoxGeometry |
| `Sphere` | Sphere | SphereGeometry |
| `Plane` | Plan infini | PlaneGeometry |
| `Cylinder` | Cylindre | CylinderGeometry |
| `ConvexPolyhedron` | Forme convexe | Custom geometry |
| `Trimesh` | Mesh triangule | Imported mesh |

---

## Materiaux et contacts

### Creer des materiaux physiques

```javascript
const defaultMaterial = new CANNON.Material('default');
const groundMaterial = new CANNON.Material('ground');

// Definir comment les materiaux interagissent
const contactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    groundMaterial,
    {
        friction: 0.3,      // 0 = glissant, 1 = rugueux
        restitution: 0.5    // 0 = pas de rebond, 1 = rebond elastique
    }
);
world.addContactMaterial(contactMaterial);
```

### Appliquer un materiau a un body

```javascript
const body = new CANNON.Body({
    mass: 1,
    material: defaultMaterial
});
```

---

## Proprietes physiques

### Masse

```javascript
body.mass = 5; // Plus lourd = plus d'inertie
```

| Masse | Comportement |
|-------|--------------|
| 0 | Statique (sol, murs) |
| < 1 | Leger (plume, balle) |
| 1-10 | Normal (balle, boite) |
| > 10 | Lourd (rocher, voiture) |

### Friction

```javascript
material.friction = 0.3;
```

| Valeur | Effet |
|--------|-------|
| 0 | Glace, savon |
| 0.3 | Caoutchouc normal |
| 1 | Tres rugueux |

### Restitution (rebond)

```javascript
material.restitution = 0.7;
```

| Valeur | Effet |
|--------|-------|
| 0 | Pas de rebond (pate a modeler) |
| 0.5 | Rebond normal |
| 1 | Rebond parfait (super ball) |

---

## Forces et impulsions

```javascript
// Appliquer une force continue
body.applyForce(
    new CANNON.Vec3(100, 0, 0), // Force en Newtons
    body.position // Point d'application
);

// Appliquer une impulsion instantanee
body.applyImpulse(
    new CANNON.Vec3(0, 10, 0), // Impulsion
    body.position
);

// Velocite directe
body.velocity.set(5, 10, 0);
body.angularVelocity.set(0, 5, 0); // Rotation
```

---

## Exemple complet

```javascript
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// Three.js
const scene = new THREE.Scene();
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x00d9ff })
);
scene.add(mesh);

// Cannon.js
const world = new CANNON.World();
world.gravity.set(0, -10, 0);

const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 5, 0)
});
body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
world.addBody(body);

// Animation
function animate() {
    world.step(1/60);
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
```

---

## Points cles

1. **Monde separe** : Cannon.js et Three.js sont independants
2. **Synchronisation** : Copier position/quaternion a chaque frame
3. **masse = 0** : Objet statique (sol, murs)
4. **Materiaux** : Definissent friction et rebond
5. **Step** : `world.step(1/60)` pour 60 FPS

---

## Performance

| Objets | Performance |
|--------|-------------|
| < 50 | Excellente |
| 50-200 | Bonne |
| 200-500 | Acceptable |
| > 500 | Utiliser un worker |

### Conseils

- Utiliser des formes simples (Box, Sphere) plutot que Trimesh
- Supprimer les objets hors zone
- Limiter le nombre d'objets dynamiques

---

## Exercice

Dans cette lecon, vous pouvez :
- Spawner des cubes, spheres, cylindres
- Ajuster masse, friction, rebond
- Changer la gravite
- Cliquer pour spawn a une position
- Faire une pluie d'objets
