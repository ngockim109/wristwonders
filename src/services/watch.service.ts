import Watch from "../models/watch.model";
import Brand from "../models/brand.model";
import { BadRequestError } from "../errors/badRequestError";

export default class WatchService {
  static async getAllWatches() {
    const watches = await Watch.find().populate("brand").exec();
    return watches;
  }
  static async getWatchesByBrand(brandName: string) {
    const brand = await Brand.findOne({ brandName });
    if (!brand)
      return {
        error: "Brand not found"
      };
    const watches = await Watch.find({ brand: brand._id })
      .populate("brand")
      .exec();
    console.log(watches);
    return { watches: watches };
  }

  static async getWatch(watchId: string) {
    console.log(watchId);
    const watch = await Watch.findById(watchId)
      .populate("brand")
      .populate({ path: "comments.author", select: "name membername" })
      .exec();
    if (!watch) {
      throw new BadRequestError("Watch not found!");
    }
    return watch;
  }

  static async createWatch(data) {
    const newWatch = new Watch(data);
    await newWatch.save();
    return { watch: newWatch };
  }

  static async updateWatch(id: string, data) {
    const watch = await Watch.findById(id);
    if (!watch) {
      return { error: "Watch not found!" };
    }
    if (watch.watchName === data.watchName) {
      return {
        error: "The new watch name cannot be the same as the old watch name!"
      };
    }
    const brand = await Brand.findById(data.brandId);
    const newBrand = await Brand.findById(data.brandName);
    console.log(brand);
    console.log(data.brandId);
    console.log(data.brandName);
    if (!brand) {
      return {
        error: "Brand does not exits!"
      };
    } else {
      if (!newBrand) {
        return {
          error: "Brand name does not exits!"
        };
      } else {
        const updatedWatch = await Watch.findByIdAndUpdate(
          id,
          { ...data, brand: newBrand },
          {
            new: true
          }
        ).populate("brand");
        return { watch: updatedWatch };
      }
    }
  }

  static async deleteWatch(id) {
    const existingWatch = await Watch.findById(id);
    if (!existingWatch) {
      return { error: "Watch does not exist!" };
    } else {
      const deletedWatch = await Watch.findByIdAndDelete(id);
      return { watch: deletedWatch };
    }
  }
  static async searchWatches(query: string) {
    try {
      const regex = new RegExp(query, "i");
      // const watches = await Watch.find({
      //   $or: [
      //     { watchName: { $regex: regex } },
      //     { watchDescription: { $regex: regex } }
      //   ]
      // }).populate("brand");
      const watches = await Watch.find({
        watchName: { $regex: regex }
      }).populate("brand");
      return watches;
    } catch (error) {
      throw new Error(`Error while searching watches: ${error.message}`);
    }
  }
}
