import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs-extra';
import { Interval, Timeout } from '@nestjs/schedule';
import { UpscaylService } from 'src/upscayl/upscayl.service';
import { UpscaylModels } from 'src/upscayl/bin/models-list';
import { transparentBackground } from 'transparent-background';
import * as shell from 'shelljs';

@Injectable()
export class ImageService {
  constructor(private readonly upscaylService: UpscaylService) {}

  @Timeout(1)
  async test() {
    console.log('test');
  }

  @Interval(10000)
  async runProcessDesigns() {
    console.log('runProcessDesigns ');
    try {
      const folderPath = '/home/trong/Desktop/designs';
      const folders = await this.listFolder(folderPath);
      for await (const folder of folders) {
        await this.convertImageToSvg(`${folderPath}/${folder}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async convertImageToSvg(designFolderPath: string): Promise<any> {
    const noBgFolder = `${designFolderPath}/noBg`;
    if (!fs.existsSync(noBgFolder)) {
      fs.mkdirSync(noBgFolder, { recursive: true });
    }
    const upScaleFolder = `${designFolderPath}/upScale`;
    if (!fs.existsSync(upScaleFolder)) {
      fs.mkdirSync(upScaleFolder, { recursive: true });
    }
    const originFolder = `${designFolderPath}/origin`;
    if (!fs.existsSync(originFolder)) {
      fs.mkdirSync(originFolder, { recursive: true });
    }

    const tempFolder = `${designFolderPath}/temp`;
    if (!fs.existsSync(tempFolder)) {
      fs.mkdirSync(tempFolder, { recursive: true });
    }

    const previewFolder = `${designFolderPath}/preview`;
    if (!fs.existsSync(previewFolder)) {
      fs.mkdirSync(previewFolder, { recursive: true });
    }

    const designs = await this.listImageFiles(designFolderPath);
    for await (const design of designs) {
      if (
        shell.mv(`${designFolderPath}/${design}`, `${tempFolder}`).code !== 0
      ) {
        console.error('Error moving the file');
      }
    }
    for await (const design of designs) {
      await this.removeBackground(
        `${tempFolder}/${design}`,
        `${noBgFolder}/${design}`,
      );
      // Step 1: Upscale the image by x10 using Upscayl

      const upscaleName = this.renameExt(design);
      await this.upscaylService.upscale({
        inputPath: `${noBgFolder}/${design}`,
        outputPath: `${upScaleFolder}/${upscaleName}`,
        model: UpscaylModels.DigitalArtRealesrganX4plusAnime,
        width: 640,
      });
      await sharp(`${upScaleFolder}/${upscaleName}`)
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .jpeg({ quality: 90 }) // Set quality (0-100), default is 80
        .toFile(`${previewFolder}/${this.renameExt(design, 'jpg')}`);
      if (shell.mv(`${tempFolder}/${design}`, `${originFolder}`).code === 0) {
        console.log(`File moved to ${originFolder}`);
      } else {
        console.error('Error moving the file');
      }
    }
  }

  renameExt(fileName: string, extChange = 'png') {
    const arrDesign = fileName.split('.');
    arrDesign[arrDesign.length - 1] = extChange;
    return arrDesign.join('.');
  }

  private async removeBackground(
    inputPath: string,
    outputPath: string,
  ): Promise<void> {
    console.warn(`Start removeBackground: ${inputPath}`);
    const input = await sharp(inputPath).toBuffer();
    const output = await transparentBackground(input, 'png', {
      fast: false,
    });

    await fs.writeFileSync(outputPath, output);
    console.warn(`End removeBackground: ${outputPath}`);
  }

  async listImageFiles(folderPath: string = '/home/trong/Desktop/designs') {
    try {
      // Read the directory
      const files = await fs.readdir(folderPath, { withFileTypes: true });
      // Define the image file extensions you want to filter by
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      // Filter the files by their extension
      const imageFiles = files.filter((file) => {
        const fileAr = file.name.split('.');
        return imageExtensions.includes(
          `.${fileAr[fileAr.length - 1]}`.toLocaleLowerCase(),
        );
      });
      return imageFiles.map((file) => `${file.name}`);
    } catch (err) {
      console.error('Error reading the directory:', err);
    }
    return [];
  }

  async listFolder(folderPath: string = '/home/trong/Desktop/designs') {
    try {
      const files = await fs.readdir(folderPath, { withFileTypes: true });
      const folders = files.filter((file) => file.isDirectory());
      return folders.map((folder) => `${folder.name}`);
    } catch (err) {
      console.error('Error reading the directory:', err);
    }
    return [];
  }
}
