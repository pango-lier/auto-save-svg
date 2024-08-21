import { Injectable } from '@nestjs/common';
import { CreateUpscaylDto } from './dto/create-upscayl.dto';
import { UpdateUpscaylDto } from './dto/update-upscayl.dto';

@Injectable()
export class UpscaylService {
  create(createUpscaylDto: CreateUpscaylDto) {
    return 'This action adds a new upscayl';
  }

  findAll() {
    return `This action returns all upscayl`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upscayl`;
  }

  update(id: number, updateUpscaylDto: UpdateUpscaylDto) {
    return `This action updates a #${id} upscayl`;
  }

  remove(id: number) {
    return `This action removes a #${id} upscayl`;
  }

  run() {
    return 'This action adds a new upscayl';
  }
}
