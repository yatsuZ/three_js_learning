export interface AppConfig {
	maxCubes: number;
}

const DEFAULT_CONFIG: AppConfig = {
	maxCubes: 1000
};

let config: AppConfig = { ...DEFAULT_CONFIG };

export async function loadConfig(): Promise<AppConfig> {
	try {
		const response = await fetch('/api/config');
		const data = await response.json();
		config = {
			maxCubes: data.maxCubes ?? DEFAULT_CONFIG.maxCubes
		};
		console.log(`Config chargee: MAX_CUBES = ${config.maxCubes}`);
	} catch (error) {
		console.warn('Impossible de charger la config, utilisation des valeurs par defaut');
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
