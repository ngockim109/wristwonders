// brand.service.js
import Brand from "../models/brand.model";
import Watch from "../models/watch.model";
import { BadRequestError } from "../errors/badRequestError";

class BrandService {
  static async getAllBrands() {
    const brands = await Brand.find().exec();
    return brands;
  }
  static async getBrand(brandId: string) {
    const brand = await Brand.findById(brandId).exec();
    if (!brand) {
      throw new BadRequestError("Brand not found!");
    }
    return brand;
  }

  static async createBrand(brandName: string) {
    const existingBrand = await Brand.findOne({ brandName });
    if (existingBrand) {
      throw new BadRequestError("Brand name already exists!");
    } else {
      const newBrand = new Brand({ brandName });
      await newBrand.save();
      return newBrand;
    }
  }
  static async updateBrand(id: string, brandName: string) {
    const brand = await Brand.findById(id);
    if (brand.brandName === brandName) {
      throw new BadRequestError(
        "The new brand name cannot be the same as the old brand name!"
      );
    }
    const existingBrand = await Brand.findOne({ brandName });
    if (existingBrand) {
      throw new BadRequestError("Brand name already exists!");
    } else {
      const updatedBrand = await Brand.findByIdAndUpdate(
        id,
        { brandName },
        { new: true }
      );
      return updatedBrand;
    }
  }

  static async deleteBrand(id: string) {
    const existingBrand = await Brand.findById(id);
    console.log(existingBrand);
    if (existingBrand) {
      const watches = await Watch.find({ brand: id });
      if (watches.length > 0) {
        throw new BadRequestError(
          "Brand cannot be deleted because there are watches associated with it!"
        );
      } else {
        const deletedBrand = await Brand.findByIdAndDelete(id);
        return deletedBrand;
      }
    } else {
      throw new BadRequestError("Brand does not exists!");
    }
  }
}

export default BrandService;
