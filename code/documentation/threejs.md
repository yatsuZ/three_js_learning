# Three.js - Présentation

## C'est quoi Three.js ?

**Three.js** est une bibliothèque JavaScript qui permet de créer des graphiques 3D dans le navigateur web.

```
Three.js = 3D + JavaScript + Web
```

Créée en 2010 par **Ricardo Cabello** (aka Mr.doob), elle est aujourd'hui la bibliothèque 3D la plus populaire pour le web.

🔗 **Site officiel:** [threejs.org](https://threejs.org/)
🔗 **GitHub:** [github.com/mrdoob/three.js](https://github.com/mrdoob/three.js)

---

## Pourquoi Three.js ?

### Le problème : WebGL est complexe

**WebGL** est l'API native des navigateurs pour la 3D. Mais elle est très bas niveau :

```javascript
// WebGL : Afficher un simple triangle = ~100 lignes
const vertexShaderSource = `
    attribute vec4 a_position;
    void main() {
        gl_Position = a_position;
    }
`;
// + shaders, buffers, matrices, compilation...
// 😵 Très complexe !
```

### La solution : Three.js simplifie tout

```javascript
// Three.js : Afficher un cube = ~10 lignes
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 'red' });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
// 😊 Simple et lisible !
```

---

## Les concepts fondamentaux

### 1. Scene (Scène)
Le conteneur qui contient tous les objets 3D.

```javascript
const scene = new THREE.Scene();
scene.add(objet);  // Ajouter un objet
```

### 2. Camera (Caméra)
Le point de vue du spectateur.

```javascript
const camera = new THREE.PerspectiveCamera(
    75,           // Champ de vision (FOV)
    width/height, // Ratio d'aspect
    0.1,          // Plan proche
    1000          // Plan lointain
);
```

### 3. Renderer (Moteur de rendu)
Dessine la scène dans un élément canvas HTML.

```javascript
const renderer = new THREE.WebGLRenderer();
renderer.render(scene, camera);  // Dessiner !
```

### 4. Mesh (Objet 3D)
Un objet 3D = **Geometry** (forme) + **Material** (apparence)

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);  // Forme cube
const material = new THREE.MeshBasicMaterial({ color: 'blue' });  // Apparence
const mesh = new THREE.Mesh(geometry, material);  // Objet final
```

---

## Le schéma mental

```
┌─────────────────────────────────────────────────┐
│                    SCENE                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │  Mesh   │  │  Mesh   │  │  Light  │         │
│  │(Geo+Mat)│  │(Geo+Mat)│  │         │         │
│  └─────────┘  └─────────┘  └─────────┘         │
└─────────────────────────────────────────────────┘
                      │
                      ▼
              ┌──────────────┐
              │    CAMERA    │ ← Point de vue
              └──────────────┘
                      │
                      ▼
              ┌──────────────┐
              │   RENDERER   │ → Canvas HTML
              └──────────────┘
```

---

## Ce qu'on peut faire avec Three.js

### Géométries
- Cubes, sphères, cylindres, plans...
- Formes personnalisées
- Modèles 3D importés (Blender, etc.)

### Matériaux
- Couleurs simples
- Textures (images)
- Matériaux PBR (réalistes)
- Shaders personnalisés

### Lumières
- Ambiante, ponctuelle, directionnelle
- Spots, hemisphère
- Ombres

### Animations
- Rotation, translation, scale
- Animations de modèles
- Physique

### Interactivité
- Contrôles caméra (orbite, FPS...)
- Raycasting (clic sur objets)
- VR/AR

---

## Exemples de projets Three.js

- **Jeux vidéo** dans le navigateur
- **Visualisation de données** en 3D
- **Configurateurs produits** (voitures, meubles...)
- **Sites web immersifs**
- **Art génératif**
- **Simulations scientifiques**

### Sites showcase
- [threejs.org/examples](https://threejs.org/examples/) - Exemples officiels
- [awwwards.com](https://www.awwwards.com/) - Sites primés (beaucoup utilisent Three.js)

---

## Installation

### Via CDN (simple)
```html
<script type="importmap">
{
    "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js"
    }
}
</script>
<script type="module">
    import * as THREE from 'three';
    // Ton code ici
</script>
```

### Via npm (projet)
```bash
npm install three
```

```javascript
import * as THREE from 'three';
```

---

## Ressources pour apprendre

### Documentation
- [Three.js Docs](https://threejs.org/docs/) - Référence officielle
- [Three.js Examples](https://threejs.org/examples/) - Exemples avec code source

### Tutoriels
- [Discover three.js](https://discoverthreejs.com/) - Gratuit, très complet
- [Three.js Journey](https://threejs-journey.com/) - Payant, excellente qualité

### Communauté
- [Three.js Discourse](https://discourse.threejs.org/) - Forum officiel
- [Stack Overflow](https://stackoverflow.com/questions/tagged/three.js) - Q&A
- [Reddit r/threejs](https://reddit.com/r/threejs) - Communauté

---

## Résumé

| Aspect | Description |
|--------|-------------|
| **Quoi** | Bibliothèque JavaScript pour la 3D web |
| **Pourquoi** | Simplifier WebGL |
| **Qui** | Mr.doob + communauté open source |
| **Quand** | Depuis 2010, toujours actif |
| **Comment** | Scene + Camera + Renderer + Mesh |

**Three.js rend la 3D accessible à tous les développeurs web !** 🎮
