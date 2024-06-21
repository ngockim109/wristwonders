import { commentModel } from "../models/comment.model";
import Watch from "../models/watch.model";
class CommentService {
  static async getAllComments(watchId: string) {
    const watch = await Watch.findById(watchId).populate(
      "comments.author",
      "membername name"
    );
    if (!watch) {
      throw new Error("Watch not found");
    }
    return watch.comments;
  }
  static async getMemberFeedbacks(memberId: string) {
    return commentModel
      .find({ author: memberId })
      .populate("author", "membername name");
  }

  static async createComment(watchId: string, commentData, memberId: string) {
    const watch = await Watch.findById(watchId);
    if (!commentData.rating) {
      return {
        error: "Rating is required!"
      };
    }
    if (commentData.rating > 3 || commentData.rating < 1) {
      return {
        error: "Rating must be 1-3 star!"
      };
    }
    const existingComment = await watch.comments.find((comment) =>
      comment.author.equals(memberId)
    );
    if (existingComment) {
      return {
        error: "You have already commented on this watch!"
      };
    } else {
      const comment = new commentModel(commentData);
      await comment.save();
      const watch = await Watch.findById(watchId);
      watch.comments.push(comment);
      await watch.save();

      return { comment: comment };
    }
  }
}

export default CommentService;
