import { requireAuthor } from "./../middlewares/authorization.middleware";
import express from "express";
import brandController from "../controllers/brand.controller";

const brandRoute = express.Router();

brandRoute.get(
  "/brand-management",
  requireAuthor([true]),
  brandController.getAllBrands
);
brandRoute.post(
  "/brand-management",
  requireAuthor([true]),
  brandController.createBrand
);
brandRoute.put(
  "/brand-management/:id",
  requireAuthor([true]),
  brandController.updateBrand
);
brandRoute.delete(
  "/brand-management/:id",
  requireAuthor([true]),
  brandController.deleteBrand
);
export default brandRoute;
