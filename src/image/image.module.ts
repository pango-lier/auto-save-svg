import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { UpscaylModule } from 'src/upscayl/upscayl.module';

@Module({
  imports: [UpscaylModule],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
