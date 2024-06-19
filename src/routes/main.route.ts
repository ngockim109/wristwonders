import express from "express";
import mainController from "../controllers/main.controller";

const mainRoute = express.Router();

mainRoute.get("/", mainController.getHomePage);

export default mainRoute;
