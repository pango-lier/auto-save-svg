import { UpscaylModels } from '../bin/models-list';

export class OptionUpscaylModelDto {
  inputPath: string;
  outputPath: string;
  model: UpscaylModels;
  upscaylBinDir?: string;
  scale?: number;
  width?: number;
  gpuId?: string;
  tileSize?: string;
}
