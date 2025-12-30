# Ressources GLB / glTF

## 📖 Qu'est-ce que GLB/glTF?

**glTF** (GL Transmission Format) est le format standard pour les modèles 3D sur le web, développé par le Khronos Group.

### Différence GLB vs glTF

| Format | Fichiers | Avantages | Inconvénients |
|--------|----------|-----------|---------------|
| **glTF** | `.gltf` + `.bin` + images | Lisible (JSON), modifiable | Plusieurs fichiers |
| **GLB** | `.glb` unique | Compact, portable | Binaire non lisible |

**💡 Recommandation:** Utiliser **GLB** pour le web (un seul fichier, plus rapide).

---

## 📚 Tutoriels écrits

### Officiels
- [Three.js GLTFLoader Documentation](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)
- [glTF 2.0 Specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)

### Guides complets
- [Discover three.js - Load 3D Models](https://discoverthreejs.com/book/first-steps/load-models/)
  - Excellent guide étape par étape
  - Explique la structure du format glTF

- [Medium - Blender to Three.js](https://medium.com/@matthewmain/how-to-import-a-3d-blender-object-into-a-three-js-project-as-a-gltf-file-5a67290f65f2)
  - Workflow complet Blender → Three.js
  - Options d'export détaillées

### Forum Three.js
- [How to export correctly from Blender](https://discourse.threejs.org/t/how-to-export-correctly-from-blender-to-three-js/67469)
- [GLTF Troubleshooting](https://discourse.threejs.org/t/dont-know-how-to-create-gltf-file-suitable-for-three-js-in-blender/13065)

---

## 🎬 Vidéos YouTube recommandées

### En français
- Rechercher: "Three.js Blender GLB français"
- Chaînes: Grafikart, FromScratch

### En anglais
- **Three.js Journey** (Bruno Simon) - Excellent pour apprendre
- **Fireship** - Tutoriels courts et efficaces
- **DesignCourse** - Projets pratiques

### Recherches YouTube suggérées
```
"Three.js GLTF loader tutorial"
"Blender export GLB Three.js"
"Three.js load 3D model"
"Blender to web 3D tutorial"
```

---

## 🛠️ Outils pratiques

### Visualiseurs en ligne
- [glTF Viewer (Don McCurdy)](https://gltf-viewer.donmccurdy.com/)
  - Glisser-déposer votre fichier GLB
  - Voir les animations
  - Débugger les problèmes

- [Babylon.js Sandbox](https://sandbox.babylonjs.com/)
  - Alternative à Three.js
  - Bon pour tester les fichiers

- [Model Viewer (Google)](https://modelviewer.dev/)
  - Composant web simple
  - Preview AR

### Optimisation
- [glTF Pipeline](https://github.com/CesiumGS/gltf-pipeline)
  - Optimiser et compresser les fichiers

- [Draco Compression](https://google.github.io/draco/)
  - Compression de géométrie
  - Réduit la taille jusqu'à 90%

### Validation
- [glTF Validator](https://github.khronos.org/glTF-Validator/)
  - Vérifier que le fichier est valide
  - Détecter les erreurs

---

## 🎨 Modèles 3D gratuits

### Sites recommandés
- [Sketchfab](https://sketchfab.com/features/free-3d-models) - Beaucoup de modèles gratuits
- [Poly Haven](https://polyhaven.com/) - Assets haute qualité CC0
- [Mixamo](https://www.mixamo.com/) - Personnages + animations
- [Quaternius](https://quaternius.com/) - Modèles low-poly gratuits
- [Kenney](https://kenney.nl/assets) - Assets pour jeux

### Format de téléchargement
Toujours choisir **glTF** ou **GLB** quand disponible!

---

## 📝 Checklist export Blender

```
Avant l'export:
☐ Appliquer les transformations (Ctrl+A > All Transforms)
☐ Vérifier les normals (face orientation)
☐ Optimiser le mesh (réduire les polygones si nécessaire)
☐ Vérifier les UV maps
☐ Réduire la taille des textures (max 2048x2048 pour le web)

Export (File > Export > glTF 2.0):
☐ Format: glTF Binary (.glb)
☐ Include: Selected Objects (ou tout)
☐ Transform: +Y Up
☐ Geometry: ☑ Apply Modifiers, ☑ UVs, ☑ Normals
☐ Animation: ☑ si vous avez des animations
☐ Compression: ☐ (optionnel, peut causer des problèmes)

Après l'export:
☐ Tester dans glTF Viewer
☐ Vérifier la taille du fichier
☐ Tester dans Three.js
```

---

## ⚠️ Problèmes courants

### Le modèle est noir
```typescript
// Ajouter de la lumière!
const ambientLight = new THREE.AmbientLight('#ffffff', 1);
scene.add(ambientLight);
```

### Le modèle est trop grand/petit
```typescript
// Utiliser fitModelToView()
const box = new THREE.Box3().setFromObject(model);
const size = box.getSize(new THREE.Vector3());
const scale = 3 / Math.max(size.x, size.y, size.z);
model.scale.multiplyScalar(scale);
```

### Les textures sont absentes
- Vérifier que les images sont intégrées (GLB) ou présentes (glTF)
- Dans Blender: Pack External Data avant l'export

### Les couleurs sont fausses
```typescript
// Définir l'espace colorimétrique
renderer.outputColorSpace = THREE.SRGBColorSpace;
```

### L'animation ne joue pas
```typescript
// Créer le mixer ET appeler update() dans la boucle
const mixer = new THREE.AnimationMixer(model);
const action = mixer.clipAction(animations[0]);
action.play();

// Dans animate():
mixer.update(clock.getDelta());
```
