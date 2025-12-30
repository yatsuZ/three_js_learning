# Technologies utilisees

Ce document explique les technologies utilisees dans ce projet et clarifie les termes souvent confondus.

---

## Package vs Library vs Framework

Ces termes sont souvent melanges. Voici la difference :

### Package (Paquet)

Un **package** est simplement un **conteneur** de code distribue via un gestionnaire de paquets.

```
Package = Code + Metadata (package.json)
```

- Distribue via **npm**, **pip**, **cargo**, etc.
- Peut contenir une library, un framework, ou juste des outils
- Le fichier `package.json` decrit le package

**Exemple :** Quand tu fais `npm install three`, tu telecharges le **package** "three" qui contient la **library** Three.js.

---

### Library (Bibliotheque)

Une **library** est un ensemble de **fonctions/classes reutilisables** que TU appelles.

```
TON CODE  →  appelle  →  LIBRARY
```

- **Tu gardes le controle** du flux d'execution
- Tu decides quand et comment utiliser la library
- La library ne dicte pas la structure de ton code

**Exemples :**
| Library | Utilisation |
|---------|-------------|
| **Three.js** | Tu appelles `new THREE.Scene()` quand tu veux |
| **Marked.js** | Tu appelles `marked.parse(markdown)` quand tu veux |
| **Lodash** | Tu appelles `_.map(array, fn)` quand tu veux |

---

### Framework

Un **framework** est une **structure complete** qui appelle TON code.

```
FRAMEWORK  →  appelle  →  TON CODE
```

- **Le framework a le controle** (Inversion of Control)
- Tu ecris du code dans les "trous" prevus par le framework
- Le framework dicte la structure de ton projet

**Exemples :**
| Framework | Structure imposee |
|-----------|-------------------|
| **React** | Composants, hooks, lifecycle |
| **Angular** | Modules, services, decorators |
| **Fastify** | Routes, plugins, middleware |
| **Django** | Models, views, templates |

---

### Resume visuel

```
┌─────────────────────────────────────────────────────┐
│                     PACKAGE                         │
│  (conteneur distribue via npm/pip/etc.)            │
│                                                     │
│   ┌─────────────────┐  ┌─────────────────┐         │
│   │    LIBRARY      │  │   FRAMEWORK     │         │
│   │                 │  │                 │         │
│   │  Tu l'appelles  │  │  Il t'appelle   │         │
│   │  Tu as controle │  │  Il a controle  │         │
│   │                 │  │                 │         │
│   │  Ex: Three.js   │  │  Ex: React      │         │
│   │      Marked.js  │  │      Fastify    │         │
│   │      Lodash     │  │      Angular    │         │
│   └─────────────────┘  └─────────────────┘         │
└─────────────────────────────────────────────────────┘
```

---

## Technologies de ce projet

### Frontend

| Technologie | Type | Description |
|-------------|------|-------------|
| **Three.js** | Library | Rendu 3D WebGL simplifie |
| **Marked.js** | Library | Convertit Markdown → HTML |
| **TypeScript** | Langage | JavaScript avec types |

### Backend

| Technologie | Type | Description |
|-------------|------|-------------|
| **Fastify** | Framework | Serveur web Node.js rapide |
| **EJS** | Library | Templates HTML dynamiques |
| **Node.js** | Runtime | Execute JavaScript cote serveur |

### Outils

| Technologie | Type | Description |
|-------------|------|-------------|
| **Docker** | Outil | Conteneurisation |
| **npm** | Gestionnaire | Gestion des packages Node.js |
| **TypeScript Compiler** | Outil | Compile TS → JS |

---

## Focus : Marked.js

### C'est quoi ?

**Marked.js** est une **library** JavaScript qui convertit du texte **Markdown** en **HTML**.

```
# Titre        →  <h1>Titre</h1>
**gras**       →  <strong>gras</strong>
- liste        →  <ul><li>liste</li></ul>
```

### Pourquoi on l'utilise ?

1. **Ecrire en Markdown** est plus simple qu'en HTML
2. **Conversion cote client** = pas besoin de compilation serveur
3. **Leger** (~20KB) et rapide

### Comment ca marche dans ce projet ?

```
1. Tu ecris un fichier .md (ex: 01-cube.md)
2. Le serveur renvoie le contenu brut du fichier
3. Le navigateur charge Marked.js depuis un CDN
4. Marked.js convertit le Markdown en HTML
5. Le HTML est affiche dans la page
```

```javascript
// Dans docs/index.ts
const html = marked.parse(markdownContent);
document.getElementById('content').innerHTML = html;
```

### Alternatives a Marked.js

| Library | Taille | Vitesse | Fonctionnalites |
|---------|--------|---------|-----------------|
| **Marked.js** | 20KB | Tres rapide | Standard |
| **markdown-it** | 30KB | Rapide | Extensible |
| **showdown** | 40KB | Moyen | Compatible GitHub |
| **remark** | 100KB+ | Moyen | Ecosysteme complet |

On utilise **Marked.js** car c'est le plus leger et rapide pour notre usage simple.

---

## Focus : Three.js

### C'est quoi ?

**Three.js** est une **library** JavaScript pour la **3D dans le navigateur**.

Elle simplifie **WebGL** (l'API native tres complexe).

### Library ou Framework ?

**Three.js est une LIBRARY** car :
- Tu crees ta propre boucle d'animation
- Tu decides de la structure de ton code
- Tu appelles les fonctions quand tu veux

```javascript
// TON code appelle Three.js
const scene = new THREE.Scene();      // Tu decides quand
const cube = new THREE.Mesh(...);     // Tu decides comment
scene.add(cube);                       // Tu gardes le controle
```

### Pourquoi pas un framework 3D ?

Des frameworks 3D existent (A-Frame, Babylon.js) mais Three.js offre :
- Plus de **flexibilite**
- Plus de **controle**
- Meilleur pour **apprendre** WebGL

---

## Focus : Fastify

### C'est quoi ?

**Fastify** est un **framework** Node.js pour creer des serveurs web.

### Framework ou Library ?

**Fastify est un FRAMEWORK** car :
- Il dicte comment tu structures tes routes
- Il appelle tes handlers quand une requete arrive
- Il impose un cycle de vie (plugins, hooks)

```javascript
// FASTIFY appelle ton code
fastify.get('/api/data', async (request, reply) => {
    // Ton code est appele PAR Fastify quand quelqu'un visite /api/data
    return { data: 'hello' };
});
```

---

## Resume

| Terme | Definition | Qui controle ? |
|-------|------------|----------------|
| **Package** | Conteneur de code (npm) | - |
| **Library** | Fonctions que tu appelles | Toi |
| **Framework** | Structure qui t'appelle | Le framework |

Dans ce projet :
- **Three.js** = Library (tu appelles)
- **Marked.js** = Library (tu appelles)
- **Fastify** = Framework (il t'appelle)
- Tous sont distribues comme **packages** npm
