import { Injectable } from '@nestjs/common';
import { OutletArticleScraperService } from '../outlet-article-scraper/outlet-article-scraper.service';
import { CreateArticleInput } from 'src/article/dto/create-article.input';
import { Page } from 'puppeteer';
import { BrowserService } from 'src/scrape/browser/browser.service';
import { ScraperUtilsService } from 'src/scrape/scraper-utils/scraper-utils.service';

@Injectable()
export class BbcArticleScraperService extends OutletArticleScraperService {
  constructor(browser: BrowserService, scraperUtils: ScraperUtilsService) {
    super(browser, scraperUtils);
  }

  protected async scrapeArticlesInternal(
    page: Page,
    outletId: string,
  ): Promise<CreateArticleInput[]> {
    const articleCards = await page.$$('.gs-c-promo');

    const articles: CreateArticleInput[] = await Promise.all(
      articleCards.slice(0, 4).map(async (card) => {
        const link = await card.$eval('a', (el) => el.href);
        const summary = await card.$eval('p', (el) => el.textContent);
        const title = await card.$eval('a', (el) => el.firstChild?.textContent);
        const date = await page.$eval('time', (el) =>
          el.getAttribute('datetime'),
        );
        const category = await card.$eval(
          '.nw-c-promo-meta a span',
          (el) => el.textContent,
        );

        return {
          link,
          summary: summary?.trim() ?? undefined,
          title: title?.trim() ?? undefined,
          category: category ?? undefined,
          keywords: title ? this.scraperUtils.getKeyWords(title) : [],
          date: date ? new Date(date) : undefined,
          outletId,
        };
      }),
    );

    for (const article of articles) {
      await this.browser.changePage(page, article.link);
      const articleElement = await page.$('article');
      const paragraphs = await articleElement?.$$('p, h2');

      if (paragraphs) {
        const contentArray = await Promise.all(
          paragraphs.map((paragraph) =>
            page.evaluate((element) => {
              if (element.parentElement?.nodeName !== 'SPAN') {
                return element.textContent;
              } else {
                return null;
              }
            }, paragraph),
          ),
        );
        const content = this.scraperUtils.joinArticleContent(contentArray);
        article.content = content;
      }
    }
    return articles;
  }
}
