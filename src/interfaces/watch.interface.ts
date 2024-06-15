import { IBrand } from "./brand.interface";
import { IComment } from "./comment.interface";

export interface IWatch {
  watchName: string;
  image: string;
  price: number;
  Automatic: boolean;
  watchDescription: string;
  comments: IComment[];
  brand: IBrand;
  createdAt: Date;
  updatedAt: Date;
}
