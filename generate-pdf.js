const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/home/cynthia/.cloakbrowser/chromium-142.0.7444.175/chrome',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
    ],
  });

  const page = await browser.newPage();
  const htmlPath = path.resolve(__dirname, 'case-study-urbn.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });

  await page.pdf({
    path: path.resolve(__dirname, 'case-study-urbn-catering.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '16mm', bottom: '16mm', left: '12mm', right: '12mm' },
  });

  await browser.close();
  console.log('PDF generated: case-study-urbn-catering.pdf');
})();
