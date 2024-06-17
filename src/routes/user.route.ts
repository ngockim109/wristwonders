import express, { Request, Response } from "express";
import userController from "../controllers/user.controller";
import validate from "../middlewares/validate.middleware";
import { createUserSchema } from "./validateSchema/createUserSchema.validate.schema";

const userRoute = express.Router();

userRoute.get("/", userController.getAllUsers);
userRoute.post("/", validate(createUserSchema), userController.createUser);
export default userRoute;
