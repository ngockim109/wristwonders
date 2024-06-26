import express, { Request, Response } from "express";
import { createUserSchema } from "./validateSchema/createUserSchema.validate.schema";
import validate from "../utils/validate";
import memberController from "../controllers/member.controller";
import authController from "../controllers/auth.controller";
import { loginSchema } from "./validateSchema/loginSchema.validate.schema";

const authRoute = express.Router();

authRoute.get("/register", (req: Request, res: Response) => {
  res.render("register", { title: "Register" });
});

authRoute.post(
  "/register",
  // validate(createUserSchema),
  memberController.createMember
);
authRoute.get("/login", (req: Request, res: Response) => {
  res.render("login", { title: "Login" });
});

authRoute.post("/login", validate(loginSchema), authController.login);
authRoute.get("/logout", authController.logout);

export default authRoute;
