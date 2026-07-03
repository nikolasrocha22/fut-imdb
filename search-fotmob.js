const teams = ['Brasil', 'Alemanha', 'Flamengo', 'Vasco', 'Cuiaba', 'America Mineiro', 'Fortaleza', 'Ponte Preta', 'Palmeiras', 'Corinthians', 'São Paulo', 'Grêmio', 'Internacional', 'Atletico Mineiro', 'Botafogo', 'Fluminense', 'Santos'];

async function search() {
  for (const t of teams) {
    try {
      const res = await fetch('https://www.fotmob.com/api/search?q=' + encodeURIComponent(t), {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
      });
      const data = await res.json();
      const id = data?.suggestedMatch?.id || data?.teams?.[0]?.id;
      console.log(t + ': ' + id);
    } catch (e) {
      console.log(t + ': error');
    }
  }
}
search();
