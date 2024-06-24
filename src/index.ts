import { config } from "./config/dotenv.config";
import mongoose from "mongoose";
import express, { NextFunction, Request, Response } from "express";
import router from "./routes/index.route";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.middleware";
import path from "path";
import methodOverride from "method-override";
import moment from "moment";
import session from "express-session";
import flash from "connect-flash";
import cors from "cors";

const app = express();

const StartServer = () => {
  // cors
  app.use(
    cors({
      origin: "http://localhost:5173/",
      credentials: true
    })
  );

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static("public"));
  app.use(methodOverride("_method"));

  // cookie
  app.use(cookieParser());

  // section
  app.use(
    session({
      secret: "node js",
      resave: false,
      saveUninitialized: true
    })
  );

  // flash
  app.use(flash());

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.message = req.flash("message");
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    res.locals.data = req.flash("data");
    next();
  });

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
        },
        formatDate: function (date) {
          return moment(date).format("DD/MM/YYYY");
        },

        formatDateTime: function (date) {
          return moment(date).format("DD/MM/YYYY hh:mm:ss");
        },
        isEmpty: function (value) {
          return !value || (Array.isArray(value) && value.length === 0);
        },
        toUpperCase: function (str) {
          return str.toUpperCase();
        },
        formatWatchAutomatic: function (option: boolean) {
          return option ? "Yes" : "No";
        },
        eq: function (a: number, b: number) {
          return a === b;
        },
        stringCompare: function (a: string, b: string) {
          if (!a || !b) {
            return false;
          }
          return a === b;
        },
        compare: function (a: any, b: any) {
          return a.toString() === b.toString();
        },
        hasElements: function (array) {
          return Array.isArray(array) && array.length > 0;
        }
      },
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
      }
    })
  );
  app.set("view engine", "handlebars");
  app.set("views", path.join(__dirname, "views"));
  // Static files
  app.use(express.static(path.join(__dirname, "public")));

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
    StartServer();
  })
  .catch((error) => console.error(error));
