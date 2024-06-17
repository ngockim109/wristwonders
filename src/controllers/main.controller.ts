import { Request, Response } from "express";

const getHomePage = (req: Request, res: Response) => {
  const { membername, name, YOB } = res.locals.member;
  const newMember = { membername, name, YOB };
  res.render("home", { title: "WristWonders", member: newMember });
};
export default {
  getHomePage
};
