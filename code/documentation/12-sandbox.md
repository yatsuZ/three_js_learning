# Lecon 12 - Sandbox Final

## Objectif

Combiner **toutes les notions apprises** dans un environnement sandbox interactif.

---

## Fonctionnalites combinees

| Lecon | Concept | Integration |
|-------|---------|-------------|
| 03 | Lumieres | Ambient + Directional avec ombres |
| 04 | OrbitControls | Camera libre |
| 08 | Shadows | Ombres temps reel |
| 09 | Particles | 4 presets (galaxie, neige, feu, fontaine) |
| 10 | Physics | Cannon.js avec collisions, sons, objets cassables |
| 11 | Keyboard | Controle ZQSD d'un personnage |

---

## Modes disponibles

### Mode Physique

- Spawn de cubes, spheres, cylindres
- Objets cassables (se brisent a l'impact)
- Rebond configurable
- Clic pour spawn a une position
- Bouton explosion

### Mode Particules

- Preset: Galaxie, Neige, Feu, Fontaine
- Nombre de particules ajustable
- Animation automatique

### Mode Joueur

- Personnage controlable en ZQSD
- Saut avec Espace
- Affichage des touches actives
- Position en temps reel

---

## Architecture

```
Scene
├── Lumiere Directionnelle (ombres)
├── Lumiere Ambiante
├── Sol + Grille
├── Murs invisibles
├── Objets physiques (Cannon.js)
├── Particules (THREE.Points)
└── Joueur (Capsule)
```

---

## Sons proceduraux

Les sons sont generes en JavaScript avec Web Audio API :

```javascript
// Son de collision
const oscillator = audioContext.createOscillator();
oscillator.frequency.value = 100 + velocity * 20;
oscillator.type = 'sine';

// Son de casse (bruit blanc)
const buffer = audioContext.createBuffer(1, samples, sampleRate);
for (let i = 0; i < samples; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / samples);
}
```

---

## Export GLB

Exporter la scene complete en fichier GLB :

```javascript
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const exporter = new GLTFExporter();
exporter.parse(scene, (gltf) => {
    const blob = new Blob([gltf], { type: 'application/octet-stream' });
    // Telecharger...
}, (error) => {}, { binary: true });
```

Le fichier GLB peut etre :
- Importe dans Blender
- Utilise dans un autre projet Three.js
- Partage avec d'autres

---

## Objets cassables

Quand un objet cassable subit un impact > 5 :

1. L'objet original est supprime
2. Des debris sont crees (4-8 petits cubes)
3. Les debris heritent de la velocite + explosion
4. Son de casse joue

```javascript
if (obj.breakable && impactVelocity > 5) {
    obj.health -= impactVelocity * 5;
    if (obj.health <= 0) {
        this.breakObject(obj);
    }
}
```

---

## Controles

| Touche | Action |
|--------|--------|
| Clic | Spawn objet (mode physics) |
| ZQSD/WASD | Deplacer (mode player) |
| Espace | Sauter (mode player) |
| Souris | Orbite camera |
| Scroll | Zoom |

---

## Points cles

1. **Separation des modes** : Physics / Particles / Player
2. **Synchronisation** : Cannon.js ↔ Three.js chaque frame
3. **Performance** : Limite de 30 objets
4. **Audio procedural** : Pas de fichiers audio externes
5. **Export** : Scene exportable en GLB

---

## Ce que vous avez appris

A travers ces 12 lecons, vous maitrisez maintenant :

- [ ] Creer une scene Three.js
- [ ] Ajouter des geometries et materiaux
- [ ] Eclairer une scene (Ambient, Point, Directional)
- [ ] Controler la camera (OrbitControls)
- [ ] Appliquer des textures
- [ ] Importer des modeles 3D (.glb)
- [ ] Animer avec GSAP
- [ ] Ajouter des ombres
- [ ] Creer des systemes de particules
- [ ] Simuler la physique (Cannon.js)
- [ ] Gerer les inputs clavier
- [ ] Exporter une scene

**Felicitations !** Vous etes pret pour des projets Three.js plus avances.
