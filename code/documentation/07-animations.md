# Leçon 07 - Animations avec GSAP

## Introduction

Cette leçon explore les animations avancées avec **GSAP** (GreenSock Animation Platform), une librairie professionnelle pour créer des animations fluides et performantes.

## Qu'est-ce que GSAP ?

GSAP est une librairie JavaScript qui permet de créer des animations :
- **Fluides** : 60 FPS garantis
- **Précises** : Contrôle au pixel près
- **Flexibles** : Anime n'importe quelle propriété
- **Séquençables** : Timeline pour enchaîner les animations

### Pourquoi GSAP avec Three.js ?

Three.js gère le rendu 3D, mais les animations manuelles sont complexes :

```javascript
// Sans GSAP - Animation manuelle
function animate() {
  cube.position.x += 0.01;
  if (cube.position.x > 5) cube.position.x = 0;
  requestAnimationFrame(animate);
}

// Avec GSAP - Simple et puissant
gsap.to(cube.position, {
  x: 5,
  duration: 2,
  ease: "power2.inOut",
  repeat: -1,
  yoyo: true
});
```

## Concepts clés

### 1. Tweens

Un **tween** est une animation d'un état A vers un état B.

```javascript
// to() - De l'état actuel vers la cible
gsap.to(cube.position, { x: 5, duration: 1 });

// from() - De la cible vers l'état actuel
gsap.from(cube.scale, { x: 0, y: 0, z: 0, duration: 1 });

// fromTo() - Définir début et fin
gsap.fromTo(cube.rotation,
  { y: 0 },           // from
  { y: Math.PI * 2 }  // to
);
```

### 2. Easings

Les **easings** définissent la courbe d'accélération :

| Easing | Description |
|--------|-------------|
| `linear` | Vitesse constante |
| `power1.out` | Décélération légère |
| `power2.inOut` | Accélère puis décélère |
| `elastic.out` | Effet élastique |
| `bounce.out` | Effet rebond |
| `back.out` | Dépasse puis revient |

```javascript
gsap.to(cube.position, { y: 3, ease: "elastic.out(1, 0.3)" });
```

### 3. Timeline

Une **timeline** permet de séquencer plusieurs animations :

```javascript
const tl = gsap.timeline({ repeat: -1 });

tl.to(cube.position, { y: 2, duration: 0.5 })
  .to(cube.rotation, { x: Math.PI, duration: 0.5 })
  .to(cube.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.3 })
  .to(cube.position, { y: 0, duration: 0.5 });
```

### 4. Contrôles

```javascript
const tween = gsap.to(cube.position, { x: 5, duration: 2 });

tween.pause();    // Pause
tween.resume();   // Reprendre
tween.reverse();  // Inverser
tween.restart();  // Recommencer
tween.kill();     // Arrêter et supprimer
```

## Propriétés animables avec Three.js

### Position
```javascript
gsap.to(mesh.position, { x: 2, y: 1, z: -3 });
```

### Rotation
```javascript
gsap.to(mesh.rotation, { x: Math.PI, y: Math.PI / 2 });
```

### Scale
```javascript
gsap.to(mesh.scale, { x: 2, y: 2, z: 2 });
```

### Matériau (couleur, opacité)
```javascript
gsap.to(mesh.material.color, { r: 1, g: 0, b: 0 }); // Rouge
gsap.to(mesh.material, { opacity: 0.5 });
```

### Lumières
```javascript
gsap.to(light, { intensity: 2 });
gsap.to(light.position, { x: 10, y: 5 });
```

### Caméra
```javascript
gsap.to(camera.position, { x: 0, y: 5, z: 10, duration: 2 });
```

## Options utiles

```javascript
gsap.to(target, {
  // Durée
  duration: 1,

  // Délai avant de commencer
  delay: 0.5,

  // Easing
  ease: "power2.out",

  // Répétition (-1 = infini)
  repeat: 3,

  // Aller-retour
  yoyo: true,

  // Délai entre répétitions
  repeatDelay: 0.2,

  // Callbacks
  onStart: () => console.log("Début"),
  onComplete: () => console.log("Fin"),
  onUpdate: () => console.log("Update"),

  // Écraser les animations en cours
  overwrite: true
});
```

## Stagger (animations décalées)

Animer plusieurs objets avec un décalage :

```javascript
const cubes = [cube1, cube2, cube3, cube4];

gsap.to(cubes.map(c => c.position), {
  y: 2,
  duration: 0.5,
  stagger: 0.1  // 0.1s entre chaque cube
});
```

## Bonnes pratiques

### 1. Utiliser des timelines pour les séquences
```javascript
// ❌ Mauvais - Délais manuels
gsap.to(cube1.position, { y: 2, duration: 0.5 });
gsap.to(cube2.position, { y: 2, duration: 0.5, delay: 0.5 });

// ✅ Bon - Timeline
const tl = gsap.timeline();
tl.to(cube1.position, { y: 2, duration: 0.5 })
  .to(cube2.position, { y: 2, duration: 0.5 });
```

### 2. Nettoyer les animations
```javascript
// Dans cleanup/dispose
gsap.killTweensOf(cube.position);
gsap.killTweensOf(cube.rotation);
// ou
timeline.kill();
```

### 3. Utiliser overwrite pour éviter les conflits
```javascript
gsap.to(cube.position, { x: 5, overwrite: true });
```

## Ressources

- [Documentation GSAP](https://greensock.com/docs/)
- [GSAP Easing Visualizer](https://greensock.com/docs/v3/Eases)
- [GSAP Cheat Sheet](https://greensock.com/cheatsheet/)
