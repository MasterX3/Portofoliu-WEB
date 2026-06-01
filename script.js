document.addEventListener('DOMContentLoaded', () => {
    
    const reposContainer = document.getElementById('reposContainer');
    const searchInput = document.getElementById('searchInput');
    const loader = document.getElementById('loader');
    const errorBox = document.getElementById('errorBox');
    const errorMessage = document.getElementById('errorMessage');
    const loadMoreBtn = document.getElementById('loadMoreBtn'); // Am selectat butonul nou

    let allRepos = []; 
    let filteredRepos = []; // Aici ținem proiectele după ce am căutat ceva
    let currentDisplayCount = 6;

    async function fetchRepos() {
        try {
            const response = await fetch('/api/get-repos');

            if (!response.ok) {
                throw new Error('Nu am putut încărca proiectele momentan.');
            }

            const data = await response.json();


            allRepos = data
                .filter(repo => !repo.fork)
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));


            filteredRepos = [...allRepos];

            loader.classList.add('hidden');
            renderRepos();

        } catch (error) {
            loader.classList.add('hidden');
            errorBox.classList.remove('hidden');
            errorMessage.textContent = 'Ups! ' + error.message;
        }
    }

    function renderRepos() {
        reposContainer.innerHTML = ''; 

        if (filteredRepos.length === 0) {
            reposContainer.innerHTML = '<p class="col-span-full text-center text-gray-500 text-lg">Nu am găsit niciun proiect conform căutării.</p>';
            loadMoreBtn.classList.add('hidden');
            return;
        }

        const reposToShow = filteredRepos.slice(0, currentDisplayCount);

        reposToShow.forEach(repo => {
            const description = repo.description || 'Fără descriere disponibilă.';
            const language = repo.language || 'Nespecificat';

            const card = document.createElement('div');
            card.className = 'bg-white rounded-xl shadow border border-gray-100 p-6 flex flex-col hover:shadow-xl hover:border-teal-100 transition-all duration-300 transform hover:-translate-y-1';
            
            card.innerHTML = `
                <h4 class="text-xl font-bold text-gray-800 mb-2 truncate" title="${repo.name}">${repo.name}</h4>
                <p class="text-gray-600 text-sm flex-grow mb-4 leading-relaxed">${description}</p>
                
                <div class="flex items-center justify-between text-sm text-gray-500 mb-4 pt-4 border-t border-gray-100">
                    <span class="bg-teal-50 text-teal-800 py-1 px-3 rounded-full font-medium text-xs">${language}</span>
                    <div class="flex gap-3 items-center">
                        <span title="Stars" class="flex items-center gap-1">⭐ ${repo.stargazers_count}</span>
                        <span title="Forks" class="flex items-center gap-1">🍴 ${repo.forks_count}</span>
                    </div>
                </div>
                
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" 
                   class="inline-block text-center bg-gradient-to-r from-teal-600 to-sky-600 text-white py-2.5 px-4 rounded-lg hover:from-teal-700 hover:to-sky-700 transition-colors duration-200 font-semibold shadow">
                    Vezi Codul pe GitHub
                </a>
            `;
            
            reposContainer.appendChild(card);
        });

        // AFIȘĂM sau ASCUNDEM butonul de Load More în funcție de câte proiecte au mai rămas
        if (filteredRepos.length > currentDisplayCount) {
            loadMoreBtn.classList.remove('hidden');
        } else {
            loadMoreBtn.classList.add('hidden');
        }
    }

    // Funcționalitatea de Căutare
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        filteredRepos = allRepos.filter(repo => 
            repo.name.toLowerCase().includes(searchTerm) || 
            (repo.description && repo.description.toLowerCase().includes(searchTerm)) ||
            (repo.language && repo.language.toLowerCase().includes(searchTerm))
        );

        currentDisplayCount = 6; // Resetăm la 6 pe o căutare nouă
        renderRepos();
    });

    // EVENIMENT pentru butonul de Load More
    loadMoreBtn.addEventListener('click', () => {
        currentDisplayCount += 6;
        renderRepos(); // Redesenăm
    });

    fetchRepos();
});