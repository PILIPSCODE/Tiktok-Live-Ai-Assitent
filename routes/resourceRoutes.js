import express from "express";
import * as ResourceControllers from "../controllers/resourceControllers.js";

const router = express.Router();

router.get("/", ResourceControllers.getAllResources);
router.get("/:id", ResourceControllers.getResourceById);
router.put("/:id", ResourceControllers.updateResource);
router.post("/", ResourceControllers.createResource);
router.delete("/:id", ResourceControllers.deleteResource);
export default router;
