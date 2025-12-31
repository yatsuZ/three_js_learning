# Leçon 11 - Contrôles Clavier

## Objectif

Apprendre à **déplacer un objet 3D** avec le clavier (ZQSD/WASD + Espace/Shift).

---

## Concept

Pour déplacer un objet avec le clavier, il faut :

1. **Écouter** les événements `keydown` et `keyup`
2. **Stocker** l'état des touches (pressées ou non)
3. **Mettre à jour** la position de l'objet dans la boucle `update()`

---

## Pourquoi ne pas déplacer directement dans keydown ?

```javascript
// ❌ Mauvaise approche
window.addEventListener('keydown', (e) => {
    if (e.key === 'z') object.position.z -= 0.1;
});
```

Problèmes :
- Dépend du taux de répétition du clavier
- Mouvement saccadé
- Pas de mouvement diagonal fluide

```javascript
// ✅ Bonne approche
const keys = { z: false, q: false, s: false, d: false };

window.addEventListener('keydown', (e) => {
    if (e.key === 'z') keys.z = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'z') keys.z = false;
});

function update(delta) {
    const speed = 5 * delta;
    if (keys.z) object.position.z -= speed;
    if (keys.s) object.position.z += speed;
    // etc.
}
```

---

## Schéma des touches

```
        Z (avant)
           ↑
    Q ← ─────── → D
    (gauche)    (droite)
           ↓
        S (arriere)

    Espace = Monter
    Shift  = Descendre
```

---

## Code complet

```javascript
class KeyboardController {
    private keys: Record<string, boolean> = {};
    private target: THREE.Object3D;
    private speed: number;

    constructor(target: THREE.Object3D, speed = 5) {
        this.target = target;
        this.speed = speed;

        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }

    private onKeyDown(e: KeyboardEvent): void {
        this.keys[e.key.toLowerCase()] = true;
    }

    private onKeyUp(e: KeyboardEvent): void {
        this.keys[e.key.toLowerCase()] = false;
    }

    update(delta: number): void {
        const moveSpeed = this.speed * delta;

        // Avant/Arriere (Z/S)
        if (this.keys['z'] || this.keys['w']) {
            this.target.position.z -= moveSpeed;
        }
        if (this.keys['s']) {
            this.target.position.z += moveSpeed;
        }

        // Gauche/Droite (Q/D)
        if (this.keys['q'] || this.keys['a']) {
            this.target.position.x -= moveSpeed;
        }
        if (this.keys['d']) {
            this.target.position.x += moveSpeed;
        }

        // Monter/Descendre (Espace/Shift)
        if (this.keys[' ']) {
            this.target.position.y += moveSpeed;
        }
        if (this.keys['shift']) {
            this.target.position.y -= moveSpeed;
        }
    }

    dispose(): void {
        // Cleanup si nécessaire
    }
}
```

---

## Delta time

Le `delta` est crucial pour un mouvement fluide :

```javascript
// Sans delta : vitesse dépend du framerate
object.position.x += 0.1; // 60 FPS = 6 unités/sec, 30 FPS = 3 unités/sec

// Avec delta : vitesse constante
object.position.x += speed * delta; // Toujours speed unités/sec
```

---

## Normalisation diagonale

Problème : se déplacer en diagonale est plus rapide (√2 ≈ 1.41x).

Solution :

```javascript
update(delta: number): void {
    let dx = 0, dz = 0;

    if (this.keys['z']) dz -= 1;
    if (this.keys['s']) dz += 1;
    if (this.keys['q']) dx -= 1;
    if (this.keys['d']) dx += 1;

    // Normaliser si mouvement diagonal
    const length = Math.sqrt(dx * dx + dz * dz);
    if (length > 0) {
        dx /= length;
        dz /= length;
    }

    const moveSpeed = this.speed * delta;
    this.target.position.x += dx * moveSpeed;
    this.target.position.z += dz * moveSpeed;
}
```

---

## Charger un modèle GLB

Dans cette leçon, vous pouvez charger votre propre modèle GLB et le déplacer avec le clavier.

---

## Points clés

1. **État des touches** : Stocker dans un objet `keys`
2. **Delta time** : Pour un mouvement fluide indépendant du framerate
3. **Normalisation** : Pour une vitesse constante en diagonale
4. **ZQSD + WASD** : Supporter les deux layouts clavier
5. **Cleanup** : Retirer les event listeners quand on quitte

---

## Exercice

Dans cette leçon, vous pouvez :
- Déplacer un cube ou un modèle GLB avec ZQSD
- Monter/descendre avec Espace/Shift
- Ajuster la vitesse de déplacement
- Charger votre propre modèle GLB
