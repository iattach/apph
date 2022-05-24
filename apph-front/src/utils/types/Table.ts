import { ITag } from './Tag';

export interface ITable {
  id: number;
  size: number;
  creationDate: Date;
  shootingDate: Date;
  description: string;
  title: string;
  url: string;
  tags: ITag[];
  details: JSX.Element;
}

export interface IPhotoDetails {
  photoId: number;
  photoSrc: string;
  title: string;
  description: string;
  creationDate: Date;
  shootingDate: Date;
  size: number;
  tags: ITag[];
}
