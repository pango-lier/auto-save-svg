import { PartialType } from '@nestjs/mapped-types';
import { CreateUpscaylDto } from './create-upscayl.dto';

export class UpdateUpscaylDto extends PartialType(CreateUpscaylDto) {}
