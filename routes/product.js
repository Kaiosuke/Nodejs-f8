import { Router } from "express";
import ProductController from "../controllers/ProductController.js";

import { productSchema } from "../schema/index.js";
import { dataListMiddleWare, dataMiddleWare } from "../middleWare/schema.js";
import { verifyToken } from "../middleWare/auth.js";

const router = Router();

router.get("/", verifyToken, ProductController.getProducts);
router.get("/:id", verifyToken, ProductController.getProduct);

router.post(
  "/",
  dataMiddleWare(productSchema),
  ProductController.createProduct
);
router.post(
  "/many",
  dataListMiddleWare(productSchema, "products"),
  ProductController.createProducts
);

router.patch("/:id", ProductController.updateProduct);

router.delete("/product/:id", ProductController.deleteProduct);
router.delete("/product/:id/force", ProductController.forceDeleteProduct);

router.delete("/many", ProductController.deleteProducts);

export default router;
