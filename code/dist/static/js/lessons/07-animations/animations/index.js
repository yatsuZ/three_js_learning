import { animateBounce } from "./bounce.js";
import { animateBounceReal } from "./bounce-real.js";
import { animateSpin } from "./spin.js";
import { animateElastic } from "./elastic.js";
import { animateSequence } from "./sequence.js";
import { animateStagger } from "./stagger.js";
/**
 * Controleur d'animations GSAP pour les cubes
 */
export class AnimationController {
    constructor(cubes) {
        this.currentTimeline = null;
        this.cubes = cubes;
        this.initialPositions = cubes.map(c => ({
            x: c.position.x,
            y: c.position.y,
            z: c.position.z
        }));
    }
    /**
     * Joue une animation par type
     */
    play(type, options) {
        this.killAll();
        this.reset();
        const ctx = { cubes: this.cubes, options };
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
        }
    }
    /**
     * Reset les cubes a leur position initiale
     */
    reset() {
        this.killAll();
        this.cubes.forEach((cube, i) => {
            const pos = this.initialPositions[i];
            cube.position.set(pos.x, pos.y, pos.z);
            cube.rotation.set(0, 0, 0);
            cube.scale.set(1, 1, 1);
        });
    }
    /**
     * Arrete toutes les animations
     */
    killAll() {
        var _a;
        (_a = this.currentTimeline) === null || _a === void 0 ? void 0 : _a.kill();
        this.currentTimeline = null;
        this.cubes.forEach(cube => {
            gsap.killTweensOf(cube.position);
            gsap.killTweensOf(cube.rotation);
            gsap.killTweensOf(cube.scale);
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
}
