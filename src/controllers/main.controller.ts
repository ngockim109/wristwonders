import { NextFunction, Request, Response } from "express";
import WatchService from "../services/watch.service";

const getHomePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const watches = await WatchService.getAllWatchHandler();
    if (res.locals.member) {
      const { membername, name, YOB, isAdmin } = res.locals.member;
      const newMember = { membername, name, YOB, isAdmin };
      res.render("home", {
        title: "WristWonders",
        member: newMember,
        watches: watches
      });
    } else {
      res.render("home", { title: "WristWonders", watches: watches });
    }
  } catch (err) {
    next(err);
  }
};
export default {
  getHomePage
};
