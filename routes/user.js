import { Router } from "express";
import UserController from "../controllers/UserControllers.js";
import { dataListMiddleWare, dataMiddleWare } from "../middleWare/schema.js";
import { registerSchema } from "../schema/index.js";
import { verifyToken, verifyAuth } from "../middleWare/auth.js";

const router = Router();

router.get("/", verifyToken, UserController.getUsers);
router.get("/:id", verifyToken, UserController.getUser);

router.post("/", dataMiddleWare(registerSchema), UserController.createUser);
router.post(
  "/many",
  dataListMiddleWare(registerSchema, "users"),
  UserController.createUsers
);

router.patch("/:id", UserController.updateUser);

router.delete("/user/:id", verifyAuth, UserController.deleteUser);
router.delete("/user/:id/force", verifyAuth, UserController.forceDeleteUser);

router.delete("/many", verifyAuth, UserController.deleteUsers);

export default router;
