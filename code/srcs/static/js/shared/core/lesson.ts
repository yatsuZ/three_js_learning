import * as THREE from 'three';
import { createScene, setupResize } from './scene.ts';
import type { SceneContext, SceneOptions } from './scene.ts';
import { Logger } from '../utils/logger.ts';

/**
 * Configuration d'une lecon
 */
export interface LessonConfig {
	/** Identifiant de la lecon (ex: '01', '02') */
	id: string;
	/** Nom de la lecon */
	name: string;
	/** Options de scene */
	sceneOptions?: SceneOptions;
}

/**
 * Handler d'event avec cleanup automatique
 */
interface EventHandler {
	element: EventTarget;
	type: string;
	handler: EventListener;
}

/**
 * Classe de base abstraite pour toutes les lecons
 * Gere le lifecycle: setup -> animate -> cleanup
 */
export abstract class LessonBase {
	protected ctx: SceneContext;
	protected config: LessonConfig;
	protected isRunning: boolean = false;
	protected animationId: number | null = null;
	protected clock: THREE.Clock;

	private eventHandlers: EventHandler[] = [];
	private disposeCallbacks: Array<() => void> = [];

	constructor(config: LessonConfig) {
		this.config = config;
		this.clock = new THREE.Clock();

		// Creer la scene avec les options par defaut
		const defaultOptions: SceneOptions = {
			backgroundColor: '#1a1a2e'
		};
		this.ctx = createScene({ ...defaultOptions, ...config.sceneOptions });
		setupResize(this.ctx);
	}

	/**
	 * Demarre la lecon
	 */
	async start(): Promise<void> {
		if (this.isRunning) return;

		try {
			await this.setup();
			this.isRunning = true;
			this.animate();
			Logger.lesson(this.config.id, `${this.config.name} loaded`);
		} catch (error) {
			Logger.error(`Failed to start lesson ${this.config.id}:`, error);
			throw error;
		}
	}

	/**
	 * Arrete la lecon et libere les ressources
	 */
	stop(): void {
		if (!this.isRunning) return;

		this.isRunning = false;

		// Arreter l'animation
		if (this.animationId !== null) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}

		// Cleanup des event listeners
		this.eventHandlers.forEach(({ element, type, handler }) => {
			element.removeEventListener(type, handler);
		});
		this.eventHandlers = [];

		// Appeler les callbacks de dispose
		this.disposeCallbacks.forEach(cb => cb());
		this.disposeCallbacks = [];

		// Cleanup specifique a la lecon
		this.cleanup();

		// Dispose du renderer
		this.ctx.renderer.dispose();

		Logger.lesson(this.config.id, `${this.config.name} stopped`);
	}

	/**
	 * Ajoute un event listener avec cleanup automatique
	 */
	protected addEventListener<K extends keyof HTMLElementEventMap>(
		element: HTMLElement,
		type: K,
		handler: (ev: HTMLElementEventMap[K]) => void
	): void {
		const wrappedHandler = handler as EventListener;
		element.addEventListener(type, wrappedHandler);
		this.eventHandlers.push({ element, type, handler: wrappedHandler });
	}

	/**
	 * Ajoute un event listener sur window avec cleanup automatique
	 */
	protected addWindowListener<K extends keyof WindowEventMap>(
		type: K,
		handler: (ev: WindowEventMap[K]) => void
	): void {
		const wrappedHandler = handler as EventListener;
		window.addEventListener(type, wrappedHandler);
		this.eventHandlers.push({ element: window, type, handler: wrappedHandler });
	}

	/**
	 * Enregistre un callback de dispose pour cleanup
	 */
	protected onDispose(callback: () => void): void {
		this.disposeCallbacks.push(callback);
	}

	/**
	 * Boucle d'animation principale
	 */
	private animate = (): void => {
		if (!this.isRunning) return;

		this.animationId = requestAnimationFrame(this.animate);

		const delta = this.clock.getDelta();
		this.update(delta);

		this.ctx.renderer.render(this.ctx.scene, this.ctx.camera);
	};

	/**
	 * Configuration initiale de la lecon (lumieres, objets, UI)
	 * Implementee par chaque lecon
	 */
	protected abstract setup(): Promise<void> | void;

	/**
	 * Mise a jour a chaque frame
	 * @param delta Temps ecoule depuis la derniere frame (en secondes)
	 */
	protected abstract update(delta: number): void;

	/**
	 * Nettoyage des ressources specifiques a la lecon
	 * Appellee automatiquement par stop()
	 */
	protected cleanup(): void {
		// Override dans les sous-classes si necessaire
	}

	// === Getters utiles ===

	get scene(): THREE.Scene {
		return this.ctx.scene;
	}

	get camera(): THREE.PerspectiveCamera {
		return this.ctx.camera;
	}

	get renderer(): THREE.WebGLRenderer {
		return this.ctx.renderer;
	}

	get canvas(): HTMLCanvasElement {
		return this.ctx.canvas;
	}

	get sceneContext(): SceneContext {
		return this.ctx;
	}
}
