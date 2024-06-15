import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    brandName: { type: String }
  },
  { timestamps: true }
);

const brandModel = mongoose.model("Brand", brandSchema);
export default brandModel;
