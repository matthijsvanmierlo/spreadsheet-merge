const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  fs.readFile('index.html', (err, data) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data);
  });
});

server.listen(0, async () => {
  const port = server.address().port;
  console.log(`Server listening on port ${port}`);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}`);

  // Test Missing helper error
  await page.click('#btn-load-example');
  await page.waitForTimeout(500);

  const previewText = await page.$eval('#preview-content', el => el.innerText);
  if (previewText.includes('Missing helper')) {
    console.error('Test Failed: Missing helper error found in preview.');
    process.exit(1);
  }

  if (!previewText.includes('Jane Doe') || !previewText.includes('Manager')) {
      console.error('Test Failed: Variables not correctly replaced in preview.');
      console.error(previewText);
      process.exit(1);
  }
  console.log('Template Preview Test Passed.');

  // Check template management UI
  const importInput = await page.$('#template-file');
  const exportBtn = await page.$('#btn-export-template');

  if (!importInput || !exportBtn) {
      console.error('Test Failed: Template management UI not found.');
      process.exit(1);
  }
  console.log('Template UI Test Passed.');

  await browser.close();
  server.close();
});
