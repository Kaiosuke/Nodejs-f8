import { Router } from "express";
import UserController from "../controllers/UserControllers.js";

const router = Router();

router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUser);

router.post("/", UserController.createUser);
router.post("/many", UserController.createUsers);

router.patch("/:id", UserController.updateUser);

router.delete("/user/:id", UserController.deleteUser);
router.delete("/many", UserController.deleteUsers);

export default router;
