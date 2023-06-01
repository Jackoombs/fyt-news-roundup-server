import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleResolver } from './article.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { KeywordsService } from 'src/keywords/keywords.service';
import { ScraperUtilsService } from 'src/scrape/scraper-utils/scraper-utils.service';
import { stopWords } from 'src/scrape/scraper-utils/stopwords';

@Module({
  providers: [
    ArticleResolver,
    ArticleService,
    PrismaService,
    KeywordsService,
    ScraperUtilsService,
    { provide: 'STOPWORDS', useValue: stopWords },
  ],
})
export class ArticleModule {}
