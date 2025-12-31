/**
 * Utilitaires fetch avec timeout et retry
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Logger } from "./logger.js";
const DEFAULT_TIMEOUT = 5000;
const DEFAULT_RETRIES = 2;
const DEFAULT_RETRY_DELAY = 1000;
/**
 * Fetch avec timeout
 */
function fetchWithTimeout(url_1) {
    return __awaiter(this, arguments, void 0, function* (url, options = {}, timeout = DEFAULT_TIMEOUT) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        try {
            const response = yield fetch(url, Object.assign(Object.assign({}, options), { signal: controller.signal }));
            return response;
        }
        finally {
            clearTimeout(timeoutId);
        }
    });
}
/**
 * Delai entre les retries (avec backoff exponentiel)
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Fetch avec timeout et retry automatique
 */
export function fetchWithRetry(url_1) {
    return __awaiter(this, arguments, void 0, function* (url, options = {}) {
        const { timeout = DEFAULT_TIMEOUT, retries = DEFAULT_RETRIES, retryDelay = DEFAULT_RETRY_DELAY } = options, fetchOptions = __rest(options, ["timeout", "retries", "retryDelay"]);
        let lastError = null;
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = yield fetchWithTimeout(url, fetchOptions, timeout);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return yield response.json();
            }
            catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                // Ne pas retry si c'est une erreur 4xx (client error)
                if (lastError.message.startsWith('HTTP 4')) {
                    throw lastError;
                }
                if (attempt < retries) {
                    const waitTime = retryDelay * Math.pow(2, attempt);
                    Logger.warn(`Fetch ${url} failed, retry ${attempt + 1}/${retries} in ${waitTime}ms`);
                    yield delay(waitTime);
                }
            }
        }
        Logger.error(`Fetch ${url} failed after ${retries + 1} attempts`);
        throw lastError;
    });
}
/**
 * Fetch simple avec timeout (sans retry)
 */
export function safeFetch(url_1) {
    return __awaiter(this, arguments, void 0, function* (url, options = {}) {
        try {
            const data = yield fetchWithRetry(url, Object.assign(Object.assign({}, options), { retries: 0 }));
            return { data, error: null };
        }
        catch (error) {
            return {
                data: null,
                error: error instanceof Error ? error : new Error(String(error))
            };
        }
    });
}
