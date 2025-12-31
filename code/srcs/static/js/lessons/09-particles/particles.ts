import * as THREE from 'three';
import type { PresetType } from './ui.ts';
import { generatePreset, type ParticleData } from './presets.ts';
import {
	updateGalaxy,
	updateSnow,
	updateFire,
	updateFountain,
	updateExplosion,
	resetExplosion
} from './animations.ts';

/**
 * Configuration d'un systeme de particules
 */
export interface ParticleConfig {
	count: number;
	size: number;
	color: THREE.Color;
	transparent: boolean;
	speed: number;
}

/**
 * Classe de gestion des systemes de particules
 */
export class ParticleSystem {
	private points: THREE.Points | null = null;
	private geometry: THREE.BufferGeometry | null = null;
	private material: THREE.PointsMaterial | null = null;
	private scene: THREE.Scene;
	private preset: PresetType = 'galaxy';
	private config: ParticleConfig;
	private particleData: ParticleData | null = null;
	private elapsedTime = 0;

	constructor(scene: THREE.Scene, config: Partial<ParticleConfig> = {}) {
		this.scene = scene;
		this.config = {
			count: config.count ?? 1000,
			size: config.size ?? 0.1,
			color: config.color ?? new THREE.Color(0x00d9ff),
			transparent: config.transparent ?? true,
			speed: config.speed ?? 1
		};
	}

	/**
	 * Cree le systeme de particules selon le preset
	 */
	create(preset: PresetType): void {
		this.dispose();
		this.preset = preset;
		this.elapsedTime = 0;

		this.geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(this.config.count * 3);
		const colors = new Float32Array(this.config.count * 3);

		this.particleData = {
			velocities: new Float32Array(this.config.count * 3),
			lifetimes: new Float32Array(this.config.count),
			initialPositions: new Float32Array(this.config.count * 3)
		};

		generatePreset(preset, this.config, positions, colors, this.particleData);

		this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

		this.material = new THREE.PointsMaterial({
			size: this.config.size,
			vertexColors: true,
			transparent: this.config.transparent,
			opacity: 0.8,
			sizeAttenuation: true,
			blending: THREE.AdditiveBlending,
			depthWrite: false
		});

		this.points = new THREE.Points(this.geometry, this.material);
		this.scene.add(this.points);
	}

	/**
	 * Met a jour les particules
	 */
	update(delta: number): void {
		if (!this.points || !this.geometry || !this.particleData) return;

		this.elapsedTime += delta * this.config.speed;
		const positions = this.geometry.attributes.position.array as Float32Array;
		const colors = this.geometry.attributes.color.array as Float32Array;
		const { velocities, lifetimes } = this.particleData;

		switch (this.preset) {
			case 'galaxy':
				updateGalaxy(this.points, delta, this.config.speed);
				break;
			case 'snow':
				updateSnow(this.config, positions, velocities, delta);
				break;
			case 'fire':
				updateFire(this.config, positions, colors, velocities, lifetimes, delta);
				break;
			case 'fountain':
				updateFountain(this.config, positions, colors, velocities, lifetimes, delta);
				break;
			case 'explosion':
				updateExplosion(this.config, positions, colors, velocities, lifetimes, delta);
				break;
		}

		this.geometry.attributes.position.needsUpdate = true;
		this.geometry.attributes.color.needsUpdate = true;
	}

	/**
	 * Trigger l'effet (utile pour explosion)
	 */
	trigger(): void {
		if (this.preset === 'explosion' && this.particleData && this.geometry) {
			const positions = this.geometry.attributes.position.array as Float32Array;
			resetExplosion(
				this.config,
				positions,
				this.particleData.velocities,
				this.particleData.lifetimes
			);
			this.geometry.attributes.position.needsUpdate = true;
		}
	}

	/**
	 * Met a jour la configuration
	 */
	setConfig(config: Partial<ParticleConfig>): void {
		if (config.count !== undefined && config.count !== this.config.count) {
			this.config.count = config.count;
			this.create(this.preset);
			return;
		}

		if (config.size !== undefined) {
			this.config.size = config.size;
			if (this.material) this.material.size = config.size;
		}

		if (config.color !== undefined) {
			this.config.color = config.color;
			this.create(this.preset);
		}

		if (config.transparent !== undefined) {
			this.config.transparent = config.transparent;
			if (this.material) {
				this.material.transparent = config.transparent;
				this.material.blending = config.transparent ? THREE.AdditiveBlending : THREE.NormalBlending;
			}
		}

		if (config.speed !== undefined) {
			this.config.speed = config.speed;
		}
	}

	/**
	 * Active/desactive la rotation auto
	 */
	setAutoRotate(enabled: boolean): void {
		// La rotation est geree dans updateGalaxy
	}

	/**
	 * Retourne le nombre de particules
	 */
	getCount(): number {
		return this.config.count;
	}

	/**
	 * Retourne l'objet Points
	 */
	getPoints(): THREE.Points | null {
		return this.points;
	}

	/**
	 * Nettoie les ressources
	 */
	dispose(): void {
		if (this.points) {
			this.scene.remove(this.points);
		}
		if (this.geometry) {
			this.geometry.dispose();
		}
		if (this.material) {
			this.material.dispose();
		}
		this.points = null;
		this.geometry = null;
		this.material = null;
		this.particleData = null;
	}
}
