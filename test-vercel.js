const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log('Navigating to Vercel app...');
  await page.goto('https://fut-imdb-client.vercel.app/', { waitUntil: 'networkidle' });
  
  console.log('Done.');
  await browser.close();
})();
