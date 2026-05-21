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
export default async function handler(req, res) {
  // Aici pui username-ul tău de GitHub
  const username = 'MasterX3'; 
  
  // Vercel va citi automat această variabilă din setările de securitate (Environment Variables)
  const token = process.env.GITHUB_TOKEN;

  try {
    // Cererea către GitHub API, folosind Token-ul pentru a ridica limita de request-uri
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub a răspuns cu eroarea: ${response.status}`);
    }

    const data = await response.json();
    
    // Trimitem datele (array-ul de proiecte) mai departe către frontend-ul tău
    res.status(200).json(data);

  } catch (error) {
    // Tratarea erorilor pentru cerința de UX/UI
    res.status(500).json({ 
      error: 'Nu am putut prelua proiectele', 
      details: error.message 
    });
  }
}