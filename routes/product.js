import { Router } from "express";
import ProductController from "../controllers/ProductController.js";

import { productSchema } from "../schema/index.js";
import { dataListMiddleWare, dataMiddleWare } from "../middleWare/schema.js";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProduct);

router.post(
  "/",
  dataMiddleWare(productSchema),
  ProductController.createProduct
);
router.post(
  "/many",
  dataListMiddleWare(productSchema),
  ProductController.createProducts
);

router.patch("/:id", ProductController.updateProduct);

router.delete("/product/:id", ProductController.deleteProduct);
router.delete("/many", ProductController.deleteProducts);

export default router;
