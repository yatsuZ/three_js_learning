import { fetchWithRetry } from '../utils/fetch.ts';
import { Logger } from '../utils/logger.ts';

export interface AppConfig {
	maxCubes: number;
}

interface ConfigResponse {
	maxCubes: number;
}

const DEFAULT_CONFIG: AppConfig = {
	maxCubes: 1000
};

let config: AppConfig = { ...DEFAULT_CONFIG };

/**
 * Charge la configuration depuis l'API avec retry automatique
 */
export async function loadConfig(): Promise<AppConfig> {
	try {
		const data = await fetchWithRetry<ConfigResponse>('/api/config', {
			timeout: 3000,
			retries: 2
		});
		config = {
			maxCubes: data.maxCubes ?? DEFAULT_CONFIG.maxCubes
		};
		Logger.success(`Config chargee: MAX_CUBES = ${config.maxCubes}`);
	} catch (error) {
		Logger.warn('Impossible de charger la config, utilisation des valeurs par defaut');
		config = { ...DEFAULT_CONFIG };
	}
	return config;
}

export function getConfig(): AppConfig {
	return config;
}

export function getMaxCubes(): number {
	return config.maxCubes;
}
