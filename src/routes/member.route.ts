import express, { Request, Response } from "express";
import memberController from "../controllers/member.controller";
import { requireSelf } from "../middlewares/authorization.middleware";
import validate from "../middlewares/validate.middleware";
import { updatePasswordSchema } from "./validateSchema/updateProfileSchema.validate";
import { updateProfileSchema } from "./validateSchema/updatePasswordSchema.validate";
const memberRoute = express.Router();

memberRoute.get("/", memberController.getAllMembers);
memberRoute.get("/profile", requireSelf, memberController.getMember);
memberRoute.get(
  "/profile/update-profile",
  requireSelf,
  memberController.getUpdateProfile
);
memberRoute.get(
  "/profile/update-password",
  requireSelf,
  memberController.getUpdatePassword
);
memberRoute.post(
  "/profile/update-profile",
  requireSelf,
  validate(updateProfileSchema),
  memberController.updateProfile
);
memberRoute.post(
  "/profile/update-password",
  requireSelf,
  validate(updatePasswordSchema),
  memberController.updatePassword
);

export default memberRoute;
