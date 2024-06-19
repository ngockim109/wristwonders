import express from "express";
import brandController from "../controllers/brand.controller";

const brandRoute = express.Router();

brandRoute.get("/brand-management", brandController.getAllBrands);
brandRoute.post("/brand-management", brandController.createBrand);
brandRoute.put("/brand-management/:id", brandController.updateBrand);
brandRoute.delete("/brand-management/:id", brandController.deleteBrand);
export default brandRoute;
