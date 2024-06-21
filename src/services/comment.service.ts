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

  static async createComment(watchId: string, commentData) {
    console.log("service", watchId);
    const comment = new commentModel(commentData);
    await comment.save();

    // Add comment to the watch's comments array
    const watch = await Watch.findById(watchId);
    watch.comments.push(comment);
    await watch.save();

    return comment;
  }
}

export default CommentService;
