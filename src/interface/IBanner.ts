import { IFileData } from "./IFiles";

export interface IBanners {
  id: number;
  url: string;
  is_active: boolean;
  file: IFileData;
}
