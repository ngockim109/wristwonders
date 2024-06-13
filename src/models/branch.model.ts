import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    brandName: { type: String }
  },
  { timestamps: true }
);

const branchModel = mongoose.model("Branch", brandSchema);
export default branchModel;
