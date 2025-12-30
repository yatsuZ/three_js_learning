/**
 * Documentation Viewer
 * Utilise Marked.js pour convertir le Markdown en HTML
 */

declare const marked: { parse: (markdown: string) => string };

// Elements DOM
const nav = document.getElementById('docs-nav') as HTMLElement;
const content = document.getElementById('docs-content') as HTMLElement;

// Recuperer le filename depuis l'attribut data du body
const initialFile = document.body.dataset.initialFile || '';

interface DocFile {
	name: string;
	title: string;
}

interface DocCategory {
	name: string;
	files: DocFile[];
}

interface DocsListResponse {
	success: boolean;
	categories: DocCategory[];
}

interface DocContentResponse {
	success: boolean;
	content: string;
}

// Charger la liste des fichiers de documentation
async function loadDocsList(): Promise<void> {
	try {
		const response = await fetch('/api/docs');
		const data: DocsListResponse = await response.json();

		if (data.success) {
			renderNavigation(data.categories);
			setupNavigationListeners();

			if (initialFile) {
				await loadDoc(initialFile);
			}
		}
	} catch (error) {
		nav.innerHTML = '<p class="error">Erreur de chargement</p>';
		console.error('Erreur chargement liste docs:', error);
	}
}

// Afficher la navigation avec categories
function renderNavigation(categories: DocCategory[]): void {
	nav.innerHTML = categories.map(category => `
		<div class="nav-category">
			<h3 class="nav-category-title">${category.name}</h3>
			${category.files.map(file => `
				<a href="/docs/${file.name}"
				   class="nav-item ${file.name === initialFile ? 'active' : ''}"
				   data-file="${file.name}">
					${file.title}
				</a>
			`).join('')}
		</div>
	`).join('');
}

// Configurer les event listeners sur la navigation
function setupNavigationListeners(): void {
	nav.querySelectorAll('.nav-item').forEach(item => {
		item.addEventListener('click', async (e) => {
			e.preventDefault();

			const link = item as HTMLAnchorElement;
			const filename = link.dataset.file;

			if (filename) {
				await loadDoc(filename);
				history.pushState({}, '', `/docs/${filename}`);
				updateActiveState(filename);
			}
		});
	});
}

// Mettre a jour l'etat actif
function updateActiveState(filename: string): void {
	nav.querySelectorAll('.nav-item').forEach(item => {
		const link = item as HTMLAnchorElement;
		if (link.dataset.file === filename) {
			link.classList.add('active');
		} else {
			link.classList.remove('active');
		}
	});
}

// Charger un fichier de documentation
async function loadDoc(filename: string): Promise<void> {
	content.innerHTML = '<p class="loading">Chargement...</p>';

	try {
		const response = await fetch(`/api/docs/${filename}`);
		const data: DocContentResponse = await response.json();

		if (data.success) {
			content.innerHTML = marked.parse(data.content);
			content.scrollTop = 0;
		} else {
			content.innerHTML = '<p class="error">Fichier non trouve</p>';
		}
	} catch (error) {
		content.innerHTML = '<p class="error">Erreur de chargement</p>';
		console.error('Erreur chargement doc:', error);
	}
}

// Gerer la navigation avec les boutons precedent/suivant
window.addEventListener('popstate', async () => {
	const match = window.location.pathname.match(/\/docs\/(.+)/);

	if (match) {
		const filename = match[1];
		await loadDoc(filename);
		updateActiveState(filename);
	}
});

// Initialisation
loadDocsList();
console.log('Documentation viewer loaded!');
