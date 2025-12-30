import { FastifyInstance } from 'fastify';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const DOCS_PATH = join(process.cwd(), 'documentation');

export async function docsRoutes(fastify: FastifyInstance) {
	// Liste tous les fichiers de documentation
	fastify.get('/docs', async () => {
		try {
			const files = readdirSync(DOCS_PATH)
				.filter(f => f.endsWith('.md'))
				.map(f => ({
					filename: f,
					name: f.replace('.md', ''),
					title: formatTitle(f.replace('.md', ''))
				}));
			return { success: true, files };
		} catch (error) {
			return { success: false, error: 'Documentation folder not found' };
		}
	});

	// Récupère un fichier de documentation spécifique
	fastify.get('/docs/:filename', async (request, reply) => {
		const { filename } = request.params as { filename: string };
		const safeName = filename.replace(/[^a-zA-Z0-9-_]/g, '');
		const filePath = join(DOCS_PATH, `${safeName}.md`);

		if (!existsSync(filePath)) {
			return reply.code(404).send({ success: false, error: 'File not found' });
		}

		try {
			const content = readFileSync(filePath, 'utf-8');
			return { success: true, filename: safeName, content };
		} catch (error) {
			return reply.code(500).send({ success: false, error: 'Failed to read file' });
		}
	});
}

function formatTitle(name: string): string {
	// "01-cube" -> "01 - Cube"
	// "resources-glb-gltf" -> "Resources GLB GLTF"
	return name
		.split('-')
		.map((part, i) => {
			if (i === 0 && /^\d+$/.test(part)) return part;
			return part.charAt(0).toUpperCase() + part.slice(1);
		})
		.join(' ')
		.replace(/(\d+)\s/, '$1 - ');
}
