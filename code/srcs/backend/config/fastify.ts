import Fastify, { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import ejs from 'ejs';
import path from 'path';
import { showLog } from '../utils/logger.js';
import { setupRoutes } from '../routes/index.js';

export async function buildFastify(): Promise<FastifyInstance> {
	const fastify = Fastify({
		logger: showLog(),
	});

	// Templates EJS
	await fastify.register(fastifyView, {
		engine: { ejs },
		root: path.join(process.cwd(), 'srcs/static/views'),
	});

	// Fichiers statiques (CSS, JS)
	await fastify.register(fastifyStatic, {
		root: path.join(process.cwd(), 'srcs/static'),
		prefix: '/static/',
	});

	// Setup des routes
	await setupRoutes(fastify);

	return fastify;
}
