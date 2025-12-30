import * as THREE from 'three';

// Cache pour eviter de recharger les memes textures
const textureCache = new Map<string, THREE.Texture>();

export function loadTexture(url: string): THREE.Texture {
	if (textureCache.has(url)) {
		return textureCache.get(url)!;
	}

	const loader = new THREE.TextureLoader();
	const texture = loader.load(url);
	texture.colorSpace = THREE.SRGBColorSpace;

	textureCache.set(url, texture);
	return texture;
}

// Creer une texture procedurale (damier)
export function createCheckerTexture(size: number = 8, color1: string = '#ffffff', color2: string = '#888888'): THREE.CanvasTexture {
	const canvas = document.createElement('canvas');
	canvas.width = size * 2;
	canvas.height = size * 2;
	const ctx = canvas.getContext('2d')!;

	ctx.fillStyle = color1;
	ctx.fillRect(0, 0, size, size);
	ctx.fillRect(size, size, size, size);

	ctx.fillStyle = color2;
	ctx.fillRect(size, 0, size, size);
	ctx.fillRect(0, size, size, size);

	const texture = new THREE.CanvasTexture(canvas);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(2, 2);

	return texture;
}

// Creer une texture de bruit/grain
export function createNoiseTexture(size: number = 128): THREE.CanvasTexture {
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext('2d')!;

	const imageData = ctx.createImageData(size, size);
	for (let i = 0; i < imageData.data.length; i += 4) {
		const value = Math.random() * 255;
		imageData.data[i] = value;
		imageData.data[i + 1] = value;
		imageData.data[i + 2] = value;
		imageData.data[i + 3] = 255;
	}
	ctx.putImageData(imageData, 0, 0);

	return new THREE.CanvasTexture(canvas);
}

// Creer une texture gradient
export function createGradientTexture(color1: string = '#00d9ff', color2: string = '#ff6b6b'): THREE.CanvasTexture {
	const canvas = document.createElement('canvas');
	canvas.width = 256;
	canvas.height = 256;
	const ctx = canvas.getContext('2d')!;

	const gradient = ctx.createLinearGradient(0, 0, 256, 256);
	gradient.addColorStop(0, color1);
	gradient.addColorStop(1, color2);

	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, 256, 256);

	return new THREE.CanvasTexture(canvas);
}
