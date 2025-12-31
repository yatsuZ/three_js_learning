import { DOM } from "../../shared/index.js";
/**
 * Recupere tous les elements UI
 */
export function getUIElements() {
    return {
        shape: DOM.element('shape'),
        mass: DOM.input('mass'),
        massValue: DOM.element('mass-value'),
        restitution: DOM.input('restitution'),
        restitutionValue: DOM.element('restitution-value'),
        friction: DOM.input('friction'),
        frictionValue: DOM.element('friction-value'),
        gravity: DOM.input('gravity'),
        gravityValue: DOM.element('gravity-value'),
        debugToggle: DOM.input('debug-toggle'),
        soundToggle: DOM.input('sound-toggle'),
        breakableToggle: DOM.input('breakable-toggle'),
        spawnBtn: DOM.button('spawn-btn'),
        rainBtn: DOM.button('rain-btn'),
        clearBtn: DOM.button('clear-btn'),
        resetBtn: DOM.button('reset-btn'),
        exportBtn: DOM.button('export-btn'),
        objectCount: DOM.element('object-count'),
        maxObjects: DOM.element('max-objects')
    };
}
