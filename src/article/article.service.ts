import { Injectable } from '@nestjs/common';
import { CreateArticleInput } from './dto/create-article.input';
import { UpdateArticleInput } from './dto/update-article.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterArticleInput } from './dto/filter-article.input';
import { KeywordsService } from 'src/keywords/keywords.service';
import { ScraperUtilsService } from 'src/scrape/scraper-utils/scraper-utils.service';

@Injectable()
export class ArticleService {
  constructor(
    private prisma: PrismaService,
    private keywords: KeywordsService,
    private scraperUtils: ScraperUtilsService,
  ) {}

  async create(createArticleInput: CreateArticleInput) {
    return await this.prisma.article.create({
      data: { ...createArticleInput },
    });
  }

  async createMany(createArticleInputArr: CreateArticleInput[]) {
    for (const data of createArticleInputArr) {
      const exisitingArticle = await this.prisma.article.findUnique({
        where: {
          link: data.link,
        },
      });

      if (!exisitingArticle) {
        await this.prisma.article.create({
          data,
        });
      }
    }
  }

  async findAll(
    filterBy?: FilterArticleInput,
    orderBy?: { [key: string]: 'asc' | 'desc' }[],
    take?: number,
    skip?: number,
  ) {
    let searchString: string | undefined = filterBy?.search;

    if (searchString) {
      const search = this.scraperUtils.cleanText(filterBy?.search);
      const searchArray = this.scraperUtils.getKeyWords(search);
      searchString = searchArray.join(' | ');
    } else {
      searchString = undefined;
    }

    return await this.prisma.article.findMany({
      where: {
        outlet: {
          name: {
            in: filterBy?.outletName,
          },
        },
        date: {
          gte: filterBy?.startDate,
          lte: filterBy?.endDate,
        },
        category: filterBy?.category,
        title: {
          search: searchString,
        },
        saved: filterBy?.saved,
      },
      include: {
        outlet: true,
      },
      take,
      skip,
      orderBy,
    });
  }

  async findOne(id: string) {
    return await this.prisma.article.findUnique({
      where: { id },
      include: {
        outlet: true,
      },
    });
  }

  async findRelatedArticles(id: string, keywords: string[], take?: number) {
    const relatedArticles = await this.prisma.article.findMany({
      where: {
        keywords: {
          hasSome: keywords,
        },
        id: {
          not: id,
        },
      },
      include: {
        outlet: true,
      },
    });

    const sortedArticles = this.keywords
      .sortBySimilarity(relatedArticles, keywords)
      .slice(0, take || undefined);
    return sortedArticles;
  }

  async update(updateArticleInput: UpdateArticleInput) {
    return await this.prisma.article.update({
      where: { id: updateArticleInput.id },
      data: { ...updateArticleInput },
    });
  }

  async remove(id: string) {
    return await this.prisma.article.delete({ where: { id } });
  }
}
