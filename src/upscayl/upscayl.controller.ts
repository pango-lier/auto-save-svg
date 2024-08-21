import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UpscaylService } from './upscayl.service';
import { CreateUpscaylDto } from './dto/create-upscayl.dto';
import { UpdateUpscaylDto } from './dto/update-upscayl.dto';

@Controller('upscayl')
export class UpscaylController {
  constructor(private readonly upscaylService: UpscaylService) {}

  @Post()
  create(@Body() createUpscaylDto: CreateUpscaylDto) {
    return this.upscaylService.create(createUpscaylDto);
  }

  @Get()
  findAll() {
    return this.upscaylService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.upscaylService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUpscaylDto: UpdateUpscaylDto) {
    return this.upscaylService.update(+id, updateUpscaylDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.upscaylService.remove(+id);
  }
}
