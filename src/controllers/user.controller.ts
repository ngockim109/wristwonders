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
    const result = await UserService.createUserHandler(YOBString, user);
    res.status(201).json({ message: "Member created successfully!" });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users: IMember[] = await UserService.getAllUsersHandler();
    if (users) {
      res.status(200).json({ data: users });
    }
  } catch (error) {
    next(error);
  }
};
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const user: IMember = await UserService.getUserHandler(id);
    if (user) {
      res.status(200).json({ data: user });
    }
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const deleteUser = await UserService.deleteUserHandler(id);
    const users = await UserService.getAllUsersHandler();
    res.status(200).json({
      message: "Delete user successfully!",
      data: users
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createUser,
  getAllUsers,
  deleteUser,
  getUser
};
