import Watch from "../models/watch.model";
import { BadRequestError } from "../errors/badRequestError";

export default class WatchService {
  static async getAllWatchHandler() {
    const watches = await Watch.find().exec();
    return watches;
  }
  static async getWatchHandler(watchId: string) {
    const watch = await Watch.findById(watchId).exec();
    if (!watch) {
      throw new BadRequestError("Watch not found!");
    }
    return watch;
  }
}
