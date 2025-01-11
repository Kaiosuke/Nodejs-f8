import {
  handleError404,
  handleError500,
  handleSuccess200,
  handleSuccess201,
} from "../helper/handleStatus.js";
import Product from "../models/data/Product.js";
import Category from "../models/data/Category.js";

const ProductController = {
  //Get products
  getProducts: async (req, res) => {
    try {
      const products = await Product.find().populate("categoryId");
      if (!products || !products.length) {
        return handleError404(res, "Not found products");
      }

      return handleSuccess200(res, "Get products success", products);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  //Get product
  getProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id).populate("categoryId");

      if (!product) {
        return handleError404(res, "Not found product");
      }

      return handleSuccess200(res, "Get product success", product);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  //Post product
  createProduct: async (req, res) => {
    try {
      if (!req.body.categoryId) {
        const exitCategory = await Category.findOne({ title: "Uncategorized" });
        if (!exitCategory) {
          const newCategory = await Category.create({
            title: "Uncategorized",
            description: "default",
            slug: "Uncategorized-12",
          });
          req.body.categoryId = newCategory._id;
        } else {
          req.body.categoryId = exitCategory._id;
        }
      }

      const exitsCategory = await Category.findOne({
        _id: req.body.categoryId,
      });

      if (!exitsCategory) {
        return handleError404(res, "Not found category");
      }
      const newProduct = await Product.create(req.body);

      await Category.findByIdAndUpdate(req.body.categoryId, {
        $push: { products: newProduct._id },
      });

      return handleSuccess200(res, "Create product success", newProduct);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  //Post products
  createProducts: async (req, res) => {
    try {
      const { products } = req.body;

      const categoryIds = products.map((product) => product.categoryId);

      const existCategories = await Category.find({
        _id: { $in: categoryIds },
      });

      const invalidCategoryIds = existCategories.map((cate) =>
        cate._id.toString()
      );

      const invalidProducts = products.filter(
        (product) => !invalidCategoryIds.includes(product.categoryId)
      );

      if (invalidProducts.length) {
        return handleError404(res, "Not found Category", invalidProducts);
      }

      const newProducts = await Product.insertMany(products);

      return handleSuccess201(res, "Create products success", newProducts);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  //Update product
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { categoryId } = req.body;

      const findProduct = await Product.findById(id);

      if (categoryId) {
        const exitsCategory = await Category.findOne({ _id: categoryId });

        if (!exitsCategory) {
          return handleError404(res, "Not found category");
        }
      }

      if (!findProduct) {
        return handleError404(res, "Not found product");
      }

      const product = await Product.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return handleSuccess200(res, "Update product success", product);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  // Delete product
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.delete({ _id: id, deleted: false });
      if (!product.matchedCount) {
        return handleError404(res, "Not found product");
      }
      return handleSuccess200(res, "Delete product success", id);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  // Delete force
  forceDeleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.deleteOne({ _id: id });

      if (!product.deletedCount) {
        return handleError404(res, "Not found product");
      }
      return handleSuccess200(res, "Delete product success", id);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  // Delete products
  deleteProducts: async (req, res) => {
    try {
      const { ids } = req.body;

      const productsDelete = await Product.find({ _id: { $in: ids } });

      if (!productsDelete.length) {
        return handleError404(res, "Not found product");
      }

      await Product.deleteMany({ _id: { $in: ids } });

      return handleSuccess200(
        res,
        `Delete ${productsDelete.length} ${
          productsDelete.length > 1 ? "Products" : "Product"
        } success`,
        productsDelete.map((product) => product._id)
      );
    } catch (error) {
      return handleError500(res, error);
    }
  },
};

export default ProductController;
