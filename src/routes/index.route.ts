import express, { Response, Request, NextFunction } from "express";
import memberRoute from "./member.route";
import errorRoute from "./error.route";
import userRoute from "./user.route";
import authRoute from "./auth.route";
import { checkUser } from "../middlewares/authentication.middleware";
import { requireAuthor } from "../middlewares/authorization.middleware";
import { RoleEnum } from "../utils/enums";
import { NotFoundError } from "../errors/notFoundError";

const router = express.Router();

router.get("*", checkUser);
router.use("/", authRoute);
router.use("/members", memberRoute);
router.use("/users", requireAuthor([RoleEnum.ADMIN]), userRoute);
router.use("/error", errorRoute);
router.get("/", (req: Request, res: Response) => res.render("home"));

router.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
});
export default router;
