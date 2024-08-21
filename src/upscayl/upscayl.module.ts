import { Module } from '@nestjs/common';
import { UpscaylService } from './upscayl.service';
import { UpscaylController } from './upscayl.controller';

@Module({
  controllers: [UpscaylController],
  providers: [UpscaylService],
})
export class UpscaylModule {}
