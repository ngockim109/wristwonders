import { NextFunction, Request, Response } from "express";

const getHomePage = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (res.locals.member) {
      const { membername, name, YOB } = res.locals.member;
      const newMember = { membername, name, YOB };
      res.render("home", { title: "WristWonders", member: newMember });
    } else {
      res.render("home", { title: "WristWonders" });
    }
  } catch (err) {
    next(err);
  }
};
export default {
  getHomePage
};
