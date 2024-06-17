import { ILogin } from "./../interfaces/login.interface";
import Member from "../models/member.model";
import { compareHashPassword, createAccessToken } from "../utils/jwt";
import { BadRequestError } from "../errors/badRequestError";

export default class AuthService {
  static async loginHandler(loginDTO: ILogin) {
    const member = await Member.findOne({ membername: loginDTO.membername });
    if (!member) {
      throw new BadRequestError(
        "The membername or password is incorrect!",
        loginDTO
      );
    }
    const auth = await compareHashPassword(loginDTO.password, member.password);
    if (auth) {
      const token = createAccessToken({ member_id: member._id });
      return token;
    } else {
      throw new BadRequestError(
        "The membername or password is incorrect!",
        loginDTO
      );
    }
  }
}
