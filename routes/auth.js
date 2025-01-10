import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import { loginSchema, registerSchema } from "../schema/index.js";
import { dataMiddleWare } from "../middleWare/schema.js";

const router = Router();

router.post("/login", dataMiddleWare(loginSchema), AuthController.login);

router.post(
  "/register",
  dataMiddleWare(registerSchema),
  AuthController.register
);

export default router;
