/**
 * Utilitaires DOM avec typage securise
 */
/**
 * Erreur quand un element DOM n'est pas trouve
 */
export class DOMElementNotFoundError extends Error {
    constructor(id) {
        super(`Element DOM introuvable: #${id}`);
        this.name = 'DOMElementNotFoundError';
    }
}
/**
 * Erreur quand un element DOM n'est pas du bon type
 */
export class DOMElementTypeError extends Error {
    constructor(id, expected, actual) {
        super(`Element #${id}: attendu ${expected}, recu ${actual}`);
        this.name = 'DOMElementTypeError';
    }
}
/**
 * Recupere un element DOM par son ID avec verification de type
 * @throws {DOMElementNotFoundError} Si l'element n'existe pas
 */
export function getElement(id, type) {
    const element = document.getElementById(id);
    if (!element) {
        throw new DOMElementNotFoundError(id);
    }
    if (type && !(element instanceof type)) {
        throw new DOMElementTypeError(id, type.name, element.constructor.name);
    }
    return element;
}
/**
 * Recupere un element DOM ou null si non trouve
 */
export function getElementOrNull(id, type) {
    try {
        return getElement(id, type);
    }
    catch (_a) {
        return null;
    }
}
/**
 * Raccourcis pour les types communs
 */
export const DOM = {
    input: (id) => getElement(id, HTMLInputElement),
    button: (id) => getElement(id, HTMLButtonElement),
    canvas: (id) => getElement(id, HTMLCanvasElement),
    div: (id) => getElement(id, HTMLDivElement),
    element: (id) => getElement(id),
    // Versions nullable
    inputOrNull: (id) => getElementOrNull(id, HTMLInputElement),
    elementOrNull: (id) => getElementOrNull(id)
};
