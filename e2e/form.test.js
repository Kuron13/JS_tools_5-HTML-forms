import puppeteer from 'puppeteer';
import { fork } from "child_process";

describe('Form with buttons', () => {
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
  });


  test('Form should render on page start', async () => {
    await page.goto('http://localhost:8080');

    await page.waitForSelector('form');
    
    const bodyExists = await page.$('body');
    expect(bodyExists).toBeTruthy();
  }, 20000);



  test('If buttons have a popover, should render tooltip', async () => {
    await page.goto('http://localhost:8080');
    await page.waitForSelector('form');
    const form = await page.$('.form')
    const buttons = await form.$$('.btn')

    const buttonsWithPopover = []
    for (const button of buttons) {
      if (button.popover) {
        buttonsWithPopover.append(button)
      };
    };
    
    for (const button of buttonsWithPopover) {
      await button.click();
      await page.waitForSelector('.popover-form')
      const popoverExists = await page.$('popover-form');
      expect(popoverExists).toBeTruthy();
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
    const popoverExists = await page.$('popover-form');
    expect(popoverExists).toBeFalsy();
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
    const popoverExists = await page.$('popover-form');
    expect(popoverExists).toBeFalsy();
  }, 50000);


  afterAll(async () => {
    await browser.close();
    server.kill();
  })

});
