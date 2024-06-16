import { NextFunction, Request, Response } from "express";
import Member from "../models/member.model";
import {
  ACCESS_TOKEN_EXPIRATION,
  compareHashPassword,
  createAccessToken
} from "../utils/jwt";

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { membername, password } = req.body;
  try {
    const member = await Member.findOne({ membername });
    if (!member) {
      return res
        .status(401)
        .json({ message: "Membername or password incorrect!" });
    }

    const auth = await compareHashPassword(password, member.password);
    if (auth) {
      const token = createAccessToken({ member_id: member._id });
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: ACCESS_TOKEN_EXPIRATION * 1000
      });
      return res.status(200).json({ member: member.name });
    }

    return res.status(401).json({ message: "Password incorrect!" });
  } catch (error) {
    return res
      .status(400)
      .json({ error: "An error occurred while processing your request." });
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
