import { Injectable } from '@nestjs/common';
import { CreateArticleInput } from './dto/create-article.input';
import { UpdateArticleInput } from './dto/update-article.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleInput: CreateArticleInput) {
    return await this.prisma.article.create({
      data: { ...createArticleInput },
    });
  }

  async createMany(createArticleInputArr: CreateArticleInput[]) {
    const existingArticles = await this.prisma.article.findMany({
      where: {
        link: {
          in: createArticleInputArr.map((input) => input.link),
        },
      },
    });

    const existingArticleLinks = existingArticles.map((input) => input.link);

    const newInputs = createArticleInputArr.filter(
      (input) => !existingArticleLinks.includes(input.link),
    );

    if (newInputs.length === 0) return;

    await this.prisma.article.createMany({
      data: newInputs,
    });
  }

  async findAll() {
    return await this.prisma.article.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.article.findUnique({ where: { id } });
  }

  async findByOutletName(name: string) {
    return await this.prisma.article.findMany({
      where: {
        outlet: {
          name,
        },
      },
    });
  }

  async update(id: string, updateArticleInput: UpdateArticleInput) {
    return await this.prisma.article.update({
      where: { id },
      data: { ...updateArticleInput },
    });
  }

  async remove(id: string) {
    return await this.prisma.article.delete({ where: { id } });
  }
}
