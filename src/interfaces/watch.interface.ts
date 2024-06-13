import { IBranch } from "./branch.interface";
import { IComment } from "./comment.interface";

export interface IWatch {
  watchName: string;
  image: string;
  price: number;
  Automatic: boolean;
  watchDescription: string;
  comments: IComment[];
  brand: IBranch;
  createdAt: Date;
  updatedAt: Date;
}
