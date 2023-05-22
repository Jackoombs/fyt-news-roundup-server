import { Module } from '@nestjs/common';
import { OutletService } from './outlet.service';
import { OutletResolver } from './outlet.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [OutletResolver, OutletService, PrismaService],
})
export class OutletModule {}
