import { NextFunction, Request, Response } from "express";
import WatchService from "../services/watch.service";
import BrandService from "../services/brand.service";

const getHomePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const watches = await WatchService.getAllWatches();
    const brands = await BrandService.getAllBrands();
    const data = { watches: watches, brands: brands };
    res
      .status(200)
      .json({ message: "Get data in home page successfully", data: data });
  } catch (err) {
    next(err);
  }
};
const getWatch = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const watch = await WatchService.getWatch(id);
    const totalComments = watch?.comments?.length || 0;
    const totalRating =
      watch?.comments?.reduce((sum, comment) => sum + comment.rating, 0) || 0;
    const averageRating = totalComments
      ? parseFloat((totalRating / totalComments).toFixed(2))
      : 0;
    res.status(200).json({
      message: "Get watch successfully!",
      data: {
        ...watch.toObject(),
        totalComments,
        averageRating
      }
    });
  } catch (error) {
    next(error);
  }
};
const searchWatch = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query.query as string;
  try {
    const watches = await WatchService.searchWatches(query);
    const brands = await BrandService.getAllBrands();
    res.status(200).json({
      message: "Search watch successfully!",
      data: { watches: watches, brands: brands, query: query }
    });
  } catch (error) {
    next(error);
  }
};
const filterWatchesByBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filterBrandName = (req.query.brand as string) ?? "";
    const allWatches = await WatchService.getAllWatches();
    const brands = await BrandService.getAllBrands();
    // if (!filterBrandName) {

    //   res.render("home", {
    //     watches: allWatches,
    //     brands,
    //     filterBrandName,
    //     title: "WristWonders"
    //   });
    // }
    const watches =
      filterBrandName === "All"
        ? allWatches
        : await WatchService.getWatchesByBrand(filterBrandName);
    console.log(filterBrandName);
    res.status(200).json({
      message: "Filter brand successfully!",
      data: {
        watches: watches,
        brands: brands,
        filterBrandName: filterBrandName
      }
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getHomePage,
  getWatch,
  searchWatch,
  filterWatchesByBrand
};
