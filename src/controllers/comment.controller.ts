import { Unauthorized } from "../errors/unauthorizedError";
import CommentService from "../services/comment.service";
import WatchService from "../services/watch.service";

const getAllComments = async (req, res, next) => {
  try {
    const { id } = req.params.id;
    const comments = await CommentService.getAllComments(id);
    res.render("watches", {
      comments: comments,
      title: "Watches"
    });
  } catch (error) {
    next(error);
  }
};

const createComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = res.locals.member;
    if (member.isAdmin) {
      req.flash("error", "Admin cannot comment!");
      res.redirect(`/wristwonders/watches/collection/${id}`);
    }
    const memberId = res.locals.member._id;
    const commentData = {
      rating: req.body.rating,
      content: req.body.content,
      author: res.locals.member._id
    };
    const comment = await CommentService.createComment(
      id,
      commentData,
      memberId
    );
    if (comment.comment) {
      req.flash("message", "Created comment successfully!");
      res.redirect(`/wristwonders/watches/collection/${id}`);
    } else {
      if (comment.error) {
        req.flash("error", comment.error);
        res.redirect(`/wristwonders/watches/collection/${id}`);
      }
    }
  } catch (error) {
    if (error instanceof Unauthorized) {
      res.redirect("/wristwonders/error/403");
    } else {
      next(error);
    }
  }
};

const getMemberFeedbacks = async (req, res, next) => {
  try {
    const memberId = req.locals.member._id;
    const comments = await CommentService.getMemberFeedbacks(memberId);
    res.render("members/member_feedbacks", {
      comments: comments,
      title: "Member Feedbacks"
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
