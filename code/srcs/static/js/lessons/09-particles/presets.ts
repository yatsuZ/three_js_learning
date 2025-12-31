import * as THREE from 'three';
import type { PresetType } from './ui.ts';
import type { ParticleConfig } from './particles.ts';

/**
 * Donnees des particules pour l'animation
 */
export interface ParticleData {
	velocities: Float32Array;
	lifetimes: Float32Array;
	initialPositions: Float32Array;
}

/**
 * Genere les positions selon le preset
 */
export function generatePreset(
	preset: PresetType,
	config: ParticleConfig,
	positions: Float32Array,
	colors: Float32Array,
	data: ParticleData
): void {
	switch (preset) {
		case 'galaxy':
			generateGalaxy(config, positions, colors);
			break;
		case 'snow':
			generateSnow(config, positions, colors, data.velocities);
			break;
		case 'fire':
			generateFire(config, positions, colors, data.velocities, data.lifetimes);
			break;
		case 'fountain':
			generateFountain(config, positions, colors, data.velocities, data.lifetimes);
			break;
		case 'explosion':
			generateExplosion(config, positions, colors, data.velocities, data.lifetimes, data.initialPositions);
			break;
	}
}

/**
 * Galaxie spirale
 */
function generateGalaxy(config: ParticleConfig, positions: Float32Array, colors: Float32Array): void {
	const branches = 5;
	const spin = 1;
	const randomness = 0.5;

	for (let i = 0; i < config.count; i++) {
		const i3 = i * 3;
		const radius = Math.random() * 5;
		const branchAngle = ((i % branches) / branches) * Math.PI * 2;
		const spinAngle = radius * spin;

		const randomX = (Math.random() - 0.5) * randomness * radius;
		const randomY = (Math.random() - 0.5) * randomness * 0.5;
		const randomZ = (Math.random() - 0.5) * randomness * radius;

		positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
		positions[i3 + 1] = randomY;
		positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

		// Couleur degradee du centre vers l'exterieur
		const mixRatio = radius / 5;
		colors[i3] = config.color.r * (1 - mixRatio) + 1 * mixRatio;
		colors[i3 + 1] = config.color.g * (1 - mixRatio) + 0.5 * mixRatio;
		colors[i3 + 2] = config.color.b * (1 - mixRatio) + 0 * mixRatio;
	}
}

/**
 * Neige qui tombe
 */
function generateSnow(
	config: ParticleConfig,
	positions: Float32Array,
	colors: Float32Array,
	velocities: Float32Array
): void {
	for (let i = 0; i < config.count; i++) {
		const i3 = i * 3;

		positions[i3] = (Math.random() - 0.5) * 20;
		positions[i3 + 1] = Math.random() * 15;
		positions[i3 + 2] = (Math.random() - 0.5) * 20;

		// Vitesse de chute
		velocities[i3] = (Math.random() - 0.5) * 0.5;
		velocities[i3 + 1] = -1 - Math.random() * 2;
		velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;

		// Couleur blanche avec legere variation
		const brightness = 0.8 + Math.random() * 0.2;
		colors[i3] = brightness;
		colors[i3 + 1] = brightness;
		colors[i3 + 2] = brightness;
	}
}

/**
 * Feu qui monte
 */
function generateFire(
	config: ParticleConfig,
	positions: Float32Array,
	colors: Float32Array,
	velocities: Float32Array,
	lifetimes: Float32Array
): void {
	for (let i = 0; i < config.count; i++) {
		const i3 = i * 3;

		const angle = Math.random() * Math.PI * 2;
		const radius = Math.random() * 0.5;
		positions[i3] = Math.cos(angle) * radius;
		positions[i3 + 1] = Math.random() * 3;
		positions[i3 + 2] = Math.sin(angle) * radius;

		velocities[i3] = (Math.random() - 0.5) * 0.5;
		velocities[i3 + 1] = 1 + Math.random() * 2;
		velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;

		lifetimes[i] = Math.random();

		const life = positions[i3 + 1] / 3;
		colors[i3] = 1;
		colors[i3 + 1] = 0.5 - life * 0.3;
		colors[i3 + 2] = 0;
	}
}

/**
 * Fontaine d'eau
 */
function generateFountain(
	config: ParticleConfig,
	positions: Float32Array,
	colors: Float32Array,
	velocities: Float32Array,
	lifetimes: Float32Array
): void {
	for (let i = 0; i < config.count; i++) {
		const i3 = i * 3;

		const angle = Math.random() * Math.PI * 2;
		const radius = Math.random() * 0.2;
		positions[i3] = Math.cos(angle) * radius;
		positions[i3 + 1] = 0;
		positions[i3 + 2] = Math.sin(angle) * radius;

		const upSpeed = 3 + Math.random() * 2;
		const spread = 0.5 + Math.random() * 0.5;
		velocities[i3] = Math.cos(angle) * spread;
		velocities[i3 + 1] = upSpeed;
		velocities[i3 + 2] = Math.sin(angle) * spread;

		lifetimes[i] = Math.random();

		colors[i3] = config.color.r;
		colors[i3 + 1] = config.color.g;
		colors[i3 + 2] = config.color.b;
	}
}

/**
 * Explosion
 */
function generateExplosion(
	config: ParticleConfig,
	positions: Float32Array,
	colors: Float32Array,
	velocities: Float32Array,
	lifetimes: Float32Array,
	initialPositions: Float32Array
): void {
	for (let i = 0; i < config.count; i++) {
		const i3 = i * 3;

		positions[i3] = 0;
		positions[i3 + 1] = 0;
		positions[i3 + 2] = 0;

		initialPositions[i3] = 0;
		initialPositions[i3 + 1] = 0;
		initialPositions[i3 + 2] = 0;

		const theta = Math.random() * Math.PI * 2;
		const phi = Math.acos(2 * Math.random() - 1);
		const speed = 2 + Math.random() * 4;

		velocities[i3] = Math.sin(phi) * Math.cos(theta) * speed;
		velocities[i3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
		velocities[i3 + 2] = Math.cos(phi) * speed;

		lifetimes[i] = 0;

		colors[i3] = 1;
		colors[i3 + 1] = 0.5 + Math.random() * 0.5;
		colors[i3 + 2] = Math.random() * 0.3;
	}
}
