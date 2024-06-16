import express, { Response, Request } from "express";
import memberRoute from "./member.route";
import userRoute from "./user.route";
import authRoute from "./auth.route";
import { checkUser, requireAuth } from "../middlewares/auth.middleware";
const router = express.Router();

// router.get("*", checkUser);
router.use("/", authRoute);

router.use("/members", memberRoute);
router.use("/users", userRoute);
router.get("/", (req: Request, res: Response) => res.render("home"));

export default router;
