// Așteptăm ca tot HTML-ul să se încarce înainte de a rula scriptul
document.addEventListener('DOMContentLoaded', () => {
    
    // Selectăm elementele din pagină
    const reposContainer = document.getElementById('reposContainer');
    const searchInput = document.getElementById('searchInput');
    const loader = document.getElementById('loader');
    const errorBox = document.getElementById('errorBox');
    const errorMessage = document.getElementById('errorMessage');

    let allRepos = []; // Aici vom păstra toate proiectele originale

    // Funcția principală care aduce datele
    async function fetchRepos() {
        try {
            // Facem request către mini-serverul tău de pe Vercel
            // Dacă testezi fără Vercel momentan, poți pune temporar linkul direct de la GitHub:
            // 'https://api.github.com/users/USERNAME_UL_TAU/repos'
            const response = await fetch('/api/get-repos');

            if (!response.ok) {
                throw new Error('Nu am putut încărca proiectele momentan.');
            }

            const data = await response.json();

            // Filtrăm fork-urile și sortăm după data actualizării (cele mai noi primele)
            allRepos = data
                .filter(repo => !repo.fork)
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

            // Ascundem loader-ul și afișăm proiectele
            loader.classList.add('hidden');
            renderRepos(allRepos);

        } catch (error) {
            loader.classList.add('hidden');
            errorBox.classList.remove('hidden');
            errorMessage.textContent = 'Ups! ' + error.message;
        }
    }

    // Funcția care desenează cardurile pe ecran
    function renderRepos(repos) {
        reposContainer.innerHTML = ''; // Curățăm containerul

        if (repos.length === 0) {
            reposContainer.innerHTML = '<p class="col-span-full text-center text-gray-500">Nu am găsit niciun proiect conform căutării.</p>';
            return;
        }

        repos.forEach(repo => {
            // Descriere default dacă lipsește
            const description = repo.description || 'Fără descriere disponibilă.';
            const language = repo.language || 'Nespecificat';

            // Creăm structura HTML pentru un card
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow border border-gray-200 p-6 flex flex-col hover:shadow-lg transition-shadow duration-300';
            
            card.innerHTML = `
                <h4 class="text-xl font-bold text-gray-800 mb-2 truncate" title="${repo.name}">${repo.name}</h4>
                <p class="text-gray-600 text-sm flex-grow mb-4">${description}</p>
                
                <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span class="bg-blue-100 text-blue-800 py-1 px-2 rounded font-medium">${language}</span>
                    <div class="flex gap-3">
                        <span title="Stars">⭐ ${repo.stargazers_count}</span>
                        <span title="Forks">🍴 ${repo.forks_count}</span>
                    </div>
                </div>
                
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" 
                   class="inline-block text-center bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200">
                    Vezi Codul
                </a>
            `;
            
            reposContainer.appendChild(card);
        });
    }

    // Funcționalitatea de Căutare (Live Search)
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        const filteredRepos = allRepos.filter(repo => 
            repo.name.toLowerCase().includes(searchTerm) || 
            (repo.description && repo.description.toLowerCase().includes(searchTerm)) ||
            (repo.language && repo.language.toLowerCase().includes(searchTerm))
        );

        renderRepos(filteredRepos);
    });

    // Pornim aplicația
    fetchRepos();
});