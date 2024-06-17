import express, { Response, Request } from "express";

const errorRoute = express.Router();
errorRoute.get("/403", (req: Request, res: Response) =>
  res.render("error/403", {
    title: "Forbidden"
  })
);
errorRoute.get("/404", (req: Request, res: Response) =>
  res.render("error/404", {
    title: "Page Not Found"
  })
);
errorRoute.get("/500", (req: Request, res: Response) =>
  res.render("error/500", {
    title: "Internal Server Error"
  })
);

export default errorRoute;
