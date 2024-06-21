import express from "express";
import mainController from "../controllers/main.controller";

const mainRoute = express.Router();

mainRoute.get("/", mainController.getHomePage);
mainRoute.get("/watches/collection/:id", mainController.getWatch);
// mainRoute.get("/watches/collection/search", mainController.searchWatch);
mainRoute.get("/watches/search", mainController.searchWatch);
mainRoute.get("/watches/filter", mainController.filterWatchesByBrand);

export default mainRoute;
