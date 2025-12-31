/**
 * Utilitaires DOM avec typage securise
 */

/**
 * Erreur quand un element DOM n'est pas trouve
 */
export class DOMElementNotFoundError extends Error {
	constructor(id: string) {
		super(`Element DOM introuvable: #${id}`);
		this.name = 'DOMElementNotFoundError';
	}
}

/**
 * Erreur quand un element DOM n'est pas du bon type
 */
export class DOMElementTypeError extends Error {
	constructor(id: string, expected: string, actual: string) {
		super(`Element #${id}: attendu ${expected}, recu ${actual}`);
		this.name = 'DOMElementTypeError';
	}
}

/**
 * Recupere un element DOM par son ID avec verification de type
 * @throws {DOMElementNotFoundError} Si l'element n'existe pas
 */
export function getElement<T extends HTMLElement>(
	id: string,
	type?: new () => T
): T {
	const element = document.getElementById(id);

	if (!element) {
		throw new DOMElementNotFoundError(id);
	}

	if (type && !(element instanceof type)) {
		throw new DOMElementTypeError(id, type.name, element.constructor.name);
	}

	return element as T;
}

/**
 * Recupere un element DOM ou null si non trouve
 */
export function getElementOrNull<T extends HTMLElement>(
	id: string,
	type?: new () => T
): T | null {
	try {
		return getElement(id, type);
	} catch {
		return null;
	}
}

/**
 * Raccourcis pour les types communs
 */
export const DOM = {
	input: (id: string) => getElement(id, HTMLInputElement),
	button: (id: string) => getElement(id, HTMLButtonElement),
	canvas: (id: string) => getElement(id, HTMLCanvasElement),
	div: (id: string) => getElement(id, HTMLDivElement),
	element: (id: string) => getElement(id),

	// Versions nullable
	inputOrNull: (id: string) => getElementOrNull(id, HTMLInputElement),
	elementOrNull: (id: string) => getElementOrNull(id)
};
