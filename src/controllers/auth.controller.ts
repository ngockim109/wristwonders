import { ILogin } from "./../interfaces/login.interface";
import { NextFunction, Request, Response } from "express";
import { ACCESS_TOKEN_EXPIRATION } from "../utils/jwt";
import AuthService from "../services/auth.service";

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { membername, password } = req.body;
  try {
    if (!res.locals.member) {
      const loginData: ILogin = { membername, password };
      const token = await AuthService.loginHandler(loginData);

      // Store token to cookies
      res.cookie("access_token", token, {
        httpOnly: true,
        maxAge: ACCESS_TOKEN_EXPIRATION * 1000
      });

      res.redirect("/wristwonders");
    } else {
      res.redirect("/wristwonders");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const logout = (req: Request, res: Response) => {
  res.cookie("access_token", "", { maxAge: 1 });
  res.redirect("/wristwonders");
};

export default {
  login,
  logout
};
