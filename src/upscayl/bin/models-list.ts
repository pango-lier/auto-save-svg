export enum UpscaylModels {
  GeneralPhotoRealEsrganX4plus = 'realesrgan-x4plus',
  GeneralPhotoRealesrganX4fast = 'realesrgan-x4fast',
  GeneralPhotoRemacri = 'remacri',
  GeneralPhotoUltramixBalanced = 'ultramix_balanced',
  GeneralPhotoUltrasharp = 'ultrasharp',
  DigitalArtRealesrganX4plusAnime = 'realesrgan-x4plus-anime',
}
export const defaultModelsList = [
  {
    label: 'General Photo (Real-ESRGAN)',
    value: UpscaylModels.GeneralPhotoRealEsrganX4plus,
  },
  {
    label: 'General Photo (Fast Real-ESRGAN)',
    value: UpscaylModels.GeneralPhotoRealesrganX4fast,
  },
  {
    label: 'General Photo (Remacri)',
    value: UpscaylModels.GeneralPhotoRemacri,
  },
  {
    label: 'General Photo (Ultramix Balanced)',
    value: UpscaylModels.GeneralPhotoUltramixBalanced,
  },
  {
    label: 'General Photo (Ultrasharp)',
    value: UpscaylModels.GeneralPhotoUltrasharp,
  },
  {
    label: 'Digital Art',
    value: UpscaylModels.DigitalArtRealesrganX4plusAnime,
  },
];

export const DEFAULT_MODELS = defaultModelsList.map((model) => model.value);
