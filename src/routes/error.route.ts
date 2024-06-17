import express, { Response, Request } from "express";

const errorRoute = express.Router();
errorRoute.get("/403", (req: Request, res: Response) =>
  res.render("error/403")
);
errorRoute.get("/404", (req: Request, res: Response) =>
  res.render("error/404")
);

export default errorRoute;
