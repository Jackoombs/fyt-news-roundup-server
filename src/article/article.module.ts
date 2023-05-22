import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleResolver } from './article.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ArticleResolver, ArticleService, PrismaService],
})
export class ArticleModule {}
