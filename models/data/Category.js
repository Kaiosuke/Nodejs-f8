import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    title: { type: String, require: true },
    description: { type: String, require: true },
    slug: { type: String, require: true, unique: true },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
