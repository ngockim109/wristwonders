import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 3, required: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true
    }
  },
  { timestamps: true }
);

const commentModel = mongoose.model("Comment", commentSchema);
export { commentSchema, commentModel };
