import { NextFunction, Request, Response } from "express";
import WatchService from "../services/watch.service";
import { BadRequestError } from "../errors/badRequestError";
import BrandService from "../services/brand.service";

const getHomePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const watches = await WatchService.getAllWatches();
    const brands = await BrandService.getAllBrands();
    if (res.locals.member) {
      const { membername, name, YOB, isAdmin } = res.locals.member;
      const newMember = { membername, name, YOB, isAdmin };
      res.render("home", {
        title: "WristWonders",
        member: newMember,
        watches: watches,
        brands: brands
      });
    } else {
      res.render("home", {
        title: "WristWonders",
        watches: watches,
        brands: brands
      });
    }
  } catch (err) {
    next(err);
  }
};
const getWatch = async (req: Request, res: Response) => {
  const { id } = req.params;
  const member = res.locals.member;
  try {
    const watch = await WatchService.getWatch(id);
    res.render("watches/watch_information", {
      watch,
      comments: watch.comments ?? [],
      title: watch?.watchName ?? "Watch",
      member: member
    });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.render("watches/watch_information", {
        title: "Watch not found",
        member: member,
        watch: null
      });
    } else {
      console.error(error);
    }
  }
};
const searchWatch = async (req: Request, res: Response) => {
  const query = req.query.query as string;
  try {
    const watches = await WatchService.searchWatches(query);
    res.render("watches/search_result", {
      watches,
      query,
      title: "WristWonders"
    });
  } catch (error) {
    req.flash("error", `Failed to search watches: ${error.message}`);
    res.redirect("/wristwonders");
  }
};
const filterWatchesByBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const brandName = req.query.brand as string;
    const allWatches = await WatchService.getAllWatches();
    const brands = await BrandService.getAllBrands();
    if (!brandName) {
      res.render("home", {
        allWatches,
        brands,
        brandName,
        title: "WristWonders",
        error: "Brand name is required!"
      });
      // req.flash("error", "Brand name is required");
      // return res.redirect("/wristwonders");
    }
    const watches = await WatchService.getWatchesByBrand(brandName);
    if (watches.error) {
      res.render("home", {
        watches,
        brands,
        brandName,
        title: "WristWonders",
        error: watches.error
      });
      // req.flash("error", watches.error);
      // return res.redirect("/wristwonders");
    }
    if (watches.watches) {
      res.render("home", {
        watches: watches.watches,
        brands: brands,
        brandName: brandName,
        title: "WristWonders"
      });
    }
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
