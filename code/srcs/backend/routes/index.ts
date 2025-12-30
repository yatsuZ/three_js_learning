import { FastifyInstance } from 'fastify';
import { healthRoutes } from './api/health.js';
import { envRoutes } from './api/env.js';

export async function setupRoutes(fastify: FastifyInstance) {
	// Routes API
	await fastify.register(healthRoutes, { prefix: '/api' });
	await fastify.register(envRoutes, { prefix: '/api' });

	// Route principale (hub)
	fastify.get('/', async (request, reply) => {
		return reply.view('index.ejs');
	});

	// Routes des lecons
	fastify.get('/lesson/:id', async (request, reply) => {
		const { id } = request.params as { id: string };
		return reply.view(`lessons/${id}.ejs`);
	});

	// 404 handler
	fastify.setNotFoundHandler(async (request, reply) => {
		if (request.url.startsWith('/api/')) {
			return reply.code(404).send({ success: false, error: 'API endpoint not found' });
		}
		return reply.view('index.ejs');
	});
}
