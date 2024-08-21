import { Test, TestingModule } from '@nestjs/testing';
import { UpscaylService } from './upscayl.service';

describe('UpscaylService', () => {
  let service: UpscaylService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpscaylService],
    }).compile();

    service = module.get<UpscaylService>(UpscaylService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
