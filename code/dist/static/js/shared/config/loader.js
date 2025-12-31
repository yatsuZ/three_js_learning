var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchWithRetry } from "../utils/fetch.js";
import { Logger } from "../utils/logger.js";
const DEFAULT_CONFIG = {
    maxCubes: 1000
};
let config = Object.assign({}, DEFAULT_CONFIG);
/**
 * Charge la configuration depuis l'API avec retry automatique
 */
export function loadConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const data = yield fetchWithRetry('/api/config', {
                timeout: 3000,
                retries: 2
            });
            config = {
                maxCubes: (_a = data.maxCubes) !== null && _a !== void 0 ? _a : DEFAULT_CONFIG.maxCubes
            };
            Logger.success(`Config chargee: MAX_CUBES = ${config.maxCubes}`);
        }
        catch (error) {
            Logger.warn('Impossible de charger la config, utilisation des valeurs par defaut');
            config = Object.assign({}, DEFAULT_CONFIG);
        }
        return config;
    });
}
export function getConfig() {
    return config;
}
export function getMaxCubes() {
    return config.maxCubes;
}
