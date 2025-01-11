import mongoose, { Schema } from "mongoose";
import MongooseDelete from "mongoose-delete";

const UserSchema = new Schema(
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

UserSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

const User = mongoose.model("User", UserSchema);
export default User;
