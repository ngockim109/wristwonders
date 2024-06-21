import express from "express";
import mainController from "../controllers/main.controller";

const mainRoute = express.Router();

mainRoute.get("/", mainController.getHomePage);
mainRoute.get("/watches/collection/:id", mainController.getWatch);

export default mainRoute;
