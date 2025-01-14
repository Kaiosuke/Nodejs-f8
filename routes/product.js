import { Router } from "express";
import ProductController from "../controllers/ProductController.js";

import { verifyAuth, verifyToken } from "../middleWare/auth.js";
import { dataMiddleWare } from "../middleWare/schema.js";
import { productSchema } from "../schema/index.js";

const router = Router();

router.get("/", verifyToken, ProductController.getProducts);
router.get("/:id", verifyToken, ProductController.getProduct);

router.post(
  "/",
  dataMiddleWare(productSchema),
  verifyAuth,
  ProductController.createProduct
);

router.patch("/:id", verifyAuth, ProductController.updateProduct);

router.delete("/product/:id", verifyAuth, ProductController.deleteProduct);

router.patch("/:id/restore", verifyAuth, verifyAuth, ProductController.restore);

router.delete(
  "/product/:id/force",
  verifyAuth,
  ProductController.forceDeleteProduct
);

// router.post(
//   "/many",
//   dataListMiddleWare(productSchema, "products"),
//   ProductController.createProducts
// );

// router.delete("/many", ProductController.deleteProducts);

export default router;
