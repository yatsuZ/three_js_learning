import { DOM } from "../../shared/index.js";
/**
 * Recupere tous les elements UI
 */
export function getUIElements() {
    return {
        preset: DOM.element('preset'),
        count: DOM.input('count'),
        countValue: DOM.element('count-value'),
        size: DOM.input('size'),
        sizeValue: DOM.element('size-value'),
        color: DOM.input('color'),
        speed: DOM.input('speed'),
        speedValue: DOM.element('speed-value'),
        rotateToggle: DOM.input('rotate-toggle'),
        transparentToggle: DOM.input('transparent-toggle'),
        triggerBtn: DOM.button('trigger-btn'),
        resetBtn: DOM.button('reset-btn'),
        particleCount: DOM.element('particle-count')
    };
}
