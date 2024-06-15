import express from "express";
import memberRoute from "./member.route";
import userRoute from "./user.route";
import authRoute from "./auth.route";
const router = express.Router();

router.use("/", authRoute);

router.use("/members", memberRoute);
router.use("/users", userRoute);

export default router;
