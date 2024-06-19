import { Types } from "mongoose";

export interface IMember {
  membername: string;
  name: string;
  YOB: number;
  password: string;
  isAdmin: boolean;
  _id?: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}
