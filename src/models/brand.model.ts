import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    brandName: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

const brandModel = mongoose.model("Brand", brandSchema);
export default brandModel;
