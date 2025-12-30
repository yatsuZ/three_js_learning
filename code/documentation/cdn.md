# CDN - C'est quoi ?

## Définition simple

**CDN** = Content Delivery Network = Réseau de distribution de contenu

C'est un réseau de serveurs répartis dans le monde entier qui stockent des copies de fichiers (images, vidéos, bibliothèques JavaScript...) pour les livrer plus rapidement aux utilisateurs.

---

## Le problème sans CDN

Imagine que ton serveur est à Paris :

```
Utilisateur à Paris     → Serveur Paris  → 20ms  ✅ Rapide
Utilisateur à New York  → Serveur Paris  → 150ms 😐 Lent
Utilisateur à Tokyo     → Serveur Paris  → 250ms 😰 Très lent
```

**Plus tu es loin du serveur, plus c'est lent.**

---

## La solution avec CDN

Le CDN a des serveurs partout dans le monde :

```
                    ┌─────────────────┐
                    │  Serveur Origin │
                    │    (Paris)      │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
   ┌──────────┐       ┌──────────┐       ┌──────────┐
   │   CDN    │       │   CDN    │       │   CDN    │
   │  Paris   │       │ New York │       │  Tokyo   │
   └──────────┘       └──────────┘       └──────────┘
         │                   │                   │
         ▼                   ▼                   ▼
   Utilisateur         Utilisateur         Utilisateur
     Paris              New York             Tokyo
     20ms                 30ms                30ms
```

**Chaque utilisateur télécharge depuis le serveur le plus proche !**

---

## Comment ça marche ?

### 1. Tu mets ton fichier sur le CDN
```
three.js (bibliothèque) → Uploadé sur le CDN
```

### 2. Le CDN réplique sur tous ses serveurs
```
three.js copié sur :
- Paris
- New York
- Tokyo
- Sydney
- São Paulo
- ... (des centaines de serveurs)
```

### 3. L'utilisateur demande le fichier
```
Utilisateur Tokyo : "Je veux three.js"
CDN : "OK, voici depuis le serveur Tokyo" (30ms)
```

---

## Utiliser un CDN en pratique

### Exemple avec Three.js

**Sans CDN** (hébergé sur ton serveur) :
```html
<script src="/js/three.min.js"></script>
<!-- Le fichier vient de TON serveur -->
```

**Avec CDN** (hébergé sur jsDelivr) :
```html
<script src="https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js"></script>
<!-- Le fichier vient du serveur CDN le plus proche -->
```

### CDN populaires pour JavaScript

| CDN | URL | Spécialité |
|-----|-----|------------|
| **jsDelivr** | jsdelivr.net | Packages npm |
| **unpkg** | unpkg.com | Packages npm |
| **cdnjs** | cdnjs.cloudflare.com | Bibliothèques populaires |
| **Google CDN** | ajax.googleapis.com | jQuery, fonts |

---

## Import Maps et CDN

Dans ce projet, on utilise les **Import Maps** avec un CDN :

```html
<script type="importmap">
{
    "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
    }
}
</script>

<script type="module">
    import * as THREE from 'three';  // Charge depuis le CDN !
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
</script>
```

**Import Map** = Associe un nom court (`three`) à une URL complète (CDN).

---

## Avantages du CDN

| Avantage | Explication |
|----------|-------------|
| **Vitesse** | Serveur proche = téléchargement rapide |
| **Cache** | Si un autre site utilise le même CDN, déjà en cache ! |
| **Fiabilité** | Si un serveur tombe, un autre prend le relais |
| **Économie** | Moins de bande passante sur ton serveur |
| **Simplicité** | Pas besoin d'héberger les bibliothèques |

---

## Inconvénients du CDN

| Inconvénient | Explication |
|--------------|-------------|
| **Dépendance** | Si le CDN tombe, ton site casse |
| **Vie privée** | Le CDN voit les requêtes de tes utilisateurs |
| **Contrôle** | Tu ne contrôles pas les mises à jour |

### Solution : Versionner !

```html
<!-- ❌ Mauvais : peut changer -->
<script src="https://cdn.jsdelivr.net/npm/three/build/three.module.js"></script>

<!-- ✅ Bon : version fixe -->
<script src="https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js"></script>
```

---

## CDN vs npm install

| Aspect | CDN | npm install |
|--------|-----|-------------|
| **Installation** | Juste une URL | `npm install three` |
| **Fichiers** | Téléchargés par le navigateur | Dans `node_modules/` |
| **Build** | Pas nécessaire | Souvent avec bundler (Vite, Webpack) |
| **Offline** | ❌ Non | ✅ Oui |
| **Simplicité** | ✅ Très simple | Plus complexe |
| **Production** | ✅ Recommandé pour petits projets | ✅ Recommandé pour gros projets |

---

## Front-end pur : CDN obligatoire ?

Quand tu fais du **front-end sans backend ni bundler** (juste HTML/CSS/JS), tu n'as pas vraiment le choix :

```
📁 Mon projet simple
├── index.html
├── style.css
└── script.js    ← Pas de node_modules, pas de bundler
```

### Pourquoi ?

| Méthode | Front-end pur | Avec bundler (Vite, Webpack) |
|---------|---------------|------------------------------|
| `npm install` | ❌ Impossible (node_modules pas accessible) | ✅ Fonctionne |
| CDN | ✅ Seule option | ✅ Possible aussi |
| Télécharger le .js | ⚠️ Possible mais galère | ⚠️ Déconseillé |

### L'alternative sans CDN

Tu pourrais télécharger `three.js` manuellement :

```bash
# Télécharger le fichier
wget https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js
```

```html
<script type="module">
    import * as THREE from './three.module.js';
</script>
```

**Problèmes :**
- Tu dois aussi télécharger les addons (OrbitControls, GLTFLoader...)
- Chaque addon a ses propres dépendances
- Mise à jour manuelle = galère

### Conclusion

Pour du **front-end pur** (prototypes, apprentissage, petits projets) :
- **CDN = la meilleure option**
- Simple, rapide, pas de configuration

Pour des **projets sérieux** :
- Utilise un bundler (Vite recommandé)
- `npm install` + imports normaux

---

## Résumé

```
CDN = Réseau mondial de serveurs qui :
1. Stocke des copies de fichiers
2. Les livre depuis le serveur le plus proche
3. = Plus rapide pour tout le monde !
```

**Dans ce projet, Three.js est chargé depuis jsDelivr CDN.**
