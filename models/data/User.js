import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "ceo"],
      require: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
