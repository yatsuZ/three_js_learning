# WebGL - C'est quoi ?

## Définition

**WebGL** (Web Graphics Library) est une API JavaScript qui permet de dessiner des graphiques 2D et 3D dans le navigateur, **sans plugin**.

```
WebGL = OpenGL ES + JavaScript + Navigateur
```

- Créé en 2011 par le **Khronos Group**
- Basé sur **OpenGL ES** (version mobile d'OpenGL)
- Supporté par tous les navigateurs modernes (Chrome, Firefox, Safari, Edge)

---

## Comment ça marche ?

### Le GPU (carte graphique)

WebGL permet à JavaScript de parler directement au **GPU** (Graphics Processing Unit) de ton ordinateur.

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ JavaScript  │  →   │   WebGL     │  →   │    GPU      │
│  (ton code) │      │   (API)     │      │(carte graph)│
└─────────────┘      └─────────────┘      └─────────────┘
```

**Pourquoi le GPU ?**
- Le CPU traite les tâches une par une (séquentiel)
- Le GPU traite des milliers de tâches en parallèle
- Parfait pour calculer des millions de pixels !

### Le Canvas

WebGL dessine dans un élément `<canvas>` HTML:

```html
<canvas id="mon-canvas" width="800" height="600"></canvas>
```

```javascript
const canvas = document.getElementById('mon-canvas');
const gl = canvas.getContext('webgl');  // Contexte WebGL
```

---

## Les concepts de base

### 1. Vertices (Sommets)

Un objet 3D est composé de **points** dans l'espace (x, y, z).

```
Triangle = 3 vertices
Cube = 8 vertices
Sphère = beaucoup de vertices !
```

```javascript
// Un triangle (3 points)
const vertices = [
    0.0,  0.5, 0.0,   // Point haut
   -0.5, -0.5, 0.0,   // Point bas gauche
    0.5, -0.5, 0.0    // Point bas droit
];
```

### 2. Shaders

Les **shaders** sont des mini-programmes qui tournent sur le GPU.

| Shader | Rôle |
|--------|------|
| **Vertex Shader** | Positionne chaque sommet |
| **Fragment Shader** | Colorie chaque pixel |

```glsl
// Vertex Shader (GLSL)
attribute vec4 a_position;
void main() {
    gl_Position = a_position;
}

// Fragment Shader (GLSL)
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  // Rouge
}
```

**GLSL** = OpenGL Shading Language (langage des shaders)

### 3. Buffers

Les **buffers** stockent les données (vertices, couleurs...) dans la mémoire GPU.

```javascript
// Créer un buffer
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
```

### 4. Le Pipeline de rendu

```
Vertices → Vertex Shader → Rasterization → Fragment Shader → Pixels
   │              │              │                │            │
 Points     Positionnement   Conversion      Coloration    Écran
   3D         dans l'espace   en pixels      de chaque
                                              pixel
```

---

## Exemple : Un triangle en WebGL pur

Voici ce qu'il faut pour afficher UN SIMPLE TRIANGLE :

```javascript
// 1. Récupérer le contexte WebGL
const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl');

// 2. Définir les shaders (code GLSL en string)
const vertexShaderSource = `
    attribute vec4 a_position;
    void main() {
        gl_Position = a_position;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

// 3. Compiler les shaders
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// 4. Créer le programme (lier les shaders)
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// 5. Créer le buffer avec les vertices du triangle
const vertices = new Float32Array([
    0.0,  0.5,
   -0.5, -0.5,
    0.5, -0.5
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// 6. Lier le buffer à l'attribut du shader
const positionLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// 7. Dessiner !
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);
```

**~50 lignes pour UN triangle !** 😰

---

## Le même triangle avec Three.js

```javascript
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800/600, 0.1, 1000);
camera.position.z = 2;

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute([
    0.0,  0.5, 0.0,
   -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0
], 3));

const material = new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide });
const triangle = new THREE.Mesh(geometry, material);
scene.add(triangle);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 600);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);
```

**~15 lignes, plus lisible, plus maintenable !** 😊

---

## WebGL 1.0 vs WebGL 2.0

| Aspect | WebGL 1.0 | WebGL 2.0 |
|--------|-----------|-----------|
| Basé sur | OpenGL ES 2.0 | OpenGL ES 3.0 |
| Année | 2011 | 2017 |
| Support | 97%+ navigateurs | 95%+ navigateurs |
| Fonctionnalités | Basiques | + Instancing, + Textures 3D, etc. |

Three.js gère automatiquement les deux versions.

---

## Pourquoi ne pas utiliser WebGL directement ?

| WebGL pur | Three.js |
|-----------|----------|
| Verbeux (~50 lignes = triangle) | Concis (~5 lignes = cube) |
| Gestion manuelle de tout | Abstractions pratiques |
| Shaders obligatoires | Matériaux pré-faits |
| Mathématiques matrices 4x4 | `object.position.x = 5` |
| Debug difficile | Outils intégrés |

**Conclusion:** WebGL = moteur bas niveau. Three.js = interface haut niveau.

---

## Quand utiliser WebGL directement ?

- **Optimisation extrême** (jeux AAA, simulations)
- **Effets visuels custom** (shaders personnalisés)
- **Apprentissage** (comprendre comment ça marche)

Même dans ces cas, on utilise souvent Three.js + shaders custom.

---

## Ressources

- [WebGL Fundamentals](https://webglfundamentals.org/) - Tutoriel complet WebGL
- [The Book of Shaders](https://thebookofshaders.com/) - Apprendre les shaders
- [Shadertoy](https://www.shadertoy.com/) - Shaders en ligne (inspiration)
- [MDN WebGL](https://developer.mozilla.org/fr/docs/Web/API/WebGL_API) - Documentation Mozilla

---

## Résumé

| Question | Réponse |
|----------|---------|
| **C'est quoi ?** | API pour dessiner en 3D dans le navigateur |
| **Comment ?** | JavaScript → WebGL → GPU → Pixels |
| **Composants** | Vertices, Shaders, Buffers |
| **Difficulté** | Élevée (bas niveau) |
| **Alternative** | Three.js (simplifie WebGL) |

**WebGL = le moteur sous le capot de Three.js** 🚗
