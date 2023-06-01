import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { OutletArticleScraperService } from '../outlet-article-scraper/outlet-article-scraper.service';
import { CreateArticleInput } from 'src/article/dto/create-article.input';
import { BrowserService } from 'src/scrape/browser/browser.service';
import { ScraperUtilsService } from 'src/scrape/scraper-utils/scraper-utils.service';

@Injectable()
export class ThedailymailArticleScraperService extends OutletArticleScraperService {
  constructor(browser: BrowserService, scraperUtils: ScraperUtilsService) {
    super(browser, scraperUtils);
  }

  async scrapeArticlesInternal(
    page: Page,
    outletId: string,
  ): Promise<CreateArticleInput[]> {
    const articleCards = await page.$$('.article');

    const articles: CreateArticleInput[] = await Promise.all(
      articleCards.slice(0, 4).map(async (card) => {
        const link = await card.$eval('h2 a', (el) => el.href);
        const summary = await card.$eval('p', (el) => el.textContent);
        const title = await card.$eval('h2 a', (el) => el.textContent);

        return {
          link,
          summary: summary?.trim() ?? undefined,
          title: title?.trim() ?? undefined,
          category: this.scraperUtils.getUrlDirectory(link, 1),
          outletId: outletId,
          keywords: title ? this.scraperUtils.getKeyWords(title) : [],
          content: [],
        };
      }),
    );

    for (const article of articles) {
      await this.browser.changePage(page, article.link);
      const date = await page.$eval('time', (el) =>
        el.getAttribute('datetime'),
      );
      const articleElement = await page.$('[itemprop="articleBody"]');
      const paragraphs = await articleElement?.$$('p');

      if (paragraphs) {
        const contentArray = await Promise.all(
          paragraphs.map((paragraph) =>
            page.evaluate((element) => {
              return element.textContent;
            }, paragraph),
          ),
        );

        article.content = contentArray.filter(Boolean);
        article.date = date ? new Date(date) : undefined;
      }
    }

    return articles;
  }
}
