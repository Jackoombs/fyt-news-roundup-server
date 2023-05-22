import { Injectable } from '@nestjs/common';
import { CreateOutletInput } from './dto/create-outlet.input';
import { UpdateOutletInput } from './dto/update-outlet.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OutletService {
  constructor(private prisma: PrismaService) {}
  async create(createOutletInput: CreateOutletInput) {
    return await this.prisma.outlet.create({
      data: { ...createOutletInput },
    });
  }

  async findAll() {
    return await this.prisma.outlet.findMany({
      include: {
        categorys: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.outlet.findUnique({ where: { id } });
  }

  async findByName(name: string) {
    return await this.prisma.outlet.findUnique({ where: { name } });
  }

  async update(id: string, updateOutletInput: UpdateOutletInput) {
    return await this.prisma.outlet.update({
      where: { id },
      data: { ...updateOutletInput },
    });
  }

  async remove(id: string) {
    return await this.prisma.outlet.delete({ where: { id } });
  }
}
