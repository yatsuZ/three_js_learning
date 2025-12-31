import { DOM } from "../../shared/index.js";
/**
 * Recupere tous les elements UI
 */
export function getUIElements() {
    return {
        shadowsToggle: DOM.input('shadows-toggle'),
        helperToggle: DOM.input('helper-toggle'),
        shadowType: DOM.element('shadow-type'),
        shadowQuality: DOM.element('shadow-quality'),
        lightX: DOM.input('light-x'),
        lightXValue: DOM.element('light-x-value'),
        lightY: DOM.input('light-y'),
        lightYValue: DOM.element('light-y-value'),
        lightZ: DOM.input('light-z'),
        lightZValue: DOM.element('light-z-value'),
        shadowBias: DOM.input('shadow-bias'),
        shadowBiasValue: DOM.element('shadow-bias-value'),
        resetBtn: DOM.button('reset-btn')
    };
}
/**
 * Valeurs par defaut
 */
export const DEFAULT_VALUES = {
    lightX: 5,
    lightY: 10,
    lightZ: 5,
    shadowBias: -0.0001,
    shadowType: 'pcf',
    shadowQuality: 1024
};
