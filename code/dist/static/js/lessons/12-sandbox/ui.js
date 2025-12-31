import { DOM } from "../../shared/index.js";
export function getUIElements() {
    return {
        mode: DOM.element('mode'),
        shape: DOM.element('shape'),
        breakableToggle: DOM.input('breakable-toggle'),
        restitution: DOM.input('restitution'),
        physicsSection: DOM.element('physics-section'),
        particlePreset: DOM.element('particle-preset'),
        particleCount: DOM.input('particle-count'),
        particleCountValue: DOM.element('particle-count-value'),
        particlesSection: DOM.element('particles-section'),
        playerSpeed: DOM.input('player-speed'),
        playerSpeedValue: DOM.element('player-speed-value'),
        playerSection: DOM.element('player-section'),
        keyZ: DOM.element('key-z'),
        keyQ: DOM.element('key-q'),
        keyS: DOM.element('key-s'),
        keyD: DOM.element('key-d'),
        keySpace: DOM.element('key-space'),
        posX: DOM.element('pos-x'),
        posY: DOM.element('pos-y'),
        posZ: DOM.element('pos-z'),
        soundToggle: DOM.input('sound-toggle'),
        shadowsToggle: DOM.input('shadows-toggle'),
        spawnBtn: DOM.button('spawn-btn'),
        explosionBtn: DOM.button('explosion-btn'),
        exportBtn: DOM.button('export-btn'),
        clearBtn: DOM.button('clear-btn'),
        resetBtn: DOM.button('reset-btn'),
        objectCount: DOM.element('object-count'),
        maxObjects: DOM.element('max-objects')
    };
}
