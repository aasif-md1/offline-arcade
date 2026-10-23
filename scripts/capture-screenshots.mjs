import puppeteer from 'puppeteer-core';
import path from 'node:path';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 900, height: 620, deviceScaleFactor: 2 });

// 1. Force light mode first for menu-light.png
await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
await page.goto('http://localhost:8089/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: 'docs/menu-light.png' });
console.log('Saved docs/menu-light.png (Light Mode)');

// 2. Dark mode for menu-dark.png
await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
await page.reload({ waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: 'docs/menu-dark.png' });
console.log('Saved docs/menu-dark.png (Dark Mode)');

// 3. Gameplay shots in clean light mode
await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
await page.reload({ waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 400));

async function captureGame(index, filename, waitMs = 1000) {
  const cards = await page.$$('.card');
  if (cards[index]) {
    await cards[index].click();
    await new Promise(r => setTimeout(r, 300));
    await page.keyboard.press('Space');
    await new Promise(r => setTimeout(r, waitMs));
    await page.screenshot({ path: path.join('docs', filename) });
    console.log(`Saved docs/${filename}`);
    await page.click('#back');
    await new Promise(r => setTimeout(r, 300));
  }
}

await captureGame(0, 'runner.png', 1400);
await captureGame(3, 'hopper.png', 900);
await captureGame(1, 'snake.png', 700);
await captureGame(2, 'flappy.png', 700);

await browser.close();
console.log('All screenshots completed successfully!');
process.exit(0);
