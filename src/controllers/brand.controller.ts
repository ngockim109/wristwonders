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
      res
        .status(200)
        .json({ message: "Get all brand successfully!", data: brands });
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
      res.status(200).json({ message: "Get brand successfully!", data: brand });
    }
  } catch (error) {
    next(error);
  }
};

const createBrand = async (req: Request, res: Response, next: NextFunction) => {
  const { brandName } = req.body;
  try {
    const result = await BrandService.createBrand(brandName);
    res
      .status(201)
      .json({ message: "Brand created successfully", data: result });
  } catch (error) {
    next(error);
  }
};
const updateBrand = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { brandName } = req.body;
  try {
    const updatedBrand = await BrandService.updateBrand(id, brandName);
    res
      .status(200)
      .json({ message: "Brand updated successfully", data: updatedBrand });
  } catch (error) {
    next(error);
  }
};
const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const deletedBrand = await BrandService.deleteBrand(id);
    res
      .status(200)
      .json({ message: "Brand deleted successfully", data: deletedBrand });
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
