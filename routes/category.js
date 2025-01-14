import { Router } from "express";

import CategoryController from "../controllers/CategoryController.js";

import { verifyAuth, verifyToken } from "../middleWare/auth.js";
import { dataMiddleWare } from "../middleWare/schema.js";
import { categorySchema } from "../schema/index.js";

const router = Router();

router.get("/", verifyToken, CategoryController.getCategories);
router.get("/:id", verifyToken, CategoryController.getCategory);

router.post(
  "/",
  dataMiddleWare(categorySchema),
  verifyAuth,
  CategoryController.createCategory
);

router.patch("/:id", verifyAuth, CategoryController.updateCategory);

router.delete("/category/:id", verifyAuth, CategoryController.deleteCategory);

router.patch("/:id/restore", verifyAuth, CategoryController.restore);

router.delete(
  "/category/:id/force",
  verifyAuth,
  CategoryController.forceDeleteCategory
);

// router.post(
//   "/many",
//   CategoryController.createCategories
// );

// router.delete("/many", CategoryController.deleteCategories);

export default router;
