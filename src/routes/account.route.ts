import express from "express";
import { requireAuthor } from "../middlewares/authorization.middleware";
import userController from "../controllers/user.controller";
const accountRoute = express.Router();

accountRoute.get("/", requireAuthor([true]), userController.getAllUsers);
accountRoute.get("/:id", requireAuthor([true]), userController.getUser);
accountRoute.delete("/", requireAuthor([true]), userController.deleteUser);
accountRoute.post("/", userController.createUser);
export default accountRoute;
