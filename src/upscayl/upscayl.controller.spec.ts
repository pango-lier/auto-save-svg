import { Test, TestingModule } from '@nestjs/testing';
import { UpscaylController } from './upscayl.controller';
import { UpscaylService } from './upscayl.service';

describe('UpscaylController', () => {
  let controller: UpscaylController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpscaylController],
      providers: [UpscaylService],
    }).compile();

    controller = module.get<UpscaylController>(UpscaylController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
