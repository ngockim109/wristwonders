import mongoose from "mongoose";
import { commentSchema } from "./comment.model";

const watchSchema = new mongoose.Schema(
  {
    watchName: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    automatic: { type: Boolean, default: false },
    watchDescription: { type: String, required: true },
    comments: [commentSchema],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
      required: true
    }
  },
  { timestamps: true }
);

const watchModel = mongoose.model("Watch", watchSchema);
export default watchModel;
