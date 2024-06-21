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
    console.log("controller", id);
    const commentData = {
      rating: req.body.rating,
      content: req.body.content,
      author: res.locals.member._id
    };
    const comment = await CommentService.createComment(id, commentData);
    const watch = await WatchService.getWatch(id);
    if (comment) {
      res.render("watches/watch_information", {
        title: watch.watchName ?? "Watch",
        watch: watch
      });
    } else {
      const watch = await WatchService.getWatch(id);
      res.render("watches/watch_information", {
        title: watch.watchName ?? "Watch",
        message: "Created watch successfully!",
        watch: watch
      });
    }
  } catch (error) {
    next(error);
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
