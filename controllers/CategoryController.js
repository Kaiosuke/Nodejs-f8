import {
  handleError404,
  handleError500,
  handleSuccess200,
  handleSuccess201,
} from "../helper/handleStatus.js";
import Category from "../models/data/Category.js";
import Product from "../models/data/Product.js";

const CategoryController = {
  //Get Categories
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      if (!categories || !categories.length) {
        return handleError404(res, "Not found categories");
      }

      return handleSuccess200(res, "Get categories success", categories);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  //Get Category
  getCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);

      if (!category) {
        return handleError404(res, "Not found category");
      }

      return handleSuccess200(res, "Get category success", category);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  //Post Category
  createCategory: async (req, res) => {
    try {
      const newCategory = await Category.create(req.body);

      return handleSuccess200(res, "Create Category success", newCategory);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  //Post Categories
  // createCategories: async (req, res) => {
  //   try {
  //     const { categories } = req.body;

  //     const newCategories = await Category.insertMany(categories);

  //     return handleSuccess201(res, "Create Categories success", newCategories);
  //   } catch (error) {
  //     return handleError500(res, error);
  //   }
  // },

  //Update Category
  updateCategory: async (req, res) => {
    try {
      const category = await Category.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        { new: true }
      );
      if (!category) {
        return handleError404(res, "Not found category");
      }
      return handleSuccess200(res, "Update Category success", category);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  // Delete Category
  deleteCategory: async (req, res) => {
    try {
      if (req.params.id === process.env.DEFAULT_CATEGORY) {
        return res.status(401).json("You cannot delete the default category.");
      }

      const findCate = await Category.findById(req.params.id);

      const deleteData = await Category.delete({
        _id: req.params.id,
      });

      if (!deleteData.matchedCount) {
        return res.status(404).json("Not found Category");
      }

      await Product.updateMany({
        categoryId: req.params.id,
        categoryId: process.env.DEFAULT_CATEGORY,
      });

      await Category.updateOne(
        {
          _id: req.params.id,
        },
        {
          products: [],
        }
      );

      await Category.updateOne(
        {
          _id: process.env.DEFAULT_CATEGORY,
        },
        { $push: { products: { $each: findCate.products } } }
      );

      return handleSuccess200(res, "Delete category success", req.params.id);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  restore: async (req, res) => {
    try {
      const findCategory = await Category.findOne({
        _id: req.params.id,
        deleted: true,
      });

      if (!findCategory) {
        return handleError404(res, "Not found Category");
      }

      await Category.restore({ _id: findCategory.id });

      return handleSuccess200(res, "restore success", findCategory);
    } catch (error) {
      return res.status(500).json({
        message: "Interval server error",
        error: error.message,
      });
    }
  },

  //Force Delete Category
  forceDeleteCategory: async (req, res) => {
    try {
      if (req.params.id === process.env.DEFAULT_CATEGORY) {
        return res.status(401).json("You cannot delete the default category.");
      }

      const deleteCate = await Category.deleteOne({
        _id: req.params.id,
        deleted: true,
      });

      if (!deleteCate.deletedCount) {
        return handleError404(res, "Not found Category");
      }

      return handleSuccess200(res, "Force Delete success", id);
    } catch (error) {
      return handleError500(res, error);
    }
  },

  // Delete Categories
  // deleteCategories: async (req, res) => {
  //   try {
  //     const { ids } = req.body;

  //     const categoriesDelete = await Category.find({ _id: { $in: ids } });

  //     if (!categoriesDelete.length) {
  //       return handleError404(res, "Not found Category");
  //     }

  //     await Category.deleteMany({ _id: { $in: ids } });

  //     return handleSuccess200(
  //       res,
  //       `Delete ${categoriesDelete.length} ${
  //         categoriesDelete.length > 1 ? "categories" : "category"
  //       } success`,
  //       categoriesDelete.map((category) => category._id)
  //     );
  //   } catch (error) {
  //     return handleError500(res, error);
  //   }
  // },
};

export default CategoryController;
