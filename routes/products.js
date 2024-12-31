import { Router } from "express";
import ProductController from "../controllers/ProductController.js";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProduct);

router.post("/", ProductController.addProduct);

router.patch("/:id", ProductController.update);

router.delete("/:id", ProductController.delete);

export default router;
