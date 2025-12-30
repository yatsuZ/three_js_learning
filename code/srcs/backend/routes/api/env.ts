import { FastifyInstance } from 'fastify';
import { Logger } from '../../utils/logger.js';

// Valeur par defaut si pas defini dans .env
const DEFAULT_MAX_CUBES = 1000;

export async function envRoutes(fastify: FastifyInstance) {
	fastify.get('/env', async () => {
		const envVars = {
			NODE_ENV: process.env.NODE_ENV,
			PORT: process.env.PORT,
			MAX_CUBES: parseInt(process.env.MAX_CUBES || '') || DEFAULT_MAX_CUBES,
		};

		Logger.info('Variables d\'environnement:');
		console.log(envVars);

		return envVars;
	});

	// Route specifique pour MAX_CUBES (plus simple a appeler)
	fastify.get('/config', async () => {
		return {
			maxCubes: parseInt(process.env.MAX_CUBES || '') || DEFAULT_MAX_CUBES,
		};
	});
}
