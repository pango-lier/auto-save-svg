import { Module } from '@nestjs/common';
import { UpscaylService } from './upscayl.service';

@Module({
  providers: [UpscaylService],
  exports: [UpscaylService],
})
export class UpscaylModule {}
