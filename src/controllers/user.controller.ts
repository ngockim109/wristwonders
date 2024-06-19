import { Request, Response, NextFunction } from "express";
import { IMember } from "../interfaces/member.interface";
import UserService from "../services/user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = {
    membername: req.body.membername,
    name: req.body.name,
    YOB: req.body.YOB,
    password: req.body.password,
    isAdmin: req.body.isAdmin || false
  };
  const YOBString = req.body.YOB;
  try {
    const newUser = await UserService.createUserHandler(YOBString, user);
    if (newUser) {
      res.render("users/user_management", {
        message: "Create member successfully!"
      });
    }
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users: IMember[] = await UserService.getAllUsersHandler();
    if (users) {
      return res.render("users/user_management", {
        users: users,
        title: "Users"
      });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  createUser,
  getAllUsers
};
