import Watch from "../models/watch.model";
import Brand from "../models/brand.model";
import { BadRequestError } from "../errors/badRequestError";

export default class WatchService {
  static async getAllWatchHandler() {
    const watches = await Watch.find().populate("brand").exec();
    return watches;
  }
  static async getWatchHandler(watchId: string) {
    const watch = await Watch.findById(watchId).exec();
    if (!watch) {
      throw new BadRequestError("Watch not found!");
    }
    return watch;
  }
  static async getAllWatches() {
    const watches = await Watch.find().populate("brand").exec();
    return watches;
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
}
