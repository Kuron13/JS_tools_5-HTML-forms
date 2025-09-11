import puppeteer from 'puppeteer';
import { fork } from "child_process";

describe('Page start', () => {
  let browser;
  let page;
  let server;

  beforeAll(async () => {
    server = fork(`${__dirname}/server.e2e.js`);
    await new Promise((resolve, reject) => {
      server.on("error", reject);
      server.on("message", (message) => {
        if (message === "ok") {
          resolve();
        }
      });
    });
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-javascript',
        '--disable-gpu',
        '--disable-features=AllWebKitFeatures'
      ],
      timeout: 60000
    });

    page = await browser.newPage();
  }, 60000);

  test('test', async () => {
    await page.goto('http://localhost:8080');

    await page.waitForSelector('body');
  }, 50000);

  afterAll(async () => {
    await browser.close();
    server.kill();
  }, 50000)

});
