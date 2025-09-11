import puppeteer from 'puppeteer';
import { fork } from "child_process";

describe('Page start', () => {
  let browser;
  let page;
  let server;

  beforeAll(async () => {
    server = fork(`${../server/server.e2e.js}`);
    await new Promise((resolve, reject) => {
      server.on("error", reject);
      server.on("message", (message) => {
        if (message === "ok") {
          resolve();
        }
      });
    });
    
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
    server.kill();
  }, 20000)

});
