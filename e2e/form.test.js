import puppeteer from 'puppeteer';
import { fork } from "child_process";

describe('Form with buttons', () => {
  let browser;
  let page;
  let server;

  beforeAll(async () => {
    server = fork(`${./server/server.e2e.js}`);
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


  test('Form should render on page start', async () => {
    await page.goto('http://localhost:8080');

    await page.waitForSelector('form');
  }, 20000);



  test('If buttons have a popover, should render tooltip', async () => {
    await page.goto('http://localhost:8080');
    await page.waitForSelector('form');
    const form = await page.$('.form')
    const buttons = await form.$$('.btn')
    for (const button of buttons) {
      if (button.popover) {
        await button.click();
        await page.waitForSelector('.popover-form')
      };
    };
  }, 50000);

  
  test('If button have a popover, hidden it', async () => {
    await page.goto('http://localhost:8080');
    await page.waitForSelector('form');
    const form = await page.$('.form')
    const buttons = await form.$$('.btn')
    for (const button of buttons) {
      if (button.popover) {
        await button.click();
        await page.waitForSelector('.popover-form')
        await button.click();
        await page.waitForSelector('.popover-form', {hidden: true})
      };
    };
  }, 50000);


  test('If buttons have not a popover, should not render tooltip', async () => {
    await page.goto('http://localhost:8080');
    await page.waitForSelector('form');
    const form = await page.$('.form')
    const buttons = await form.$$('.btn')
    for (const button of buttons) {
      if (!button.popover) {
        await button.click();
        await page.waitForSelector('.popover-form', {hidden: true})
      };
    };
  }, 50000);


  afterAll(async () => {
    await browser.close();
    server.kill();
  }, 20000)

});
