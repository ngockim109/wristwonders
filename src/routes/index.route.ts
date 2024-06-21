import express, { Response, Request, NextFunction } from "express";
import memberRoute from "./member.route";
import errorRoute from "./error.route";
import authRoute from "./auth.route";
import { checkUser } from "../middlewares/authentication.middleware";
import { NotFoundError } from "../errors/notFoundError";
import mainRoute from "./main.route";
import brandRoute from "./brand.route";
import watchRoute from "./watch.route";
import adminRoute from "./admin.route";
import accountRoute from "./account.route";
import commentRoute from "./comment.route";

const router = express.Router();

router.use(checkUser);

router.use("/", mainRoute);
router.use("/auth", authRoute);
router.use("/members", memberRoute);
router.use("/accounts", accountRoute);
router.use("/admin", adminRoute);
router.use("/", commentRoute);
router.use("/brands", brandRoute);
router.use("/watches", watchRoute);
router.use("/error", errorRoute);
router.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
});

export default router;
