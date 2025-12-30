"use strict";
/**
 * Documentation Viewer
 * Utilise Marked.js pour convertir le Markdown en HTML
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Elements DOM
const nav = document.getElementById('docs-nav');
const content = document.getElementById('docs-content');
// Recuperer le filename depuis l'attribut data du body
const initialFile = document.body.dataset.initialFile || '';
// Charger la liste des fichiers de documentation
function loadDocsList() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('/api/docs');
            const data = yield response.json();
            if (data.success) {
                renderNavigation(data.categories);
                setupNavigationListeners();
                if (initialFile) {
                    yield loadDoc(initialFile);
                }
            }
        }
        catch (error) {
            nav.innerHTML = '<p class="error">Erreur de chargement</p>';
            console.error('Erreur chargement liste docs:', error);
        }
    });
}
// Afficher la navigation avec categories
function renderNavigation(categories) {
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
function setupNavigationListeners() {
    nav.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const link = item;
            const filename = link.dataset.file;
            if (filename) {
                yield loadDoc(filename);
                history.pushState({}, '', `/docs/${filename}`);
                updateActiveState(filename);
            }
        }));
    });
}
// Mettre a jour l'etat actif
function updateActiveState(filename) {
    nav.querySelectorAll('.nav-item').forEach(item => {
        const link = item;
        if (link.dataset.file === filename) {
            link.classList.add('active');
        }
        else {
            link.classList.remove('active');
        }
    });
}
// Charger un fichier de documentation
function loadDoc(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        content.innerHTML = '<p class="loading">Chargement...</p>';
        try {
            const response = yield fetch(`/api/docs/${filename}`);
            const data = yield response.json();
            if (data.success) {
                content.innerHTML = marked.parse(data.content);
                content.scrollTop = 0;
            }
            else {
                content.innerHTML = '<p class="error">Fichier non trouve</p>';
            }
        }
        catch (error) {
            content.innerHTML = '<p class="error">Erreur de chargement</p>';
            console.error('Erreur chargement doc:', error);
        }
    });
}
// Gerer la navigation avec les boutons precedent/suivant
window.addEventListener('popstate', () => __awaiter(void 0, void 0, void 0, function* () {
    const match = window.location.pathname.match(/\/docs\/(.+)/);
    if (match) {
        const filename = match[1];
        yield loadDoc(filename);
        updateActiveState(filename);
    }
}));
// Initialisation
loadDocsList();
console.log('Documentation viewer loaded!');
