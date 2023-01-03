const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Users/yang/Downloads/spider/chapter1/Chromium.app/Contents/MacOS/Chromium',
    args: ['--no-sandbox'],
    headless: false,
    dumpio: false 
  });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({path: 'example.png'});
  await browser.close();

// (async () => {
//     const browser = await puppeteer.launch()
//     const page = await browser.newPage()
//     await page.goto('https://website.com')
  
})();