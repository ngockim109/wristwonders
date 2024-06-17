import express, { Response, Request } from "express";
import memberRoute from "./member.route";
import userRoute from "./user.route";
import authRoute from "./auth.route";
import { checkUser } from "../middlewares/authentication.middleware";
import { requireAuthor } from "../middlewares/authorization.middleware";
import { RoleEnum } from "../utils/enums";
const router = express.Router();

router.get("*", checkUser);
router.use("/", authRoute);

router.use("/members", memberRoute);
router.use("/users", requireAuthor([RoleEnum.ADMIN]), userRoute);
router.get("/", (req: Request, res: Response) => res.render("home"));

export default router;
