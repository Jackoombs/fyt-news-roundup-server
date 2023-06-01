import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BrowserService } from './scrape/browser/browser.service';
import { ScrapeManagerService } from './scrape/scrape-manager/scrape-manager.service';
import { ArticleService } from './article/article.service';
import { OutletService } from './outlet/outlet.service';
import { CategoryService } from './category/category.service';
import { PrismaService } from './prisma/prisma.service';
import { ArticleModule } from './article/article.module';
import { OutletModule } from './outlet/outlet.module';
import { CategoryModule } from './category/category.module';
import { join } from 'path';
import { ScrapeArticlesService } from './scrape/scrape-articles/scrape-articles.service';
import { BbcArticleScraperService } from './scrape/scrape-articles/bbc-article-scraper/bbc-article-scraper.service';
import { ScraperUtilsService } from './scrape/scraper-utils/scraper-utils.service';
import { stopWords } from './scrape/scraper-utils/stopwords';
import { ThedailymailArticleScraperService } from './scrape/scrape-articles/thedailymail-article-scraper/thedailymail-article-scraper.service';
import { KeywordsService } from './keywords/keywords.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    ArticleModule,
    OutletModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BrowserService,
    ScrapeManagerService,
    ArticleService,
    OutletService,
    CategoryService,
    PrismaService,
    ScrapeArticlesService,
    BbcArticleScraperService,
    ScraperUtilsService,
    { provide: 'STOPWORDS', useValue: stopWords },
    ThedailymailArticleScraperService,
    KeywordsService,
  ],
})
export class AppModule {}
