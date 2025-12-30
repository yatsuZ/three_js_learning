"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
const health_js_1 = require("./api/health.js");
const env_js_1 = require("./api/env.js");
const docs_js_1 = require("./api/docs.js");
async function setupRoutes(fastify) {
    // Routes API
    await fastify.register(health_js_1.healthRoutes, { prefix: '/api' });
    await fastify.register(env_js_1.envRoutes, { prefix: '/api' });
    await fastify.register(docs_js_1.docsRoutes, { prefix: '/api' });
    // Route principale (hub)
    fastify.get('/', async (request, reply) => {
        return reply.view('index.ejs');
    });
    // Routes des lecons
    fastify.get('/lesson/:id', async (request, reply) => {
        const { id } = request.params;
        return reply.view(`lessons/${id}.ejs`);
    });
    // Route documentation
    fastify.get('/docs', async (request, reply) => {
        return reply.view('docs.ejs');
    });
    fastify.get('/docs/:filename', async (request, reply) => {
        const { filename } = request.params;
        return reply.view('docs.ejs', { filename });
    });
    // 404 handler
    fastify.setNotFoundHandler(async (request, reply) => {
        if (request.url.startsWith('/api/')) {
            return reply.code(404).send({ success: false, error: 'API endpoint not found' });
        }
        return reply.view('index.ejs');
    });
}
//# sourceMappingURL=index.js.map