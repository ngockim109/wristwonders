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
    if (!brand) throw new BadRequestError("Brand not found");
    const watches = await Watch.find({ brand: brand._id })
      .populate("brand")
      .exec();
    console.log(watches);
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
    return newWatch;
  }

  static async updateWatch(id: string, data) {
    const watch = await Watch.findById(id);
    if (!watch) {
      throw new BadRequestError("Watch not found!");
    }
    const result = data.automatic ? data.automatic : watch.automatic;
    if (
      watch.watchName === data.watchName &&
      watch.image === data.image &&
      watch.watchDescription === data.watchDescription &&
      watch.price === Number(data.price) &&
      watch.automatic === result
    ) {
      throw new BadRequestError(
        "The new watch information cannot be the same as the old watch!"
      );
    }
    const brand = await Brand.findById(data.brandId);
    const newBrand = await Brand.findById(data.brandName);
    if (!brand) {
      throw new BadRequestError("Brand does not exits!");
    } else {
      if (!newBrand) {
        throw new BadRequestError("Brand name does not exits!");
      } else {
        const updatedWatch = await Watch.findByIdAndUpdate(
          id,
          { ...data, brand: newBrand },
          {
            new: true
          }
        ).populate("brand");
        return updatedWatch;
      }
    }
  }

  static async deleteWatch(id) {
    const existingWatch = await Watch.findById(id);
    if (!existingWatch) {
      throw new BadRequestError("Watch does not exits!");
    } else {
      if (existingWatch?.comments?.length > 0) {
        throw new BadRequestError("Cannot delete watch already has comment!");
      }
      const deletedWatch = await Watch.findByIdAndDelete(id);
      return deletedWatch;
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
  // comments
  static async getMemberFeedbacks(memberId: string) {
    try {
      const watches = await Watch.find({
        "comments.author": memberId
      })
        .populate({
          path: "comments",
          match: { author: memberId },
          populate: { path: "author", select: "membername name" }
        })
        .populate("brand")
        .select("watchName image brand")
        .exec();

      const comments = watches.reduce((acc, watch) => {
        watch.comments.forEach((comment) => {
          if (comment.author._id.toString() === memberId.toString()) {
            acc.push({
              watch: watch,
              image: watch.image,
              ...comment.toObject()
            });
          }
        });
        return acc;
      }, []);

      return comments;
    } catch (error) {
      throw new Error(`Error retrieving member's feedbacks: ${error.message}`);
    }
  }
}
