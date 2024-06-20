import { requireAuthor } from "./../middlewares/authorization.middleware";
import express from "express";
import brandController from "../controllers/brand.controller";

const brandRoute = express.Router();

brandRoute.get("/", requireAuthor([true]), brandController.getAllBrands);
brandRoute.get("/:id", requireAuthor([true]), brandController.getBrand);
brandRoute.post("/", requireAuthor([true]), brandController.createBrand);
brandRoute.put("/:id", requireAuthor([true]), brandController.updateBrand);
brandRoute.delete("/:id", requireAuthor([true]), brandController.deleteBrand);
export default brandRoute;
