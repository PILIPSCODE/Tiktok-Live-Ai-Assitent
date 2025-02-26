import express from "express";

import * as UserConnectionControllers from "../controllers/userConnectionControllers.js";

const router = express.Router();

router.get("/", UserConnectionControllers.getAllUserConnnection);
router.get("/:id", UserConnectionControllers.getUserConnectionById);
router.put("/:id", UserConnectionControllers.updateUserConnection);
router.post("/", UserConnectionControllers.createUserConnection);
router.delete("/:id", UserConnectionControllers.deleteUserConnection);

export default router;
