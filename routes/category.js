import { Router } from "express";

import CategoryController from "../controllers/CategoryController.js";

import { categorySchema } from "../schema/index.js";
import { dataListMiddleWare, dataMiddleWare } from "../middleWare/schema.js";

const router = Router();

router.get("/", CategoryController.getCategories);
router.get("/:id", CategoryController.getCategory);

router.post(
  "/",
  dataMiddleWare(categorySchema),
  CategoryController.createCategory
);
router.post(
  "/many",
  dataListMiddleWare(categorySchema, "categories"),
  CategoryController.createCategories
);

router.patch("/:id", CategoryController.updateCategory);

router.delete("/category/:id", CategoryController.deleteCategory);
router.delete("/many", CategoryController.deleteCategories);

export default router;
