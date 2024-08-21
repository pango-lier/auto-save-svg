import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as potrace from 'potrace';
import * as fs from 'fs-extra';
import { exec } from 'child_process';
import { join } from 'path';
import { Timeout } from '@nestjs/schedule';

@Injectable()
export class ImageService {
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
    await this.upscaleImage(imagePath, upscaledImagePath);

    // Step 2: Remove the background
    await this.removeBackground(upscaledImagePath, noBgImagePath);

    // Step 3: Convert the image to SVG
    const svgData = await this.convertToSvg(noBgImagePath, svgOutputPath);

    return svgOutputPath;
  }

  private upscaleImage(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(
        `${process.env.UPSCAYL_BIN} -i ${inputPath} -o ${outputPath} -s 2 -n digital-art`,
      );
      exec(
        `${process.env.UPSCAYL_BIN} -i ${inputPath} -o ${outputPath} -s 2 -n realesrgan-x4plus-anime`,
        (error) => {
          if (error) {
            reject(`Upscale failed: ${error.message}`);
          } else {
            resolve();
          }
        },
      );
    });
  }

  private removeBackground(
    inputPath: string,
    outputPath: string,
  ): Promise<void> {
    return sharp(inputPath)
      .removeAlpha()
      .toFile(outputPath)
      .then(() => Promise.resolve())
      .catch((err) =>
        Promise.reject(`Background removal failed: ${err.message}`),
      );
  }

  private convertToSvg(inputPath: string, outputPath: string): Promise<string> {
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
