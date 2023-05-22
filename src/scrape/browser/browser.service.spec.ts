import { Test, TestingModule } from '@nestjs/testing';
import { BrowserService } from './browser.service';
import puppeteer from 'puppeteer';

describe('BrowserService', () => {
  let browserService: BrowserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrowserService],
    }).compile();

    browserService = module.get<BrowserService>(BrowserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    if (browserService.browser) {
      browserService.browser.close();
    }
  });

  it('should be defined', () => {
    expect(browserService).toBeDefined();
  });

  describe('openBrowser', () => {
    it('should define the browser', async () => {
      expect(browserService.browser).not.toBeDefined;
      await browserService.openBrowser();
      expect(browserService.browser).toBeDefined;
    });
  });

  describe('closeBrowser', () => {
    it('should close the browser', async () => {
      expect(browserService.browser).not.toBeDefined;
      browserService.browser = await puppeteer.launch();
      expect(browserService.browser).toBeDefined;
      await browserService.closeBrowser();
      expect(browserService.browser).not.toBeDefined;
    });
  });

  describe('openNewPage', () => {
    it('should open a new page', async () => {
      browserService.browser = await puppeteer.launch();

      const page = await browserService.openNewPage();
      expect(page).toBeDefined();
    });

    it('should set correct viewport', async () => {
      const expectedWidth = 1080;
      const expectedHeight = 1024;

      browserService.browser = await puppeteer.launch();
      const page = await browserService.openNewPage();
      expect(page.viewport().width).toEqual(expectedWidth);
      expect(page.viewport().height).toEqual(expectedHeight);
    });
  });

  describe('changePage', () => {
    it('should change page', async () => {
      browserService.browser = await puppeteer.launch();
      const page = await browserService.browser.newPage();
      const url = 'https://example.com/';

      expect(page.url()).not.toEqual(url);
      await browserService.changePage(page, url);
      expect(page.url()).toEqual(url);
    });

    it('body should be on the page', async () => {
      const mockWaitForSelector = jest.fn();
      const page = {
        goto: jest.fn(),
        waitForSelector: mockWaitForSelector,
      } as any;
      const url = 'https://example.com';
      await browserService.changePage(page, url);
      expect(page.goto).toHaveBeenCalledWith(url);
      expect(mockWaitForSelector).toHaveBeenCalledWith('body');
    });
  });
});
