import * as THREE from 'three';

/**
 * Cree le sol avec grille
 */
export function createFloor(scene: THREE.Scene): THREE.Mesh {
	const floorGeometry = new THREE.PlaneGeometry(20, 20);
	const floorMaterial = new THREE.MeshStandardMaterial({
		color: 0x333333,
		roughness: 0.8
	});
	const floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.rotation.x = -Math.PI / 2;
	floor.position.y = -1;
	floor.receiveShadow = true;
	scene.add(floor);

	// Grille sur le sol
	const grid = new THREE.GridHelper(20, 20, 0x444444, 0x444444);
	grid.position.y = -0.99;
	scene.add(grid);

	return floor;
}

/**
 * Cree les cubes de demonstration
 */
export function createCubes(scene: THREE.Scene): THREE.Mesh[] {
	const cubes: THREE.Mesh[] = [];
	const colors = ['#00d9ff', '#ff6b6b', '#4ecdc4'];
	const positions = [
		{ x: -3, y: 0.5, z: 0 },
		{ x: 0, y: 1, z: 0 },
		{ x: 3, y: 0.5, z: 0 }
	];

	positions.forEach((pos, i) => {
		const size = i === 1 ? 1.5 : 1;
		const geometry = new THREE.BoxGeometry(size, size, size);
		const material = new THREE.MeshStandardMaterial({
			color: colors[i],
			roughness: 0.7,
			metalness: 0.3
		});
		const cube = new THREE.Mesh(geometry, material);
		cube.position.set(pos.x, pos.y, pos.z);
		cube.castShadow = true;
		cube.receiveShadow = true;
		scene.add(cube);
		cubes.push(cube);
	});

	return cubes;
}

/**
 * Cree la sphere de demonstration
 */
export function createSphere(scene: THREE.Scene): THREE.Mesh {
	const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
	const sphereMaterial = new THREE.MeshStandardMaterial({
		color: '#ffe66d',
		roughness: 0.3,
		metalness: 0.5
	});
	const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	sphere.position.set(-1.5, 0, 2);
	sphere.castShadow = true;
	scene.add(sphere);

	return sphere;
}

/**
 * Configure la lumiere directionnelle avec ombres
 */
export function createDirectionalLight(
	scene: THREE.Scene,
	position: { x: number; y: number; z: number },
	shadowQuality: number,
	shadowBias: number
): { light: THREE.DirectionalLight; helper: THREE.CameraHelper } {
	const light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(position.x, position.y, position.z);
	light.castShadow = true;

	// Configuration de la shadow camera
	light.shadow.mapSize.width = shadowQuality;
	light.shadow.mapSize.height = shadowQuality;
	light.shadow.camera.near = 0.5;
	light.shadow.camera.far = 50;
	light.shadow.camera.left = -10;
	light.shadow.camera.right = 10;
	light.shadow.camera.top = 10;
	light.shadow.camera.bottom = -10;
	light.shadow.bias = shadowBias;

	scene.add(light);

	// Helper pour visualiser la shadow camera
	const helper = new THREE.CameraHelper(light.shadow.camera);
	helper.visible = false;
	scene.add(helper);

	return { light, helper };
}
