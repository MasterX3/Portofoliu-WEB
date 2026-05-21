export default async function handler(req, res) {

  const username = 'MasterX3'; 
  
  const token = process.env.GITHUB_TOKEN;

  try {
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
    
    res.status(200).json(data);

  } catch (error) {
    // Tratarea erorilor pentru cerința de UX/UI
    res.status(500).json({ 
      error: 'Nu am putut prelua proiectele', 
      details: error.message 
    });
  }
}