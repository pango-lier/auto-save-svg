import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as potrace from 'potrace';
import * as fs from 'fs-extra';
import { exec } from 'child_process';
// import execa = require('execa');
import * as shell from 'shelljs';
import { join } from 'path';
import { Timeout } from '@nestjs/schedule';
import { UpscaylService } from 'src/upscayl/upscayl.service';
import { UpscaylModels } from 'src/upscayl/bin/models-list';
import { Rembg } from 'sharp-remove-bg-ai';
import { transparentBackground } from 'transparent-background';

@Injectable()
export class ImageService {
  constructor(private readonly upscaylService: UpscaylService) {}

  @Timeout(1)
  async test() {
    console.log('test');
    try {
      await this.convertImageToSvg('test.jpg');
    } catch (error) {
      console.error(error.message);
    }
  }

  async convertImageToSvg(imagePath: string): Promise<string> {
    const upscaledImagePath = this.getTempFilePath('upscaled.png');
    const noBgImagePath = this.getTempFilePath('no-bg.png');
    const svgOutputPath = this.getTempFilePath('output.svg');

    // Step 1: Upscale the image by x10 using Upscayl
    await this.upscaylService.upscale({
      inputPath: imagePath,
      outputPath: upscaledImagePath,
      model: UpscaylModels.DigitalArtRealesrganX4plusAnime,
    });

    // Step 2: Remove the background
    await this.removeBackground(upscaledImagePath, noBgImagePath);

    // Step 3: Convert the image to SVG
    const svgData = await this.convertToSvg(upscaledImagePath, svgOutputPath);

    return svgOutputPath;
  }

  private async removeBackground(
    inputPath: string,
    outputPath: string,
  ): Promise<void> {
    console.log('removeBackground');
    const input = await sharp(inputPath).toBuffer();
    const output = await transparentBackground(input, "png", {
      // uses a 1024x1024 model by default
      // enabling fast uses a 384x384 model instead
      fast: false,
    });
    fs.writeFileSync(outputPath, output);

  }

  private convertToSvg(inputPath: string, outputPath: string): Promise<string> {
    console.log('convertToSvg');
    return new Promise((resolve, reject) => {
      sharp(inputPath)
        .toBuffer()
        .then((data) => {
          potrace.trace(data, (err, svg) => {
            if (err) {
              reject(`SVG conversion failed: ${err.message}`);
            } else {
              fs.writeFileSync(outputPath, svg);
              resolve(svg);
            }
          });
        })
        .catch((err) => reject(`Sharp processing failed: ${err.message}`));
    });
  }

  private getTempFilePath(fileName: string): string {
    return join(__dirname, '..', 'temp', fileName);
  }
}
