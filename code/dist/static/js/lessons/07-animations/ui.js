import { DOM } from "../../shared/index.js";
/**
 * Recupere tous les elements UI
 */
export function getUIElements() {
    return {
        animationSelect: DOM.element('animation-select'),
        playBtn: DOM.button('play-btn'),
        resetBtn: DOM.button('reset-btn'),
        duration: DOM.input('duration'),
        durationValue: DOM.element('duration-value'),
        easingSelect: DOM.element('easing-select'),
        repeatToggle: DOM.input('repeat-toggle'),
        yoyoToggle: DOM.input('yoyo-toggle'),
        pauseBtn: DOM.button('pause-btn'),
        resumeBtn: DOM.button('resume-btn'),
        reverseBtn: DOM.button('reverse-btn')
    };
}
/**
 * Extrait les options d'animation depuis l'UI
 */
export function getAnimationOptions(ui) {
    return {
        duration: parseFloat(ui.duration.value),
        ease: ui.easingSelect.value,
        repeat: ui.repeatToggle.checked ? -1 : 0,
        yoyo: ui.yoyoToggle.checked
    };
}
