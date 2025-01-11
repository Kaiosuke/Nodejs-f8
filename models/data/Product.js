import mongoose, { Schema } from "mongoose";
import mongooseDelete from "mongoose-delete";

const ProductSchema = new Schema(
  {
    title: { type: String, require: true },
    price: { type: Number, require: true },
    description: { type: String, require: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },
  },
  { timestamps: true }
);

ProductSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
