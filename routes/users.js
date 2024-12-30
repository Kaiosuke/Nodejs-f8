import { Router } from "express";
import Users from "../models/Users.js";
import UserController from "../controllers/UserControllers.js";

const router = Router();

router.get("/", UserController.getUsers);

router.post("/", UserController.createUser);
router.patch("/:id", UserController.updateUser);
// router.delete("/:id", UserController.deleteUser);

export default router;
