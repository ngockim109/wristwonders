import { Request, Response, NextFunction } from "express";
import BrandService from "../services/brand.service";
import { BadRequestError } from "../errors/badRequestError";

const getAllBrands = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brands = await BrandService.getAllBrands();
    if (brands) {
      res.render("brands", {
        brands: brands,
        title: "Brands",
        layout: false
      });
    }
  } catch (error) {
    next(error);
  }
};
const getBrand = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const brand = await BrandService.getBrand(id);
    if (brand) {
      res.render("brands/brand_detail", {
        brand: brand,
        title: brand?.brandName ?? "Brands",
        layout: false
      });
    }
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.render("brands/brand_detail", {
        title: "Brand not found",
        member: res.locals.member,
        brand: null,
        layout: false
      });
    } else {
      console.error(error);
    }
  }
};

const createBrand = async (req: Request, res: Response, next: NextFunction) => {
  const { brandName } = req.body;
  try {
    const result = await BrandService.createBrand(brandName);
    if (result.error) {
      res.render("brands", {
        title: "Brands",
        error: result.error,
        brands: await BrandService.getAllBrands(),
        layout: false
      });
    }
    res.render("brands", {
      title: "Brands",
      message: "Create brand successfully!",
      brand: result.brand,
      brands: await BrandService.getAllBrands(),
      layout: false
    });
  } catch (error) {
    next(error);
  }
};
const updateBrand = async (req, res, next) => {
  const { id } = req.params;
  const { brandName, brand_detail } = req.body;
  try {
    const updatedBrand = await BrandService.updateBrand(id, brandName);
    if (updatedBrand.error) {
      if (brand_detail === "detail") {
        return res.render("brands/brand_detail", {
          title: brandName ?? "Brands",
          error: updatedBrand?.error,
          brand: await BrandService.getBrand(id),
          layout: false
        });
      } else {
        return res.render("brands", {
          title: "Brands",
          error: updatedBrand?.error,
          brands: await BrandService.getAllBrands(),
          layout: false
        });
      }
    } else {
      if (brand_detail === "detail") {
        res.render("brands/brand_detail", {
          title: brandName ?? "Brands",
          message: "Update brand successfully!",
          brand: await BrandService.getBrand(id),
          layout: false
        });
      }
      res.render("brands", {
        title: "Brands",
        message: "Update brand successfully!",
        brand: updatedBrand,
        brands: await BrandService.getAllBrands(),
        layout: false
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteBrand = async (req, res, next) => {
  const { id } = req.params;
  const { brand_detail } = req.body;
  try {
    const deletedBrand = await BrandService.deleteBrand(id);
    if (deletedBrand.error) {
      if (brand_detail === "detail") {
        return res.render("brands/brand_detail", {
          title: (await BrandService.getBrand(id))?.brandName ?? "",
          error: deletedBrand.error,
          brand: await BrandService.getBrand(id),
          layout: false
        });
      } else {
        return res.render("brands", {
          title: "Brands",
          error: deletedBrand.error,
          brands: await BrandService.getAllBrands(),
          layout: false
        });
      }
    } else {
      res.render("brands", {
        title: "Brands",
        message: "Delete brand successfully!",
        brands: await BrandService.getAllBrands(),
        layout: false
      });
    }
  } catch (error) {
    next(error);
  }
};
export default {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand
};
