import { NextFunction, Request, Response } from "express";
import CommentService from "../services/comment.service";
import WatchService from "../services/watch.service";

const getAllComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const comments = await CommentService.getAllComments(id);
    res
      .status(200)
      .json({ message: "Get all comments successfully!", data: comments });
  } catch (error) {
    next(error);
  }
};

const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const member = res.locals.member;
    const memberId = res.locals.member._id;
    const commentData = {
      rating: req.body.rating,
      content: req.body.content,
      author: res.locals.member._id
    };
    const comment = await CommentService.createComment(
      id,
      commentData,
      memberId,
      member
    );
    res
      .status(201)
      .json({ message: "Created comment successfully!", data: comment });
  } catch (error) {
    next(error);
  }
};

const getMemberFeedbacks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const memberId = res.locals.member._id;
    const comments = await WatchService.getMemberFeedbacks(memberId);
    res.status(200).json({
      message: "Get member feedbacks successfully!",
      data: comments
    });
  } catch (error) {
    next(error);
  }
};
export default {
  getAllComments,
  getMemberFeedbacks,
  createComment
};
