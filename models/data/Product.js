import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: { type: String, require: true },
    price: { type: Number, require: true },
    description: { type: String, require: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
