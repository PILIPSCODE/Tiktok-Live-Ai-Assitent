import express from "express";

import * as UserControllers from "../controllers/userControllers.js";

const router = express.Router();

router.get("/", UserControllers.getAllUsers);
router.get("/:id", UserControllers.getUserById);
router.put("/:id", UserControllers.updateUser);
router.post("/signUp", UserControllers.createUser);
router.post("/signIn", UserControllers.loginUser);
router.post("/verification", UserControllers.verification);
router.delete("/:id", UserControllers.deleteUser);

export default router;
