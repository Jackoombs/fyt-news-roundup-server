import { Injectable } from '@nestjs/common';
import { BbcArticleScraperService } from './bbc-article-scraper/bbc-article-scraper.service';
import { CreateArticleInput } from 'src/article/dto/create-article.input';
import { ArticleService } from 'src/article/article.service';
import { OutletWithCategory } from 'src/types';
import { ThedailymailArticleScraperService } from './thedailymail-article-scraper/thedailymail-article-scraper.service';

@Injectable()
export class ScrapeArticlesService {
  constructor(
    private bbcArticleScraper: BbcArticleScraperService,
    private thedailymailArticleScraper: ThedailymailArticleScraperService,
    private articleService: ArticleService,
  ) {}

  async scrapeArticles(outlets: OutletWithCategory[]) {
    const allArticles: CreateArticleInput[] = [];

    for (const outlet of outlets) {
      let outletArticles: CreateArticleInput[] = [];
      switch (outlet.name) {
        case 'BBC':
          outletArticles = await this.bbcArticleScraper.scrapeArticles(outlet);
          break;
        case 'The Daily Mail':
          outletArticles = await this.thedailymailArticleScraper.scrapeArticles(
            outlet,
          );
      }
      console.log(outletArticles);
      allArticles.push(...outletArticles);
    }

    await this.articleService.createMany(allArticles);
  }
}
