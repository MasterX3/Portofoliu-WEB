# 🚀 Portofoliu Web Dinamic (GitHub API Integration)

Acest proiect reprezintă un portofoliu web personalizat, dezvoltat ca proiect de semestru. Aplicația este un Single Page Application (SPA) care se integrează dinamic cu API-ul oficial GitHub pentru a prelua, filtra și afișa repository-urile personale sub formă de carduri interactive.

🔗 **[Vezi proiectul Live aici](https://portofoliu-web.vercel.app/)**

---

## ✨ Funcționalități Implementate

Proiectul atinge toate cerințele de bază, medii și avansate:

### 1. Arhitectură și Design (Cerințe Obligatorii)
* **Secțiune Profil:** Prezentare personalizată, rol, experiență și educație.
* **UI/UX Responsiv:** Design modern, colorat și complet responsiv (Mobile/Tablet/Desktop) realizat cu **Tailwind CSS**.
* **Integrare API:** Preluare asincronă a proiectelor via `https://api.github.com/users/MasterX3/repos`.
* **Detalii Proiecte:** Fiecare card conține nume, descriere, limbaj principal, număr de stele (⭐), fork-uri (🍴) și link direct către codul sursă.

### 2. Manipularea Datelor (Cerințe Medii)
* **Filtrare Fork-uri:** Proiectele afișate sunt strict cele originale (`fork === false`).
* **Sortare:** Repository-urile sunt ordonate cronologic, după data ultimei actualizări (`updated_at`).
* **Live Search:** Bară de căutare implementată pe client-side care filtrează proiectele în timp real după nume, descriere sau limbaj, fără a reîncărca pagina.
* **Loading & Error Handling:** Spinner de încărcare pe durata request-ului și afișarea unui mesaj prietenos de eroare (ex. HTTP 401/404/500) în caz de eșec al API-ului.

### 3. Backend & Securitate (Cerințe Avansate / Nota 10)
* **Arhitectură Serverless / Proxy:** Pentru a securiza un eventual Personal Access Token (PAT) și a evita expunerea acestuia în browser, a fost creat un mini-server proxy folosind **Vercel Serverless Functions** (fișierul `api/get-repos.js`).
* **Sistem de Paginare ("Load More"):** Inițial sunt afișate doar primele 6 proiecte. Butonul "Load More" încarcă dinamic restul proiectelor în DOM, pentru a nu aglomera interfața.
* **Deploy Automat:** Proiectul este hostat live pe Vercel, beneficiind de CI/CD la fiecare commit.

---

## 🛠️ Tehnologii Folosite

* **Frontend:** HTML5, JavaScript (Vanilla ES6+), Tailwind CSS (via CDN)
* **Backend (Proxy):** Node.js (Vercel Serverless Functions)
* **API:** RESTful GitHub API v3
* **Hosting:** Vercel

---

## 💻 Instalare și Rulare Locală

Dacă doriți să rulați acest proiect pe mașina locală:

1. **Clonați repository-ul:**
   ```bash
   git clone [https://github.com/MasterX3/Portofoliu-WEB.git](https://github.com/MasterX3/Portofoliu-WEB.git)
   ```

2. **Navigați în directorul proiectului:**
   ```bash
   cd Portofoliu-WEB
   ```

3. **Pentru a rula interfața simplă:** Puteți deschide direct fișierul `index.html` în browser sau puteți folosi o extensie precum *Live Server* în VS Code.

4. **Pentru a testa mediul Serverless local (Opțional):**
   * Instalați Vercel CLI: `npm i -g vercel`
   * Rulați comanda `vercel dev` în terminalul proiectului. Aplicația va fi servită pe `localhost:3000`, simulând mediul de producție.
