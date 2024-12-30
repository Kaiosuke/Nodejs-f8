import mongoose, { Schema } from "mongoose";

const usersSchema = new Schema(
  {
    username: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", usersSchema);
export default Users;
