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
import { transparentBackground } from 'transparent-background';
import ImageTracer from 'imagetracerjs';

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
    const folder = this.getTempFilePath('');
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    const upscaledImagePath = this.getTempFilePath('upscaled.png');
    const noBgImagePath = this.getTempFilePath('no-bg.png');
    const svgOutputPath = this.getTempFilePath('output.svg');

    await this.removeBackground(imagePath, noBgImagePath);

    // Step 1: Upscale the image by x10 using Upscayl
    await this.upscaylService.upscale({
      inputPath: noBgImagePath,
      outputPath: upscaledImagePath,
      model: UpscaylModels.DigitalArtRealesrganX4plusAnime,
    });

    // Step 2: Remove the background

    // Step 3: Convert the image to SVG
   // const svgData = await this.convertToSvg(upscaledImagePath, svgOutputPath);

    return svgOutputPath;
  }

  private async removeBackground(
    inputPath: string,
    outputPath: string,
  ): Promise<void> {
    console.log('removeBackground');
    const input = await sharp(inputPath).toBuffer();
    const output = await transparentBackground(input, 'png', {
      fast: false,
    });
    console.log(outputPath);
    await fs.writeFileSync(outputPath, output);
  }

  private convertToSvg(inputPath: string, outputPath: string): Promise<string> {
    console.log('convertToSvg');
    return new Promise((resolve, reject) => {
      ImageTracer.imageToSVG(
        inputPath /* input filename / URL */,

        function (svgstr) {
          ImageTracer.appendSVGString(svgstr, 'svgcontainer');
        } /* callback function to run on SVG string result */,

        'posterized2' /* Option preset */,
      );
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
