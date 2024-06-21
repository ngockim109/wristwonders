import { NextFunction, Request, Response } from "express";
import WatchService from "../services/watch.service";
import { BadRequestError } from "../errors/badRequestError";

const getHomePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const watches = await WatchService.getAllWatches();
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
const getWatch = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const watch = await WatchService.getWatch(id);
    console.log(watch);
    res.render("watches/watch_information", {
      watch,
      comments: watch.comments ?? [],
      title: watch?.watchName ?? "Watch"
    });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.render("watches/watch_information", {
        title: "Watch not found",
        member: res.locals.member,
        watch: null
      });
    } else {
      console.error(error);
    }
  }
};
export default {
  getHomePage,
  getWatch
};
