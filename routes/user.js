import { Router } from "express";
import UserController from "../controllers/UserControllers.js";
import { dataListMiddleWare, dataMiddleWare } from "../middleWare/schema.js";
import { registerSchema } from "../schema/index.js";

const router = Router();

router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUser);

router.post("/", dataMiddleWare(registerSchema), UserController.createUser);
router.post(
  "/many",
  dataListMiddleWare(registerSchema, "users"),
  UserController.createUsers
);

router.patch("/:id", UserController.updateUser);

router.delete("/user/:id", UserController.deleteUser);
router.delete("/many", UserController.deleteUsers);

export default router;
