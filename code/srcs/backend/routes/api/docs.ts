import { FastifyInstance } from 'fastify';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const DOCS_PATH = join(process.cwd(), 'documentation');

interface DocFile {
	name: string;
	title: string;
}

interface DocCategory {
	name: string;
	files: DocFile[];
}

export async function docsRoutes(fastify: FastifyInstance) {
	// Liste tous les fichiers de documentation groupes par categorie
	fastify.get('/docs', async () => {
		try {
			const allFiles = readdirSync(DOCS_PATH)
				.filter(f => f.endsWith('.md') && f !== 'README.md');

			const categories: DocCategory[] = [
				{
					name: 'Introduction',
					files: allFiles
						.filter(f => !f.match(/^\d+-/) && !f.startsWith('resources'))
						.map(f => ({
							name: f.replace('.md', ''),
							title: formatTitle(f.replace('.md', ''))
						}))
						.sort((a, b) => getIntroOrder(a.name) - getIntroOrder(b.name))
				},
				{
					name: 'Lecons',
					files: allFiles
						.filter(f => f.match(/^\d+-/))
						.map(f => ({
							name: f.replace('.md', ''),
							title: formatTitle(f.replace('.md', ''))
						}))
						.sort((a, b) => a.name.localeCompare(b.name))
				},
				{
					name: 'Ressources',
					files: allFiles
						.filter(f => f.startsWith('resources'))
						.map(f => ({
							name: f.replace('.md', ''),
							title: formatTitle(f.replace('.md', ''))
						}))
				}
			];

			// Filtrer les categories vides
			const nonEmptyCategories = categories.filter(c => c.files.length > 0);

			return { success: true, categories: nonEmptyCategories };
		} catch (error) {
			return { success: false, error: 'Documentation folder not found' };
		}
	});

	// Recupere un fichier de documentation specifique
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

// Ordre des fichiers d'introduction
function getIntroOrder(name: string): number {
	const order: Record<string, number> = {
		'motivation': 1,
		'technologies': 2,
		'threejs': 3,
		'webgl': 4,
		'cdn': 5
	};
	return order[name] || 99;
}

function formatTitle(name: string): string {
	// Cas speciaux
	const specialTitles: Record<string, string> = {
		'motivation': 'Motivation',
		'technologies': 'Technologies',
		'threejs': 'Three.js',
		'webgl': 'WebGL',
		'cdn': 'CDN',
		'resources-glb-gltf': 'Ressources GLB/glTF'
	};

	if (specialTitles[name]) return specialTitles[name];

	// "01-cube" -> "01 - Cube"
	return name
		.split('-')
		.map((part, i) => {
			if (i === 0 && /^\d+$/.test(part)) return part;
			return part.charAt(0).toUpperCase() + part.slice(1);
		})
		.join(' ')
		.replace(/(\d+)\s/, '$1 - ');
}
