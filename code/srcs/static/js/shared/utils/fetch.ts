/**
 * Utilitaires fetch avec timeout et retry
 */

import { Logger } from './logger.ts';

export interface FetchOptions extends RequestInit {
	timeout?: number;
	retries?: number;
	retryDelay?: number;
}

const DEFAULT_TIMEOUT = 5000;
const DEFAULT_RETRIES = 2;
const DEFAULT_RETRY_DELAY = 1000;

/**
 * Fetch avec timeout
 */
async function fetchWithTimeout(
	url: string,
	options: RequestInit = {},
	timeout: number = DEFAULT_TIMEOUT
): Promise<Response> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal
		});
		return response;
	} finally {
		clearTimeout(timeoutId);
	}
}

/**
 * Delai entre les retries (avec backoff exponentiel)
 */
function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch avec timeout et retry automatique
 */
export async function fetchWithRetry<T>(
	url: string,
	options: FetchOptions = {}
): Promise<T> {
	const {
		timeout = DEFAULT_TIMEOUT,
		retries = DEFAULT_RETRIES,
		retryDelay = DEFAULT_RETRY_DELAY,
		...fetchOptions
	} = options;

	let lastError: Error | null = null;

	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const response = await fetchWithTimeout(url, fetchOptions, timeout);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			return await response.json() as T;
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));

			// Ne pas retry si c'est une erreur 4xx (client error)
			if (lastError.message.startsWith('HTTP 4')) {
				throw lastError;
			}

			if (attempt < retries) {
				const waitTime = retryDelay * Math.pow(2, attempt);
				Logger.warn(`Fetch ${url} failed, retry ${attempt + 1}/${retries} in ${waitTime}ms`);
				await delay(waitTime);
			}
		}
	}

	Logger.error(`Fetch ${url} failed after ${retries + 1} attempts`);
	throw lastError;
}

/**
 * Fetch simple avec timeout (sans retry)
 */
export async function safeFetch<T>(
	url: string,
	options: FetchOptions = {}
): Promise<{ data: T | null; error: Error | null }> {
	try {
		const data = await fetchWithRetry<T>(url, { ...options, retries: 0 });
		return { data, error: null };
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error : new Error(String(error))
		};
	}
}
