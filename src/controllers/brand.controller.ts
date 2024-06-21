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
      req.flash("error", result.error);
      res.redirect("/wristwonders/brands");
    }
    req.flash("message", "Create brand successfully!");
    res.redirect("/wristwonders/brands");
  } catch (error) {
    next(error);
  }
};
const updateBrand = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { brandName, brand_detail } = req.body;
  try {
    const updatedBrand = await BrandService.updateBrand(id, brandName);
    if (updatedBrand.error) {
      req.flash("error", updatedBrand.error);
      if (brand_detail === "detail") {
        res.redirect(`/wristwonders/brands/${id}`);
      } else {
        res.redirect("/wristwonders/brands");
      }
    } else {
      req.flash("message", "Update brand successfully!");
      if (brand_detail === "detail") {
        res.redirect(`/wristwonders/brands/${id}`);
      }
      res.redirect("/wristwonders/brands");
    }
  } catch (error) {
    next(error);
  }
};

const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { brand_detail } = req.body;
  try {
    const deletedBrand = await BrandService.deleteBrand(id);
    if (deletedBrand.error) {
      req.flash("error", deletedBrand.error);
      if (brand_detail === "detail") {
        res.redirect(`/wristwonders/brands/${id}`);
      } else {
        res.redirect("/wristwonders/brands");
      }
    } else {
      req.flash("message", "Delete brand successfully!");
      res.redirect("/wristwonders/brands");
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
