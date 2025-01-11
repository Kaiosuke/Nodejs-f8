import mongoose, { Schema } from "mongoose";
import MongooseDelete from "mongoose-delete";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug);

const CategorySchema = new Schema(
  {
    title: { type: String, require: true },
    description: { type: String, require: true },
    slug: { type: String, slug: ["title"], unique: true },
  },
  { timestamps: true }
);

CategorySchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

const Category = mongoose.model("Category", CategorySchema);
export default Category;
