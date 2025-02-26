import express from "express";

import * as InteractionControllers from "../controllers/interactionControllers.js";

const router = express.Router();

router.get("/", InteractionControllers.getAllInteractions);
router.get("/:id", InteractionControllers.getInteractionById);
router.put("/:id", InteractionControllers.updateInteraction);
router.post("/", InteractionControllers.createInteraction);
router.delete("/:id", InteractionControllers.deleteInteraction);

export default router;
