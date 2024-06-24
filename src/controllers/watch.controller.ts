import { NextFunction, Request, Response } from "express";
import BrandService from "../services/brand.service";
import WatchService from "../services/watch.service";

const getAllWatches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const watches = await WatchService.getAllWatches();
    const brands = await BrandService.getAllBrands();
    res.status(200).json({ data: { watches: watches, brands: brands } });
  } catch (error) {
    next(error);
  }
};

const getWatch = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const watch = await WatchService.getWatch(id);
    const brands = await BrandService.getAllBrands();
    res.status(200).json({ data: { watch: watch, brands: brands } });
  } catch (error) {
    next(error);
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
      res.status(200).json({ message: "Created watch successfully!" });
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

    res.status(200).json({ message: "Updated watch successfully!" });
  } catch (error) {
    next(error);
  }
};

const deleteWatch = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const deletedWatch = await WatchService.deleteWatch(id);
    res.status(200).json({ message: "Deleted watch successfully!" });
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
