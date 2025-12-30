# Three.js Learning - Documentation

---

## 🎯 Introduction

| Document | Description |
|----------|-------------|
| [Motivation](./motivation.md) | Pourquoi ce projet existe |
| [Three.js](./threejs.md) | Presentation du framework |
| [WebGL](./webgl.md) | L'API graphique derriere Three.js |
| [CDN](./cdn.md) | Comment on charge les bibliotheques |

---

## 📚 Lecons

| # | Lecon | Concepts cles |
|---|-------|---------------|
| 01 | [Cube 3D](./01-cube.md) | Scene, Camera, Renderer, Mesh, Animation Loop |
| 02 | [Creer des Cubes](./02-create-cubes.md) | Creation dynamique, Memory management, Pattern Manager |
| 03 | [Lumieres](./03-lights.md) | AmbientLight, PointLight, DirectionalLight, MeshStandardMaterial |
| 04 | [Controls](./04-controls.md) | OrbitControls, Damping, Bounding Box |
| 05 | [Textures](./05-textures.md) | TextureLoader, CanvasTexture, Textures procedurales |
| 06 | [Blender Import](./06-blender-import.md) | GLTFLoader, GLB, Animations, Parametres dynamiques |

---

## 📎 Ressources

| Document | Description |
|----------|-------------|
| [Ressources GLB/glTF](./resources-glb-gltf.md) | Tutoriels et outils pour les modeles 3D |

---

## 🌐 Acceder a la documentation

La documentation est accessible de deux facons :

1. **Via le web** : Chaque lecon a un bouton "Doc" qui ouvre la documentation
2. **Via les fichiers** : Les fichiers `.md` sont dans `code/documentation/`

---

## 🗺️ Progression recommandee

```
Introduction
├── Motivation → Pourquoi ce projet
├── Three.js  → C'est quoi Three.js
├── WebGL     → C'est quoi WebGL
└── CDN       → Comment on charge les libs

Lecons
├── 01-Cube     → Les bases (Scene, Camera, Mesh)
├── 02-Create   → Creation dynamique
├── 03-Lights   → Eclairage + materiaux PBR
├── 04-Controls → Navigation camera
├── 05-Textures → Appliquer des images
└── 06-Blender  → Importer des modeles 3D
```

---

## 🏗️ Architecture du projet

```
three_js_learning/
├── code/
│   ├── documentation/        ← Tu es ici
│   ├── srcs/
│   │   ├── backend/          ← Serveur Fastify
│   │   │   ├── config/       ← Configuration Fastify
│   │   │   ├── routes/       ← Routes API et pages
│   │   │   └── utils/        ← Utilitaires
│   │   └── static/
│   │       ├── css/          ← Styles
│   │       ├── views/        ← Pages EJS
│   │       ├── other/        ← Assets (modeles 3D)
│   │       └── js/
│   │           ├── shared/   ← Code partage (modules reutilisables)
│   │           └── lessons/  ← Code des lecons
│   └── package.json
├── docker-compose.yml
└── Makefile
```

### Modules partages (`shared/`)

| Module | Description |
|--------|-------------|
| `core/scene.ts` | Creation de scene, camera, renderer |
| `core/cube.ts` | Classe Cube avec materiaux |
| `core/cubeManager.ts` | Gestion de plusieurs cubes |
| `core/lights.ts` | Lumieres (ambient, point, directional) |
| `core/controls.ts` | OrbitControls et bounding box |
| `core/textures.ts` | Chargement et creation de textures |
| `core/modelLoader.ts` | Chargement de modeles GLB/glTF |
| `config/loader.ts` | Configuration des lecons |
| `ui/cubeControls.ts` | Interface utilisateur |

---

## 🔗 Liens externes

### Documentation officielle
- [Three.js Docs](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [MDN WebGL](https://developer.mozilla.org/fr/docs/Web/API/WebGL_API)

### Tutoriels
- [Discover three.js](https://discoverthreejs.com/) - Gratuit, complet
- [Three.js Journey](https://threejs-journey.com/) - Payant, excellent

### Outils
- [Blender](https://www.blender.org/) - Modelisation 3D gratuite
- [glTF Viewer](https://gltf-viewer.donmccurdy.com/) - Visualiser des fichiers GLB

---

## 🔧 Commandes

```bash
make dev      # Lancer le projet
make redev    # Rebuild complet
make logs     # Voir les logs
make stop     # Arreter
```

---

## 🎮 Fonctionnalites de la lecon 06

La lecon 06 (Blender Import) propose de nombreux parametres :

| Categorie | Parametre | Description |
|-----------|-----------|-------------|
| **Rotation** | Auto-rotation | Active/desactive la rotation automatique |
| | Vitesse rotation | Multiplicateur de vitesse (0-5) |
| **Lumieres** | Ambiante | Eclaire uniformement (0-3) |
| | Point | Lumiere ponctuelle (0-5) |
| | Directionnelle | Simule le soleil (0-5) |
| **Affichage** | Grille | Montre/cache la grille au sol |
| | Wireframe | Mode fil de fer |
| | Forcer reaction lumiere | Force les materiaux a reagir |
| | Fond | Couleur de fond |
| **Animation** | Vitesse animation | Pour les modeles animes (0-3) |
| | Echelle modele | Taille du modele (0.5-5) |
