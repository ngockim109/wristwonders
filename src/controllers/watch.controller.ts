import { BadRequestError } from "../errors/badRequestError";
import BrandService from "../services/brand.service";
import WatchService from "../services/watch.service";

const getAllWatches = async (req, res, next) => {
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

const getWatch = async (req, res, next) => {
  const { id } = req.params;
  try {
    const watch = await WatchService.getWatch(id);
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

const createWatch = async (req, res, next) => {
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
      res.render("watches", {
        title: "Watches",
        watches: await WatchService.getAllWatches(),
        brands: await BrandService.getAllBrands(),
        layout: false
      });
    } else {
      res.render("watches", {
        title: "Watches",
        message: "Created watch successfully!",
        watches: await WatchService.getAllWatches(),
        brands: await BrandService.getAllBrands(),
        layout: false
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateWatch = async (req, res, next) => {
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
      if (watch_detail === "detail") {
        return res.render("watches/watch_detail", {
          title: updatedWatch?.watch?.watchName ?? "Watch",
          error: updatedWatch?.error,
          watch: await WatchService.getWatch(id),
          brands: await BrandService.getAllBrands(),
          layout: false
        });
      } else {
        return res.render("watches", {
          title: "Watches",
          error: updatedWatch?.error,
          watches: await WatchService.getAllWatches(),
          brands: await BrandService.getAllBrands(),
          layout: false
        });
      }
    } else {
      if (watch_detail === "detail") {
        res.render("watches/watch_detail", {
          title: updatedWatch?.watch?.watchName ?? "Watch",
          message: "Updated watch successfully!",
          watch: await WatchService.getWatch(id),
          brands: await BrandService.getAllBrands(),
          layout: false
        });
      } else {
        res.render("watches", {
          title: "Watches",
          message: "Updated watch successfully!",
          watches: await WatchService.getAllWatches(),
          brands: await BrandService.getAllBrands(),
          layout: false
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

const deleteWatch = async (req, res, next) => {
  const { id } = req.params;
  const { watch_detail } = req.body;
  try {
    const deletedWatch = await WatchService.deleteWatch(id);
    if (deletedWatch.error) {
      if (watch_detail === "detail") {
        return res.render("watches/watch_detail", {
          title: (await WatchService.getWatch(id))?.watchName ?? "",
          error: deletedWatch.error,
          watch: await WatchService.getWatch(id),
          brands: await BrandService.getAllBrands(),
          layout: false
        });
      } else {
        return res.render("watches", {
          title: "Watches",
          error: deletedWatch.error,
          watches: await WatchService.getAllWatches(),
          brands: await BrandService.getAllBrands(),
          layout: false
        });
      }
    } else {
      res.render("watches", {
        title: "Watches",
        message: "Deleted watch successfully!",
        watches: await WatchService.getAllWatches(),
        brands: await BrandService.getAllBrands(),
        layout: false
      });
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
