import mongoose from "mongoose";
import { hashPassword } from "../utils/jwt";

const memberSchema = new mongoose.Schema(
  {
    membername: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    YOB: { type: Number, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

memberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});

const memberModel = mongoose.model("Member", memberSchema);
export default memberModel;
