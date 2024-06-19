import { Request, Response, NextFunction } from "express";
import BrandService from "../services/brand.service";

const getAllBrands = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brands = await BrandService.getAllBrands();
    if (brands) {
      res.render("brands/brand_management", {
        brands: brands,
        title: "Brands"
      });
    }
  } catch (error) {
    next(error);
  }
};

const createBrand = async (req: Request, res: Response, next: NextFunction) => {
  const { brandName } = req.body;
  try {
    const result = await BrandService.createBrand(brandName);
    if (result.error) {
      res.render("brands/brand_management", {
        title: "Brands",
        error: result.error,
        brands: await BrandService.getAllBrands()
      });
    }
    res.render("brands/brand_management", {
      title: "Brands",
      message: "Create brand successfully!",
      brand: result.brand,
      brands: await BrandService.getAllBrands()
    });
  } catch (error) {
    next(error);
  }
};
const updateBrand = async (req, res, next) => {
  const { id } = req.params;
  const { brandName } = req.body;
  try {
    const updatedBrand = await BrandService.updateBrand(id, brandName);
    if (updatedBrand.error) {
      return res.render("brands/brand_management", {
        title: "Brands",
        error: updatedBrand?.error,
        brands: await BrandService.getAllBrands()
      });
    } else {
      res.render("brands/brand_management", {
        title: "Brands",
        message: "Update brand successfully!",
        brand: updatedBrand,
        brands: await BrandService.getAllBrands()
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteBrand = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedBrand = await BrandService.deleteBrand(id);
    if (deletedBrand.error) {
      return res.render("brands/brand_management", {
        title: "Brands",
        error: deletedBrand.error,
        brands: await BrandService.getAllBrands()
      });
    } else {
      res.render("brands/brand_management", {
        title: "Brands",
        message: "Delete brand successfully!",
        brands: await BrandService.getAllBrands()
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export default {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand
};
