import { animateBounce } from "./bounce.js";
import { animateBounceReal } from "./bounce-real.js";
import { animateSpin } from "./spin.js";
import { animateElastic } from "./elastic.js";
import { animateSequence } from "./sequence.js";
import { animateStagger } from "./stagger.js";
import { animateWave } from "./wave.js";
/**
 * Controleur d'animations GSAP pour objets 3D
 */
export class AnimationController {
    constructor(targets) {
        this.currentTimeline = null;
        this.targets = targets;
        this.initialStates = this.captureStates(targets);
    }
    /**
     * Capture l'etat initial des objets
     */
    captureStates(objects) {
        return objects.map(o => ({
            pos: { x: o.position.x, y: o.position.y, z: o.position.z },
            rot: { x: o.rotation.x, y: o.rotation.y, z: o.rotation.z },
            scale: { x: o.scale.x, y: o.scale.y, z: o.scale.z }
        }));
    }
    /**
     * Change les cibles d'animation
     */
    setTargets(targets) {
        this.killAll();
        this.targets = targets;
        this.initialStates = this.captureStates(targets);
    }
    /**
     * Joue une animation par type
     */
    play(type, options) {
        this.killAll();
        this.reset();
        const ctx = { cubes: this.targets, options };
        switch (type) {
            case 'bounce':
                this.currentTimeline = animateBounce(ctx);
                break;
            case 'bounce-real':
                this.currentTimeline = animateBounceReal(ctx);
                break;
            case 'spin':
                this.currentTimeline = animateSpin(ctx);
                break;
            case 'elastic':
                this.currentTimeline = animateElastic(ctx);
                break;
            case 'sequence':
                this.currentTimeline = animateSequence(ctx);
                break;
            case 'stagger':
                this.currentTimeline = animateStagger(ctx);
                break;
            case 'wave':
                this.currentTimeline = animateWave(ctx);
                break;
        }
    }
    /**
     * Reset les objets a leur etat initial
     */
    reset() {
        this.killAll();
        this.targets.forEach((obj, i) => {
            const state = this.initialStates[i];
            if (state) {
                obj.position.set(state.pos.x, state.pos.y, state.pos.z);
                obj.rotation.set(state.rot.x, state.rot.y, state.rot.z);
                obj.scale.set(state.scale.x, state.scale.y, state.scale.z);
            }
        });
    }
    /**
     * Arrete toutes les animations
     */
    killAll() {
        var _a;
        (_a = this.currentTimeline) === null || _a === void 0 ? void 0 : _a.kill();
        this.currentTimeline = null;
        this.targets.forEach(obj => {
            gsap.killTweensOf(obj.position);
            gsap.killTweensOf(obj.rotation);
            gsap.killTweensOf(obj.scale);
        });
    }
    pause() {
        var _a;
        (_a = this.currentTimeline) === null || _a === void 0 ? void 0 : _a.pause();
    }
    resume() {
        var _a;
        (_a = this.currentTimeline) === null || _a === void 0 ? void 0 : _a.resume();
    }
    reverse() {
        var _a;
        (_a = this.currentTimeline) === null || _a === void 0 ? void 0 : _a.reverse();
    }
    /**
     * Retourne la progression de l'animation (0-1)
     */
    getProgress() {
        var _a, _b;
        return (_b = (_a = this.currentTimeline) === null || _a === void 0 ? void 0 : _a.progress()) !== null && _b !== void 0 ? _b : 0;
    }
    /**
     * Change la vitesse de l'animation en temps reel
     */
    setSpeed(speed) {
        var _a;
        (_a = this.currentTimeline) === null || _a === void 0 ? void 0 : _a.timeScale(speed);
    }
}
