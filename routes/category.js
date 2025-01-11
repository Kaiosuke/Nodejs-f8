import { Router } from "express";

import CategoryController from "../controllers/CategoryController.js";

import { categorySchema } from "../schema/index.js";
import { dataListMiddleWare, dataMiddleWare } from "../middleWare/schema.js";
import { verifyToken } from "../middleWare/auth.js";

const router = Router();

router.get("/", verifyToken, CategoryController.getCategories);
router.get("/:id", verifyToken, CategoryController.getCategory);

router.post(
  "/",
  dataMiddleWare(categorySchema),
  CategoryController.createCategory
);
router.post(
  "/many",

  CategoryController.createCategories
);

router.patch("/:id", CategoryController.updateCategory);

router.delete("/category/:id", CategoryController.deleteCategory);
router.delete("/category/:id/force", CategoryController.forceDeleteCategory);

router.delete("/many", CategoryController.deleteCategories);

export default router;
