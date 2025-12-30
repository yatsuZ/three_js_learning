import * as THREE from 'three';
const DEFAULT_LIGHTS = {
    ambient: {
        color: '#404040',
        intensity: 0.5
    },
    point: {
        color: '#ffffff',
        intensity: 1,
        distance: 100,
        position: { x: 5, y: 5, z: 5 }
    },
    directional: {
        color: '#ffffff',
        intensity: 0.8,
        position: { x: -5, y: 10, z: 5 }
    }
};
export function addLights(scene, config = {}) {
    var _a, _b;
    const lights = {};
    // Lumiere ambiante
    const ambientCfg = Object.assign(Object.assign({}, DEFAULT_LIGHTS.ambient), config.ambient);
    lights.ambient = new THREE.AmbientLight(ambientCfg.color, ambientCfg.intensity);
    scene.add(lights.ambient);
    // Lumiere ponctuelle
    const pointCfg = Object.assign(Object.assign(Object.assign({}, DEFAULT_LIGHTS.point), config.point), { position: Object.assign(Object.assign({}, DEFAULT_LIGHTS.point.position), (_a = config.point) === null || _a === void 0 ? void 0 : _a.position) });
    lights.point = new THREE.PointLight(pointCfg.color, pointCfg.intensity, pointCfg.distance);
    lights.point.position.set(pointCfg.position.x, pointCfg.position.y, pointCfg.position.z);
    scene.add(lights.point);
    // Lumiere directionnelle
    const dirCfg = Object.assign(Object.assign(Object.assign({}, DEFAULT_LIGHTS.directional), config.directional), { position: Object.assign(Object.assign({}, DEFAULT_LIGHTS.directional.position), (_b = config.directional) === null || _b === void 0 ? void 0 : _b.position) });
    lights.directional = new THREE.DirectionalLight(dirCfg.color, dirCfg.intensity);
    lights.directional.position.set(dirCfg.position.x, dirCfg.position.y, dirCfg.position.z);
    scene.add(lights.directional);
    return lights;
}
