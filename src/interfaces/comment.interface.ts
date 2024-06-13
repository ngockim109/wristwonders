import { IMember } from "./member.interface";

export interface IComment {
  rating: number;
  content: string;
  author: IMember;
}
