# Lecon 09 - Systemes de Particules

## Objectif

Apprendre a creer des **effets visuels** avec des systemes de particules dans Three.js.

---

## Concept

Les particules dans Three.js utilisent `THREE.Points` au lieu de `THREE.Mesh`. Chaque particule est un point rendu comme un sprite.

```
Mesh     = geometrie + materiau → rendu comme surface
Points   = positions + PointsMaterial → rendu comme points/sprites
```

---

## Structure de base

```javascript
// 1. Geometrie avec positions
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3); // x, y, z pour chaque particule

// Remplir les positions
for (let i = 0; i < count; i++) {
    positions[i * 3] = Math.random() * 10 - 5;     // x
    positions[i * 3 + 1] = Math.random() * 10 - 5; // y
    positions[i * 3 + 2] = Math.random() * 10 - 5; // z
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// 2. Materiau
const material = new THREE.PointsMaterial({
    size: 0.1,
    color: 0x00d9ff
});

// 3. Points
const particles = new THREE.Points(geometry, material);
scene.add(particles);
```

---

## BufferGeometry et attributs

Les particules utilisent des `Float32Array` pour stocker les donnees :

| Attribut | Description | Composantes |
|----------|-------------|-------------|
| `position` | Position XYZ | 3 par particule |
| `color` | Couleur RGB | 3 par particule |
| `size` | Taille individuelle | 1 par particule |

```javascript
// Couleurs par particule (vertexColors)
const colors = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
    colors[i] = Math.random();
}
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Activer les couleurs par vertex
material.vertexColors = true;
```

---

## PointsMaterial - Options

```javascript
const material = new THREE.PointsMaterial({
    size: 0.1,              // Taille des particules
    sizeAttenuation: true,  // Taille diminue avec la distance
    color: 0xffffff,        // Couleur (si pas vertexColors)
    vertexColors: true,     // Utiliser les couleurs du geometry
    transparent: true,      // Activer la transparence
    opacity: 0.8,           // Opacite
    blending: THREE.AdditiveBlending, // Mode de melange
    depthWrite: false       // Evite les artefacts de tri
});
```

### Modes de blending

| Mode | Effet |
|------|-------|
| `NormalBlending` | Standard, opaque |
| `AdditiveBlending` | Lumineux, s'additionne (feu, lumiere) |
| `SubtractiveBlending` | Soustrait les couleurs |
| `MultiplyBlending` | Multiplie les couleurs |

---

## Animation des particules

Pour animer, modifier les positions et marquer `needsUpdate` :

```javascript
function animate() {
    const positions = geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Exemple : mouvement sinusoidal
        positions[i3 + 1] += Math.sin(time + i) * 0.01;
    }

    // IMPORTANT : signaler la mise a jour
    geometry.attributes.position.needsUpdate = true;
}
```

---

## Presets de cette lecon

### Galaxie spirale

```
     *  *
   *   *   *
  *  CENTER  *
   *   *   *
     *  *
```

- Particules reparties en branches
- Rotation continue
- Couleur degradee du centre vers l'exterieur

### Neige

- Particules blanches
- Chute avec leger drift horizontal
- Reset en haut quand elles atteignent le sol

### Feu

- Source au sol
- Mouvement vers le haut
- Couleur jaune → orange → rouge selon la hauteur
- Disparition en haut

### Fontaine

- Jet vers le haut
- Gravite pour la retombee
- Paraboles naturelles
- Reset au sol

### Explosion

- Depart du centre
- Direction spherique aleatoire
- Gravite legere
- Fade out progressif

---

## Physique simple

### Gravite

```javascript
const gravity = -9.8;
let velocity = initialVelocity;

function update(delta) {
    velocity += gravity * delta;
    position += velocity * delta;
}
```

### Mouvement parabolique

```javascript
// Position a l'instant t
x = x0 + vx * t;
y = y0 + vy * t + 0.5 * gravity * t * t;
z = z0 + vz * t;
```

---

## Optimisation

### Performance

| Nombre de particules | Performance |
|---------------------|-------------|
| 1,000 | Excellente |
| 10,000 | Bonne |
| 100,000 | Acceptable |
| 1,000,000+ | GPU Instancing recommande |

### Conseils

1. **depthWrite: false** - Evite les problemes de tri
2. **Additive blending** - Cache les artefacts de tri
3. **sizeAttenuation** - Particules plus petites au loin
4. **Limiter les updates** - Ne pas tout mettre a jour chaque frame

---

## Points cles

1. **Points vs Mesh** : Points pour les particules, Mesh pour les objets solides
2. **BufferGeometry** : Utiliser Float32Array pour les performances
3. **needsUpdate** : Obligatoire apres modification des attributs
4. **Blending** : AdditiveBlending pour les effets lumineux
5. **Physique** : Gravite + velocite pour un mouvement realiste

---

## Exercice

Dans cette lecon, vous pouvez :
- Choisir parmi 5 presets (galaxie, neige, feu, fontaine, explosion)
- Ajuster le nombre de particules
- Modifier la taille et la couleur
- Controler la vitesse d'animation
- Activer/desactiver la transparence
- Trigger une nouvelle explosion
