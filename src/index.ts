import { config } from "./config/dotenv.config";
import mongoose from "mongoose";
import express from "express";
import router from "./routes/index.route";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.middleware";
import path from "path";
const app = express();

const StartServer = () => {
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static("public"));

  // cookie
  app.use(cookieParser());

  // view engine
  app.engine(
    "handlebars",
    engine({
      defaultLayout: "main",
      extname: ".handlebars",
      partialsDir: path.join(__dirname, "views/partials"),
      helpers: {
        isString: function (value) {
          return typeof value === "string";
        }
      }
    })
  );
  app.set("view engine", "handlebars");
  app.set("views", path.join(__dirname, "views"));
  // Static files
  app.use(express.static(path.join(__dirname, "public")));

  // Routes
  console.log("Views directory:", app.get("views"));
  // main route
  app.use("/wristwonders", router);
  app.use(errorHandler);

  // Start server
  app.listen(config.port, () => {
    console.log("Server is running on port ", config.port);
  });
};

// Connect to mongoDB
mongoose
  .connect(config.mongo_uri, { retryWrites: true, w: "majority" })
  .then(() => {
    console.log("Connected to Mongo");
    StartServer();
  })
  .catch((error) => console.error(error));
