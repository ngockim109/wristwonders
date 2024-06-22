import express, { Request, Response } from "express";
import { createUserSchema } from "./validateSchema/createUserSchema.validate.schema";
import validate from "../middlewares/validate.middleware";
import memberController from "../controllers/member.controller";
import authController from "../controllers/auth.controller";
import { loginSchema } from "./validateSchema/loginSchema.validate.schema";
import passport from "../config/passport.config";
const authRoute = express.Router();

authRoute.get("/register", (req: Request, res: Response) => {
  !res.locals.member
    ? res.render("auth/register", { title: "Register" })
    : res.redirect("/wristwonders");
});

authRoute.post(
  "/register",
  validate(createUserSchema),
  memberController.createMember
);
authRoute.get("/login", (req: Request, res: Response) => {
  !res.locals.member
    ? res.render("auth/login", { title: "Login" })
    : res.redirect("/wristwonders");
});

authRoute.post("/login", validate(loginSchema), authController.login);
authRoute.get("/logout", authController.logout);
authRoute.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "email",
      "profile",
      "https://www.googleapis.com/auth/user.birthday.read"
    ]
  })
);

authRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/wristwonders",
    failureRedirect: "/wristwonders/auth/login"
  }),
  (req: Request, res: Response) => {
    res.redirect("/wristwonders");
  }
);

export default authRoute;
