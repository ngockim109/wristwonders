// brand.service.js
import Brand from "../models/brand.model";
import { BadRequestError } from "../errors/badRequestError";

class BrandService {
  static async getAllBrands() {
    const brands = await Brand.find().exec();
    return brands;
  }

  static async createBrand(brandName: string) {
    const existingBrand = await Brand.findOne({ brandName });
    if (existingBrand) {
      return { error: "Brand name already exists!" };
    } else {
      const newBrand = new Brand({ brandName });
      await newBrand.save();
      return { brand: newBrand };
    }
  }
  static async updateBrand(id, brandName) {
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { brandName },
      { new: true }
    );
    return updatedBrand;
  }

  static async deleteBrand(id) {
    const deletedBrand = await Brand.findByIdAndDelete(id);
    return deletedBrand;
  }
}

export default BrandService;
