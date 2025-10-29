import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  // eslint-disable-next-line prettier/prettier
  providers: [PrismaService]
})
export class PrismaModule {}
