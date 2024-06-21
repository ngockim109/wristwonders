import { requireAuthor } from "./../middlewares/authorization.middleware";
import express from "express";
import commentController from "../controllers/comment.controller";

const commentRoute = express.Router();

commentRoute.post(
  "/watches/collection/:id",
  requireAuthor([false]),
  commentController.createComment
);
export default commentRoute;
