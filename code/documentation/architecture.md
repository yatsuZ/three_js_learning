# Architecture du Projet

Ce document décrit l'organisation du code et les patterns utilisés dans ce projet d'apprentissage Three.js.

## Structure des dossiers

```
code/
├── documentation/          # Fichiers Markdown (cette doc)
├── srcs/
│   ├── backend/           # Serveur Fastify
│   │   ├── main.ts        # Point d'entrée
│   │   ├── config/        # Configuration Fastify
│   │   ├── routes/        # Routes API et pages
│   │   └── utils/         # Utilitaires (logger)
│   └── static/            # Frontend
│       ├── css/           # Styles
│       ├── views/         # Templates EJS
│       │   ├── partials/  # Composants réutilisables
│       │   └── lessons/   # Pages des leçons
│       ├── other/         # Assets (modèles 3D)
│       └── js/
│           ├── shared/    # Modules partagés
│           ├── lessons/   # Code des leçons
│           └── docs/      # Viewer documentation
└── dist/                  # Code compilé
```

## Modules partagés (`shared/`)

### Core (`shared/core/`)

| Module | Description |
|--------|-------------|
| `scene.ts` | Création de scène, caméra, renderer |
| `cube.ts` | Classe Cube avec mesh et rotation |
| `cubeManager.ts` | Gestion d'une collection de cubes |
| `lights.ts` | Création de lumières (ambient, point, directional) |
| `controls.ts` | OrbitControls et bounding box |
| `textures.ts` | Textures procédurales et chargement |
| `modelLoader.ts` | Chargement de modèles GLB/GLTF |
| `lesson.ts` | Classe de base abstraite pour les leçons |

### Utils (`shared/utils/`)

| Module | Description |
|--------|-------------|
| `logger.ts` | Logger unifié avec niveaux (debug, info, warn, error) |
| `fetch.ts` | Fetch avec timeout et retry automatique |

### Config (`shared/config/`)

| Module | Description |
|--------|-------------|
| `loader.ts` | Chargement de la configuration depuis l'API |

### UI (`shared/ui/`)

| Module | Description |
|--------|-------------|
| `cubeControls.ts` | Interface de création de cubes |

## Pattern LessonBase

Toutes les leçons héritent de `LessonBase` qui fournit :

### Lifecycle

```
constructor() → setup() → update(delta) → cleanup()
     ↓            ↓           ↓              ↓
  Crée scene   Config     Chaque frame   À l'arrêt
```

### Méthodes disponibles

```typescript
class MaLecon extends LessonBase {
  // Obligatoires
  protected setup(): Promise<void> | void;
  protected update(delta: number): void;

  // Optionnel
  protected cleanup(): void;

  // Helpers fournis
  this.addEventListener(element, 'click', handler);  // Auto-cleanup
  this.onDispose(() => { /* cleanup */ });           // Enregistre cleanup

  // Accesseurs
  this.scene      // THREE.Scene
  this.camera     // THREE.PerspectiveCamera
  this.renderer   // THREE.WebGLRenderer
  this.canvas     // HTMLCanvasElement
}
```

### Exemple minimal

```typescript
import { LessonBase } from '../../shared/index.ts';
import type { LessonConfig } from '../../shared/index.ts';

class Lesson07 extends LessonBase {
  constructor() {
    const config: LessonConfig = { id: '07', name: 'Ma Leçon' };
    super(config);
  }

  protected setup(): void {
    // Ajouter objets à this.scene
  }

  protected update(delta: number): void {
    // Animation (appelé chaque frame)
  }
}

new Lesson07().start();
```

## Organisation d'une leçon complexe

Pour les leçons avec beaucoup de code (comme la leçon 06), on découpe en modules :

```
lessons/06-blender/
├── index.ts    # Classe principale (orchestration)
├── ui.ts       # Types UI, getElements, reset
└── model.ts    # Logique métier (ModelController)
```

### Principes

1. **index.ts** : Uniquement l'orchestration
   - Setup des composants
   - Event listeners
   - Délégation aux controllers

2. **ui.ts** : Gestion de l'interface
   - Interface `UIElements` typée
   - Constantes `DEFAULT_VALUES`
   - Fonctions `getUIElements()`, `resetUIValues()`

3. **model.ts** (ou autre) : Logique métier
   - Classe controller encapsulée
   - Méthodes pures sans dépendance au DOM

## Conventions de code

### Imports

```typescript
// Three.js
import * as THREE from 'three';
import type { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Modules partagés
import { LessonBase, addLights, Logger } from '../../shared/index.ts';
import type { LessonConfig } from '../../shared/index.ts';

// Modules locaux
import { getUIElements } from './ui.ts';
```

### Nommage

| Type | Convention | Exemple |
|------|------------|---------|
| Classes | PascalCase | `LessonBase`, `CubeManager` |
| Fonctions | camelCase | `createScene`, `loadConfig` |
| Constantes | SCREAMING_SNAKE | `DEFAULT_MODEL_URL` |
| Fichiers | kebab-case | `cube-manager.ts` |
| Interfaces | PascalCase | `SceneContext`, `UIElements` |

### Types

- Toujours typer les paramètres de fonctions
- Utiliser `interface` pour les objets
- Exporter les types avec `export type`

## API Backend

### Routes principales

| Route | Description |
|-------|-------------|
| `GET /` | Hub d'accueil |
| `GET /lesson/:id` | Page d'une leçon |
| `GET /docs` | Viewer documentation |
| `GET /api/docs` | Liste des documentations (JSON) |
| `GET /api/docs/:filename` | Contenu d'un fichier (JSON) |
| `GET /api/config` | Configuration (maxCubes) |

### Fichiers statiques

| Préfixe | Dossier source |
|---------|----------------|
| `/static/css/` | `srcs/static/css/` |
| `/static/js/` | `dist/static/js/` (compilé) |
| `/static/assets/` | `srcs/static/other/` |

## Ajouter une nouvelle leçon

### 1. Créer les fichiers

```bash
mkdir -p srcs/static/js/lessons/07-nom
touch srcs/static/js/lessons/07-nom/index.ts
touch srcs/static/views/lessons/07-nom.ejs
touch documentation/07-nom.md
```

### 2. Template EJS

```ejs
<%- include('../partials/head', { title: '07 - Nom' }) %>
<body>
  <div class="lesson-container">
    <%- include('../partials/lesson-header', {
      lessonNumber: '07',
      lessonTitle: 'Nom de la leçon',
      docSlug: '07-nom'
    }) %>
    <canvas id="canvas"></canvas>
    <!-- Contrôles spécifiques -->
  </div>

  <%- include('../partials/importmap') %>
  <script type="module" src="/static/js/lessons/07-nom/index.js"></script>
</body>
</html>
```

### 3. Code TypeScript

```typescript
import { LessonBase, addLights } from '../../shared/index.ts';
import type { LessonConfig } from '../../shared/index.ts';

class Lesson07 extends LessonBase {
  constructor() {
    super({ id: '07', name: 'Nom' });
  }

  protected setup(): void {
    addLights(this.scene, { /* config */ });
    // Setup...
  }

  protected update(delta: number): void {
    // Animation...
  }
}

new Lesson07().start();
```

### 4. Activer dans le hub

Dans `views/index.ejs`, changer `disabled` en lien actif pour la carte de la leçon.

## Commandes

```bash
make dev      # Build + lancer
make redev    # Rebuild complet
make stop     # Arrêter
```
