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
    const existingBrand = await Brand.findOne({ brandName });
    if (existingBrand) {
      return { error: "Brand name already exists!" };
    } else {
      const updatedBrand = await Brand.findByIdAndUpdate(
        id,
        { brandName },
        { new: true }
      );
      return { brand: updatedBrand };
    }
  }

  static async deleteBrand(id: string) {
    const existingBrand = await Brand.findById(id);
    if (existingBrand) {
      const deletedBrand = await Brand.findByIdAndDelete(id);
      return { brand: deletedBrand };
    } else {
      return { error: "Brand does not exists!" };
    }
  }
}

export default BrandService;
