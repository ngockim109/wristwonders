import express, { Response, Request, NextFunction } from "express";
import memberRoute from "./member.route";
import errorRoute from "./error.route";
import userRoute from "./user.route";
import authRoute from "./auth.route";
import { checkUser } from "../middlewares/authentication.middleware";
import { requireAuthor } from "../middlewares/authorization.middleware";
import { NotFoundError } from "../errors/notFoundError";
import mainRoute from "./main.route";

const router = express.Router();

router.use(checkUser);

router.use("/", mainRoute);
router.use("/auth", authRoute);
router.use("/members", memberRoute);
router.use("/users", requireAuthor([true]), userRoute);
router.use("/error", errorRoute);

// test 500 error
router.get(
  "/cause-error",
  (req: Request, res: Response, next: NextFunction) => {
    next(new Error("Trigger 500 error page"));
  }
);
router.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
});

export default router;
