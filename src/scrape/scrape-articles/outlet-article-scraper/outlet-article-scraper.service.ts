import { Injectable } from '@nestjs/common';
import { BrowserService } from 'src/scrape/browser/browser.service';
import { CreateArticleInput } from 'src/article/dto/create-article.input';
import { Page } from 'puppeteer';
import { ScraperUtilsService } from 'src/scrape/scraper-utils/scraper-utils.service';
import { OutletWithCategory } from 'src/types';

@Injectable()
export abstract class OutletArticleScraperService {
  constructor(
    protected readonly browser: BrowserService,
    protected readonly scraperUtils: ScraperUtilsService,
  ) {}

  async scrapeArticles(
    outlet: OutletWithCategory,
  ): Promise<CreateArticleInput[]> {
    const outletArticles: CreateArticleInput[] = [];
    const page = await this.browser.openNewPage();
    const categorysToScrape = outlet.categorys.filter(
      (category) => category.active,
    );

    for (const category of categorysToScrape) {
      try {
        await this.browser.changePage(page, category.url);
        const categoryArticles = await this.scrapeArticlesInternal(
          page,
          outlet.id,
        );
        outletArticles.push(...categoryArticles);
        console.log(categoryArticles.map((category) => category.title));
      } catch (error) {
        console.log(error);
      }
    }

    await page.close();
    return outletArticles;
  }

  protected abstract scrapeArticlesInternal(
    page: Page,
    outletId: string,
  ): Promise<CreateArticleInput[]>;
}
