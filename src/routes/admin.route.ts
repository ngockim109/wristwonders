import express from "express";
import memberController from "../controllers/member.controller";
import {
  requireAuthor,
  requireSelf
} from "../middlewares/authorization.middleware";

const adminRoute = express.Router();

adminRoute.get(
  "/profile",
  requireSelf,
  requireAuthor([true]),
  memberController.getAdminProfile
);
export default adminRoute;
