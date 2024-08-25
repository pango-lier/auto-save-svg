import { Injectable } from '@nestjs/common';
import { CreateUpscaylDto } from './dto/create-upscayl.dto';
import { UpdateUpscaylDto } from './dto/update-upscayl.dto';
import * as shell from 'shelljs';
import { UpscaylModels } from './bin/models-list';
import { OptionUpscaylModelDto } from './dto/upscayl.dto';
import { join } from 'path';
import { getModelScale } from './util/get-arguments';

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

  async upscale(options: OptionUpscaylModelDto) {
    return new Promise((resolve, reject) => {
      if (!options?.upscaylBinDir) {
        options.upscaylBinDir =
          process.env.UPSCAYL_BIN || join(__dirname, 'bin', 'upscayl-bin');
      }
      const modelScale = getModelScale(options.model);
      const includeScale = modelScale !== options.scale && !options.width;

      let command = `${options.upscaylBinDir} -i ${options.inputPath} -o ${options.outputPath} -n ${options.model}`;
      if (options.width) {
        command = `${command} -w ${options.width}`;
      } else if (includeScale) {
        command = `${command} -s ${modelScale}`;
      }
      if (options.gpuId) {
        command = `${command} -g ${options.gpuId}`;
      }
      if (options.tileSize) {
        command = `${command} -t ${options.tileSize}`;
      }
      console.warn(command);
      const { stdout } = shell.exec(command, (error: any) => {
        if (error) {
          reject(`Upscale failed: ${error?.message}`);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}
