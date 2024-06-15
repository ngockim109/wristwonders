import express, { Request, Response } from "express";
import { createUserSchema } from "./validateSchema/createUserSchema.validate.schema";
import validate from "../utils/validate";
import memberController from "../controllers/member.controller";

const authRoute = express.Router();

authRoute.get("/register", (req: Request, res: Response) => {
  res.render("register", { title: "Register" });
});

authRoute.post(
  "/register",
  validate(createUserSchema),
  memberController.createMember
);
authRoute.get("/login", (req: Request, res: Response) => {
  res.render("login", { title: "Login" });
});

authRoute.post("/login");

export default authRoute;
