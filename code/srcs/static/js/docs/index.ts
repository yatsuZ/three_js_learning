/**
 * Documentation Viewer
 * Utilise Marked.js pour convertir le Markdown en HTML
 */

declare const marked: { parse: (markdown: string) => string };

// Logger simple pour le module docs (standalone)
const Logger = {
	info: (...args: unknown[]) => console.log('%c[INFO]', 'color: #2196F3', ...args),
	error: (...args: unknown[]) => console.error('%c[ERROR]', 'color: #F44336', ...args),
	success: (...args: unknown[]) => console.log('%c[OK]', 'color: #4CAF50', ...args)
};

// Configuration fetch
const FETCH_TIMEOUT = 5000;
const FETCH_RETRIES = 2;

// Helper DOM securise
function getElement(id: string): HTMLElement {
	const el = document.getElementById(id);
	if (!el) throw new Error(`Element #${id} introuvable`);
	return el;
}

// Elements DOM
const nav = getElement('docs-nav');
const content = getElement('docs-content');

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

/**
 * Fetch avec timeout
 */
async function fetchWithTimeout<T>(url: string, timeout: number = FETCH_TIMEOUT): Promise<T> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, { signal: controller.signal });
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}
		return await response.json() as T;
	} finally {
		clearTimeout(timeoutId);
	}
}

/**
 * Fetch avec retry automatique
 */
async function fetchWithRetry<T>(url: string, retries: number = FETCH_RETRIES): Promise<T> {
	let lastError: Error | null = null;

	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			return await fetchWithTimeout<T>(url);
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));
			if (attempt < retries) {
				await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
			}
		}
	}

	throw lastError;
}

// Charger la liste des fichiers de documentation
async function loadDocsList(): Promise<void> {
	try {
		const data = await fetchWithRetry<DocsListResponse>('/api/docs');

		if (data.success) {
			renderNavigation(data.categories);
			setupNavigationListeners();
			Logger.success('Documentation chargee');

			if (initialFile) {
				await loadDoc(initialFile);
			}
		}
	} catch (error) {
		nav.innerHTML = '<p class="error">Erreur de chargement</p>';
		Logger.error('Erreur chargement liste docs:', error);
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
		const data = await fetchWithRetry<DocContentResponse>(`/api/docs/${filename}`);

		if (data.success) {
			content.innerHTML = marked.parse(data.content);
			content.scrollTop = 0;
			Logger.info(`Document charge: ${filename}`);
		} else {
			content.innerHTML = '<p class="error">Fichier non trouve</p>';
		}
	} catch (error) {
		content.innerHTML = '<p class="error">Erreur de chargement</p>';
		Logger.error('Erreur chargement doc:', error);
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
Logger.success('Documentation viewer initialise');
