import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import { loginSchema, registerSchema } from "../schema/index.js";
import { dataMiddleWare } from "../middleWare/schema.js";
import { verifyToken } from "../middleWare/auth.js";

const router = Router();

router.post(
  "/register",
  dataMiddleWare(registerSchema),
  AuthController.register
);

router.post("/login", dataMiddleWare(loginSchema), AuthController.login);

router.post("/refreshToken", AuthController.requestRefreshToken);

router.post("/logout", verifyToken, AuthController.logout);

export default router;
