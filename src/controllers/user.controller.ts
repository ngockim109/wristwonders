import { Request, Response, NextFunction } from "express";
import { IMember } from "../interfaces/member.interface";
import UserService from "../services/user.service";
import { BadRequestError } from "../errors/badRequestError";
import { ValidationError } from "../errors/validationError";
import { GlobalError } from "../errors/globalError";

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
    if (result.error) {
      req.flash("error", result.error);
      res.redirect("/wristwonders/accounts");
    }
    req.flash("message", "Create member successfully!");
    res.redirect("/wristwonders/accounts");
  } catch (error) {
    if (error instanceof GlobalError) {
      if (error instanceof BadRequestError) {
        req.flash("error", error.message);
        res.redirect("/wristwonders/accounts");
      } else {
        console.error(error);
      }
      if (error instanceof ValidationError) {
        req.flash("error", error.message);
        res.redirect("/wristwonders/accounts");
      }
    } else {
      console.error(error);
    }
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users: IMember[] = await UserService.getAllUsersHandler();
    if (users) {
      return res.render("accounts", {
        users: users,
        title: "Users",
        layout: false
      });
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
      return res.render("accounts/account_detail", {
        user: user,
        title: "Accounts",
        layout: false
      });
    }
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.render("accounts/account_detail", {
        title: "Member not found",
        member: res.locals.member,
        user: null,
        layout: false
      });
    } else {
      console.error(error);
    }
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { brand_detail } = req.body;
  try {
    const deleteUser = await UserService.deleteUserHandler(id);
    if (deleteUser.error) {
      if (brand_detail === "detail") {
        return res.render("accounts/account_detail", {
          title: (await UserService.getUserHandler(id))?.name ?? "",
          error: deleteUser.error,
          user: await UserService.getUserHandler(id),
          layout: false
        });
      } else {
        return res.render("accounts", {
          title: "Accounts",
          error: deleteUser.error,
          users: await UserService.getAllUsersHandler(),
          layout: false
        });
      }
    } else {
      res.render("accounts", {
        title: "Accounts",
        message: "Delete user successfully!",
        users: await UserService.getAllUsersHandler(),
        layout: false
      });
    }
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
