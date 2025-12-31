import type * as THREE from 'three';

/**
 * Options du controleur clavier
 */
export interface KeyboardOptions {
	speed?: number;
	normalize?: boolean;
	boundaries?: { min: number; max: number } | null;
}

/**
 * Controleur de deplacement clavier pour objets 3D
 * Supporte ZQSD (FR) et WASD (EN)
 */
export class KeyboardController {
	private keys: Record<string, boolean> = {};
	private target: THREE.Object3D;
	private speed: number;
	private normalize: boolean;
	private boundaries: { min: number; max: number } | null;

	private boundKeyDown: (e: KeyboardEvent) => void;
	private boundKeyUp: (e: KeyboardEvent) => void;
	private boundBlur: () => void;

	constructor(target: THREE.Object3D, options: KeyboardOptions = {}) {
		this.target = target;
		this.speed = options.speed ?? 5;
		this.normalize = options.normalize ?? true;
		this.boundaries = options.boundaries ?? { min: -8, max: 8 };

		// Bind des handlers pour pouvoir les retirer
		this.boundKeyDown = (e) => this.onKeyDown(e);
		this.boundKeyUp = (e) => this.onKeyUp(e);
		this.boundBlur = () => this.onBlur();

		window.addEventListener('keydown', this.boundKeyDown);
		window.addEventListener('keyup', this.boundKeyUp);
		window.addEventListener('blur', this.boundBlur);
	}

	private onKeyDown(e: KeyboardEvent): void {
		const key = e.key.toLowerCase();
		// Empecher le scroll avec espace
		if (key === ' ') e.preventDefault();
		this.keys[key] = true;
	}

	private onKeyUp(e: KeyboardEvent): void {
		this.keys[e.key.toLowerCase()] = false;
	}

	private onBlur(): void {
		// Reset toutes les touches quand on perd le focus
		this.keys = {};
	}

	/**
	 * Mise a jour de la position (appeler dans la boucle de rendu)
	 */
	update(delta: number): void {
		let dx = 0, dy = 0, dz = 0;

		// Avant/Arriere (Z/S ou W/S)
		if (this.keys['z'] || this.keys['w']) dz -= 1;
		if (this.keys['s']) dz += 1;

		// Gauche/Droite (Q/D ou A/D)
		if (this.keys['q'] || this.keys['a']) dx -= 1;
		if (this.keys['d']) dx += 1;

		// Monter/Descendre (Espace/Shift)
		if (this.keys[' ']) dy += 1;
		if (this.keys['shift']) dy -= 1;

		// Normaliser si mouvement diagonal (evite d'aller plus vite en diagonale)
		if (this.normalize) {
			const lengthXZ = Math.sqrt(dx * dx + dz * dz);
			if (lengthXZ > 0) {
				dx /= lengthXZ;
				dz /= lengthXZ;
			}
		}

		// Appliquer le mouvement
		const moveSpeed = this.speed * delta;
		this.target.position.x += dx * moveSpeed;
		this.target.position.y += dy * moveSpeed;
		this.target.position.z += dz * moveSpeed;

		// Appliquer les limites
		if (this.boundaries) {
			this.target.position.x = Math.max(this.boundaries.min, Math.min(this.boundaries.max, this.target.position.x));
			this.target.position.y = Math.max(0, Math.min(this.boundaries.max, this.target.position.y));
			this.target.position.z = Math.max(this.boundaries.min, Math.min(this.boundaries.max, this.target.position.z));
		}
	}

	/**
	 * Verifie si une touche est actuellement pressee
	 */
	isKeyPressed(key: string): boolean {
		return this.keys[key.toLowerCase()] ?? false;
	}

	/**
	 * Retourne l'etat de toutes les touches de mouvement
	 */
	getActiveKeys(): { z: boolean; q: boolean; s: boolean; d: boolean; space: boolean; shift: boolean } {
		return {
			z: this.keys['z'] || this.keys['w'] || false,
			q: this.keys['q'] || this.keys['a'] || false,
			s: this.keys['s'] || false,
			d: this.keys['d'] || false,
			space: this.keys[' '] || false,
			shift: this.keys['shift'] || false
		};
	}

	/**
	 * Change la cible du controleur
	 */
	setTarget(target: THREE.Object3D): void {
		this.target = target;
	}

	/**
	 * Change la vitesse
	 */
	setSpeed(speed: number): void {
		this.speed = speed;
	}

	/**
	 * Active/desactive la normalisation
	 */
	setNormalize(normalize: boolean): void {
		this.normalize = normalize;
	}

	/**
	 * Active/desactive les limites
	 */
	setBoundaries(boundaries: { min: number; max: number } | null): void {
		this.boundaries = boundaries;
	}

	/**
	 * Nettoie les event listeners
	 */
	dispose(): void {
		window.removeEventListener('keydown', this.boundKeyDown);
		window.removeEventListener('keyup', this.boundKeyUp);
		window.removeEventListener('blur', this.boundBlur);
	}
}
