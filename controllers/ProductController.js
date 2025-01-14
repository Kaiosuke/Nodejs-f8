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
      const { categoryId } = req.body;
      if (!categoryId) {
        req.body.categoryId = process.env.DEFAULT_CATEGORY;
      }

      const exitsCate = await Category.findById(req.body.categoryId);
      if (!exitsCate) {
        return handleError404(res, "Not found Category");
      }

      const newData = await Product.create(req.body);

      await Category.updateOne(
        { _id: req.body.categoryId },
        {
          $push: { products: newData._id },
        }
      );

      return handleSuccess200(res, "Create product success", newData);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  //Post products
  // createProducts: async (req, res) => {
  //   try {
  //     const { products } = req.body;

  //     const categoryIds = products.map((product) => product.categoryId);

  //     const existCategories = await Category.find({
  //       _id: { $in: categoryIds },
  //     });

  //     const invalidCategoryIds = existCategories.map((cate) =>
  //       cate._id.toString()
  //     );

  //     const invalidProducts = products.filter(
  //       (product) => !invalidCategoryIds.includes(product.categoryId)
  //     );

  //     if (invalidProducts.length) {
  //       return handleError404(res, "Not found Category", invalidProducts);
  //     }

  //     const newProducts = await Product.insertMany(products);

  //     return handleSuccess201(res, "Create products success", newProducts);
  //   } catch (error) {
  //     return handleError500(res, error);
  //   }
  // },

  //Update product
  updateProduct: async (req, res) => {
    try {
      const findData = await Product.findById(req.params.id);
      const { categoryId } = req.body;

      const exitsCate = await Category.findById(categoryId);

      if (!exitsCate) {
        return handleError404(res, "Not found Category");
      }

      if (!findData) {
        return handleError404(res, "Not found product");
      }

      const newProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      if (newProduct.categoryId !== exitsCate._id) {
        await Category.updateOne(
          { _id: findData.categoryId },
          {
            $pull: { products: req.params.id },
          }
        );

        await Category.updateOne(
          { _id: newProduct.categoryId },
          {
            $push: { products: newProduct._id },
          }
        );
      }

      return handleSuccess200(res, "Update success", newProduct);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  // Delete product
  deleteProduct: async (req, res) => {
    try {
      const findProduct = await Product.findById(req.params.id);
      if (!findProduct) {
        return handleError404(res, "Not found product");
      }

      await Category.updateOne(
        { _id: findProduct.categoryId },
        {
          $pull: { products: findProduct._id },
        }
      );

      await Product.delete({ _id: findProduct.id });

      return handleSuccess200(res, "Delete success", findProduct.id);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  restore: async (req, res) => {
    try {
      const findProduct = await Product.findOne({
        _id: req.params.id,
        deleted: true,
      });

      if (!findProduct) {
        return handleError404(res, "Not found product");
      }

      await Category.updateOne(
        { _id: findProduct.categoryId },
        {
          $push: { products: findProduct._id },
        }
      );

      const data = await Product.restore({ _id: findProduct._id });

      return handleSuccess200(res, "restore success", data);
    } catch (error) {
      return res.status(500).json({
        message: "Interval server error",
        error: error.message,
      });
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
  // deleteProducts: async (req, res) => {
  //   try {
  //     const { ids } = req.body;

  //     const productsDelete = await Product.find({ _id: { $in: ids } });

  //     if (!productsDelete.length) {
  //       return handleError404(res, "Not found product");
  //     }

  //     await Product.deleteMany({ _id: { $in: ids } });

  //     return handleSuccess200(
  //       res,
  //       `Delete ${productsDelete.length} ${
  //         productsDelete.length > 1 ? "Products" : "Product"
  //       } success`,
  //       productsDelete.map((product) => product._id)
  //     );
  //   } catch (error) {
  //     return handleError500(res, error);
  //   }
  // },
};

export default ProductController;
