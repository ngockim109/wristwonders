import { ILogin } from "./../interfaces/login.interface";
import { NextFunction, Request, Response } from "express";
import Member from "../models/member.model";
import {
  ACCESS_TOKEN_EXPIRATION,
  compareHashPassword,
  createAccessToken
} from "../utils/jwt";
import { BadRequestError } from "../errors/badRequestError";

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { membername, password } = req.body;
  try {
    const member = await Member.findOne({ membername });
    const loginData: ILogin = { membername, password };
    if (!member) {
      throw new BadRequestError(
        "The membername or password is incorrect!",
        loginData
      );
    }

    const auth = await compareHashPassword(password, member.password);
    if (auth) {
      const token = createAccessToken({ member_id: member._id });
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: ACCESS_TOKEN_EXPIRATION
      });
      res.redirect("/wristwonders");
    }

    throw new BadRequestError(
      "The membername or password is incorrect!",
      loginData
    );
  } catch (error) {
    next(error);
  }
};

const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/wristwonders");
};

export default {
  login,
  logout
};
