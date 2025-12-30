# Three.js Learning

Projet pour apprendre Three.js etape par etape.

## Objectif

Creer une serie d'exercices progressifs pour maitriser Three.js, avec un hub d'accueil pour naviguer entre les differentes lecons.

## Plan d'apprentissage

| # | Exercice | Description | Status |
|---|----------|-------------|--------|
| 1 | Cube 3D | Afficher un cube basique dans une scene | A faire |
| 2 | Controls | Rotation + deplacement du cube avec la souris/clavier | A faire |
| 3 | Textures | Appliquer des textures sur le cube | A faire |
| 4 | Lumieres | Ajouter differents types de lumieres | A faire |
| 5 | Animations | Animer des objets avec requestAnimationFrame | A faire |
| 6 | Modeles 3D | Importer des modeles .glb/.gltf | A faire |

## Structure

```
code/srcs/static/
├── views/
│   ├── index.ejs        # Hub d'accueil
│   └── lessons/
│       ├── 01-cube.ejs
│       ├── 02-controls.ejs
│       └── ...
├── css/
│   └── style.css
└── js/
    ├── main.js
    └── lessons/
        ├── 01-cube.js
        ├── 02-controls.js
        └── ...
```

## Lancer le projet

```bash
make docker
# Ouvrir http://localhost:3000
```

## Ressources

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [Three.js Fundamentals](https://threejs.org/manual/)
