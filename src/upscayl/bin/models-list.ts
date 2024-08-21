export enum EModelList {
  RealesrganX4plus = 'realesrgan-x4plus',
  RealesrganX4fast = 'realesrgan-x4fast',
}
export const defaultModelsList = [
  { label: 'General Photo (Real-ESRGAN)', value: EModelList.RealesrganX4plus },
  {
    label: 'General Photo (Fast Real-ESRGAN)',
    value: EModelList.RealesrganX4fast,
  },
  { label: 'General Photo (Remacri)', value: 'remacri' },
  { label: 'General Photo (Ultramix Balanced)', value: 'ultramix_balanced' },
  { label: 'General Photo (Ultrasharp)', value: 'ultrasharp' },
  { label: 'Digital Art', value: 'realesrgan-x4plus-anime' },
];

export const DEFAULT_MODELS = defaultModelsList.map((model) => model.value);
