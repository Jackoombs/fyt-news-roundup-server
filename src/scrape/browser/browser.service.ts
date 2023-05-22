import { Injectable } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';

@Injectable()
export class BrowserService {
  public browser: Browser;

  async openBrowser() {
    this.browser = await puppeteer.launch();
  }

  async closeBrowser() {
    this.browser.close();
  }

  async openNewPage(): Promise<Page> {
    const page = await this.browser.newPage();
    await page.setViewport({ width: 1080, height: 1024 });
    return page;
  }

  async changePage(page: Page, url: string) {
    await page.goto(url);
    await page.waitForSelector('body');
  }
}
