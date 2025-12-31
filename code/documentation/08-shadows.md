# Leçon 08 - Ombres (Shadows)

## Objectif

Apprendre à ajouter des **ombres réalistes** dans une scène Three.js.

---

## Concept des ombres dans Three.js

Les ombres ne sont **pas automatiques** dans Three.js. Il faut les activer explicitement à plusieurs niveaux :

```
1. Renderer     → shadowMap.enabled = true
2. Lumière      → castShadow = true
3. Objet        → castShadow = true (projette une ombre)
4. Sol/Surface  → receiveShadow = true (reçoit les ombres)
```

---

## Étape 1 : Activer les ombres sur le renderer

```javascript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Ombres douces
```

### Types de shadow map

| Type | Description | Performance |
|------|-------------|-------------|
| `BasicShadowMap` | Ombres pixelisées | Rapide |
| `PCFShadowMap` | Ombres lissées (défaut) | Moyen |
| `PCFSoftShadowMap` | Ombres très douces | Lent |
| `VSMShadowMap` | Variance Shadow Map | Variable |

---

## Étape 2 : Configurer la lumière

Seules certaines lumières peuvent projeter des ombres :

| Lumière | Supporte les ombres |
|---------|---------------------|
| `DirectionalLight` | ✅ Oui |
| `SpotLight` | ✅ Oui |
| `PointLight` | ✅ Oui (6 shadow maps) |
| `AmbientLight` | ❌ Non |
| `HemisphereLight` | ❌ Non |

```javascript
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
light.castShadow = true;

// Qualité de l'ombre
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;

// Zone couverte par l'ombre (DirectionalLight)
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 50;
light.shadow.camera.left = -10;
light.shadow.camera.right = 10;
light.shadow.camera.top = 10;
light.shadow.camera.bottom = -10;
```

---

## Étape 3 : Configurer les objets

```javascript
// Cube qui PROJETTE une ombre
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;

// Sol qui REÇOIT les ombres
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.receiveShadow = true;
```

---

## Shadow Camera Helper

Pour débugger la zone d'ombre :

```javascript
const helper = new THREE.CameraHelper(light.shadow.camera);
scene.add(helper);
```

Cela affiche la zone où les ombres sont calculées.

---

## Optimisation des ombres

### Taille de la shadow map

```javascript
// Basse qualité (rapide)
light.shadow.mapSize.set(512, 512);

// Haute qualité (lent)
light.shadow.mapSize.set(2048, 2048);
```

### Réduire la zone d'ombre

Plus la zone est petite, plus l'ombre est détaillée :

```javascript
light.shadow.camera.left = -5;
light.shadow.camera.right = 5;
// etc.
```

### Shadow bias

Évite les artefacts (lignes sur les surfaces) :

```javascript
light.shadow.bias = -0.0001;
```

---

## Exemple complet

```javascript
// 1. Renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 2. Lumière
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(1024, 1024);
scene.add(dirLight);

// 3. Cube (projette)
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x00d9ff })
);
cube.castShadow = true;
scene.add(cube);

// 4. Sol (reçoit)
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.5;
floor.receiveShadow = true;
scene.add(floor);
```

---

## Points clés

1. **3 niveaux** : Renderer + Lumière + Objets
2. **Seules certaines lumières** supportent les ombres
3. **Performance** : Les ombres sont coûteuses en GPU
4. **Shadow map size** : Compromis qualité/performance
5. **Helper** : Utilisez CameraHelper pour débugger

---

## Exercice

Dans cette leçon, vous pouvez :
- Activer/désactiver les ombres
- Changer le type de shadow map
- Ajuster la qualité (shadow map size)
- Voir le helper de la shadow camera
- Déplacer la lumière pour voir l'effet sur les ombres
