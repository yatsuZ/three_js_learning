import { DOM } from "../../shared/index.js";
/**
 * Recupere tous les elements UI
 */
export function getUIElements() {
    return {
        glbModeToggle: DOM.input('glb-mode-toggle'),
        speed: DOM.input('speed'),
        speedValue: DOM.element('speed-value'),
        normalizeToggle: DOM.input('normalize-toggle'),
        boundariesToggle: DOM.input('boundaries-toggle'),
        resetBtn: DOM.button('reset-btn'),
        keyZ: DOM.element('key-z'),
        keyQ: DOM.element('key-q'),
        keyS: DOM.element('key-s'),
        keyD: DOM.element('key-d'),
        keySpace: DOM.element('key-space'),
        keyShift: DOM.element('key-shift'),
        posX: DOM.element('pos-x'),
        posY: DOM.element('pos-y'),
        posZ: DOM.element('pos-z')
    };
}
/**
 * Met a jour l'affichage des touches actives
 */
export function updateKeyDisplay(ui, keys) {
    ui.keyZ.classList.toggle('active', keys.z);
    ui.keyQ.classList.toggle('active', keys.q);
    ui.keyS.classList.toggle('active', keys.s);
    ui.keyD.classList.toggle('active', keys.d);
    ui.keySpace.classList.toggle('active', keys.space);
    ui.keyShift.classList.toggle('active', keys.shift);
}
/**
 * Met a jour l'affichage de la position
 */
export function updatePositionDisplay(ui, x, y, z) {
    ui.posX.textContent = x.toFixed(2);
    ui.posY.textContent = y.toFixed(2);
    ui.posZ.textContent = z.toFixed(2);
}
