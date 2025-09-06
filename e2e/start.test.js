import puppeteer from 'puppeteer';

describe('Page start', () => {
  let browser;
  let page;

  beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      devtools: true,
    });

    page = await browser.newPage();
  }, 20000);

  test('test', async () => {
    await page.goto('http://localhost:8080');

    await page.waitForSelector('body');
  }, 20000);

  afterAll(async () => {
    await browser.close();
  }, 20000)

});