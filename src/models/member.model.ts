import bcrypt from "bcrypt";
import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    membername: { type: String, required: true },
    name: String,
    YOB: Number,
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

memberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

const memberModel = mongoose.model("Member", memberSchema);
export default memberModel;
