import { ILogin } from "./../interfaces/login.interface";
import { NextFunction, Request, Response } from "express";
import { ACCESS_TOKEN_EXPIRATION } from "../utils/jwt";
import AuthService from "../services/auth.service";
import { IMember } from "../interfaces/member.interface";

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { membername, password } = req.body;
  try {
    if (!res.locals.member) {
      const loginData: ILogin = { membername, password };
      const result = await AuthService.loginHandler(loginData);
      const newMember: IMember = {
        membername: result.member.membername,
        name: result.member.name,
        YOB: result.member.YOB,
        isAdmin: result.member.isAdmin
      };
      // Store token to cookies
      res.cookie("access_token", result.token, {
        httpOnly: true,
        maxAge: ACCESS_TOKEN_EXPIRATION * 1000
      });
      res.json({
        message: "Login successful!",
        token: result.token,
        member: newMember
      });
    } else {
      res.json({
        message:
          "Already logged in! If you want to login another account, please logout!"
      });
    }
  } catch (error) {
    next(error);
  }
};

const logout = (req: Request, res: Response) => {
  res.cookie("access_token", "", { maxAge: 1 });
  res.json({ message: "Logout successful!" });
};

export default {
  login,
  logout
};
