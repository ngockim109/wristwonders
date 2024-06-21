import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/badRequestError";
import BrandService from "../services/brand.service";
import WatchService from "../services/watch.service";

const getAllWatches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const watches = await WatchService.getAllWatches();
    res.render("watches", {
      watches: watches,
      brands: await BrandService.getAllBrands(),
      title: "Watches",
      layout: false
    });
  } catch (error) {
    next(error);
  }
};

const getWatch = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const watch = await WatchService.getWatch(id);
    console.log(watch);
    res.render("watches/watch_detail", {
      watch,
      title: watch?.watchName ?? "Watch",
      brands: await BrandService.getAllBrands(),
      layout: false
    });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.render("watches/watch_detail", {
        title: "Watch not found",
        member: res.locals.member,
        watch: null,
        layout: false
      });
    } else {
      console.error(error);
    }
  }
};

const createWatch = async (req: Request, res: Response, next: NextFunction) => {
  const { watchName, image, price, automatic, watchDescription, brand } =
    req.body;
  try {
    const result = await WatchService.createWatch({
      watchName,
      image,
      price,
      automatic,
      watchDescription,
      brand
    });

    if (result) {
      req.flash("message", "Created watch successfully!");
      res.redirect("/wristwonders/watches");
    } else {
      req.flash("error", "Created watch failed!");
      res.redirect("/wristwonders/watches");
    }
  } catch (error) {
    next(error);
  }
};

const updateWatch = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const {
    watchName,
    image,
    price,
    automatic,
    watchDescription,
    brandName,
    watch_detail,
    brandId
  } = req.body;
  try {
    console.log(brandId);
    const updatedWatch = await WatchService.updateWatch(id, {
      watchName,
      image,
      price,
      automatic,
      watchDescription,
      brandName,
      brandId
    });
    if (updatedWatch.error) {
      req.flash("error", updatedWatch.error);
      if (watch_detail === "detail") {
        res.redirect(`/wristwonders/watches/${id}`);
      } else {
        res.redirect("/wristwonders/watches");
      }
    } else {
      req.flash("message", "Updated watch successfully!");
      if (watch_detail === "detail") {
        res.redirect(`/wristwonders/watches/${id}`);
      } else {
        res.redirect("/wristwonders/watches");
      }
    }
  } catch (error) {
    next(error);
  }
};

const deleteWatch = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { watch_detail } = req.body;
  try {
    const deletedWatch = await WatchService.deleteWatch(id);
    if (deletedWatch.error) {
      req.flash("error", deletedWatch.error);
      if (watch_detail === "detail") {
        res.redirect(`/wristwonders/watches/${id}`);
      } else {
        res.redirect("/wristwonders/watches");
      }
    } else {
      req.flash("message", "Deleted watch successfully!");
      res.redirect("/wristwonders/watches");
    }
  } catch (error) {
    next(error);
  }
};

export default {
  getAllWatches,
  getWatch,
  createWatch,
  updateWatch,
  deleteWatch
};
