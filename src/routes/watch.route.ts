import express from "express";
import watchController from "../controllers/watch.controller";
import { requireAuthor } from "./../middlewares/authorization.middleware";

const watchRoute = express.Router();

watchRoute.get("/", requireAuthor([true]), watchController.getAllWatches);
watchRoute.get("/:id", requireAuthor([true]), watchController.getWatch);
watchRoute.post("/", requireAuthor([true]), watchController.createWatch);
watchRoute.put("/:id", requireAuthor([true]), watchController.updateWatch);
watchRoute.delete("/:id", requireAuthor([true]), watchController.deleteWatch);
export default watchRoute;
