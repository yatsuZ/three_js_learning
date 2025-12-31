var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as THREE from 'three';
import { createScene, setupResize } from "./scene.js";
import { Logger } from "../utils/logger.js";
/**
 * Classe de base abstraite pour toutes les lecons
 * Gere le lifecycle: setup -> animate -> cleanup
 */
export class LessonBase {
    constructor(config) {
        this.isRunning = false;
        this.animationId = null;
        this.eventHandlers = [];
        this.disposeCallbacks = [];
        /**
         * Boucle d'animation principale
         */
        this.animate = () => {
            if (!this.isRunning)
                return;
            this.animationId = requestAnimationFrame(this.animate);
            const delta = this.clock.getDelta();
            this.update(delta);
            this.ctx.renderer.render(this.ctx.scene, this.ctx.camera);
        };
        this.config = config;
        this.clock = new THREE.Clock();
        // Creer la scene avec les options par defaut
        const defaultOptions = {
            backgroundColor: '#1a1a2e'
        };
        this.ctx = createScene(Object.assign(Object.assign({}, defaultOptions), config.sceneOptions));
        setupResize(this.ctx);
    }
    /**
     * Demarre la lecon
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isRunning)
                return;
            try {
                yield this.setup();
                this.isRunning = true;
                this.animate();
                Logger.lesson(this.config.id, `${this.config.name} loaded`);
            }
            catch (error) {
                Logger.error(`Failed to start lesson ${this.config.id}:`, error);
                throw error;
            }
        });
    }
    /**
     * Arrete la lecon et libere les ressources
     */
    stop() {
        if (!this.isRunning)
            return;
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
    addEventListener(element, type, handler) {
        const wrappedHandler = handler;
        element.addEventListener(type, wrappedHandler);
        this.eventHandlers.push({ element, type, handler: wrappedHandler });
    }
    /**
     * Ajoute un event listener sur window avec cleanup automatique
     */
    addWindowListener(type, handler) {
        const wrappedHandler = handler;
        window.addEventListener(type, wrappedHandler);
        this.eventHandlers.push({ element: window, type, handler: wrappedHandler });
    }
    /**
     * Enregistre un callback de dispose pour cleanup
     */
    onDispose(callback) {
        this.disposeCallbacks.push(callback);
    }
    /**
     * Nettoyage des ressources specifiques a la lecon
     * Appellee automatiquement par stop()
     */
    cleanup() {
        // Override dans les sous-classes si necessaire
    }
    // === Getters utiles ===
    get scene() {
        return this.ctx.scene;
    }
    get camera() {
        return this.ctx.camera;
    }
    get renderer() {
        return this.ctx.renderer;
    }
    get canvas() {
        return this.ctx.canvas;
    }
    get sceneContext() {
        return this.ctx;
    }
}
