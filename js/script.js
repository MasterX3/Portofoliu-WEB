document.addEventListener('DOMContentLoaded', () => {
    
    const reposContainer = document.getElementById('reposContainer');

    if(reposContainer) {
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
                card.className = 'bg-white rounded-xl shadow border border-gray-100 p-6 flex flex-col hover:shadow-xl hover:border-red-100 transition-all duration-300 transform hover:-translate-y-1';
                
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
    }

    // --- 1. Logica pentru Meniul Hamburger (Mobile) ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            // Comută vizibilitatea meniului pe ecrane mici
            navMenu.classList.toggle('hidden');
            navMenu.classList.toggle('flex');
        });
    }

    // --- 2. Logica pentru Formularul de Contact ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Oprim trimiterea standard a paginii
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Regex pentru validare email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let errors = [];

            if (name.length < 3) {
                errors.push("Numele trebuie să conțină cel puțin 3 caractere.");
            }
            if (!emailRegex.test(email)) {
                errors.push("Te rog să introduci o adresă de email validă.");
            }
            if (message.length < 10) {
                errors.push("Mesajul trebuie să fie mai detaliat (minim 10 caractere).");
            }

            // Afișăm erorile sau succesul
            formStatus.classList.remove('hidden');
            
            if (errors.length > 0) {
                formStatus.className = 'mb-6 p-4 rounded-lg font-medium text-sm text-center bg-red-100 text-red-700 border border-red-200 block';
                formStatus.innerHTML = errors.join('<br>');
            } else {
                formStatus.className = 'mb-6 p-4 rounded-lg font-medium text-sm text-center bg-green-100 text-green-700 border border-green-200 block';
                formStatus.textContent = 'Mesajul a fost trimis cu succes! Te voi contacta în curând.';
                contactForm.reset(); // Golim câmpurile
            }
        });
    }

    // --- 3. Animații la Scroll (Fade-In) ---
    const faders = document.querySelectorAll('.fade-in');
    
    // Setăm senzorul să declanșeze animația când elementul e 15% vizibil pe ecran
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return; // Dacă nu e pe ecran, nu facem nimic
            } else {
                entry.target.classList.add('visible'); // Adăugăm clasa care face elementul vizibil
                appearOnScroll.unobserve(entry.target); // Oprim senzorul ca să nu se anime de 100 de ori
            }
        });
    }, appearOptions);

    // Atașăm senzorul pe fiecare element care are clasa .fade-in
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

});