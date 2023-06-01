import { Injectable } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterCategoryInput } from './dto/filter-category.input';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  create(createCategoryInput: CreateCategoryInput) {
    return 'This action adds a new category';
  }

  async findAll(filterBy: FilterCategoryInput, take?: number, skip?: number) {
    return await this.prisma.category.findMany({
      where: {
        outlet: {
          name: filterBy?.outletName,
        },
        active: filterBy?.active,
      },
      include: {
        outlet: true,
      },
      take,
      skip,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(updateCategoryInput: UpdateCategoryInput) {
    const category = this.prisma.category.update({
      where: { url: updateCategoryInput.url },
      data: { active: updateCategoryInput.active },
    });

    return category;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
