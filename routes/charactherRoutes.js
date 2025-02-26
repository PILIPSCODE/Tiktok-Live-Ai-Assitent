import express from "express";

import * as CharactherControllers from "../controllers/charactherControllers.js";

const router = express.Router();

router.get("/", CharactherControllers.getAllCharacters);
router.get("/:id", CharactherControllers.getCharacterById);
router.put("/:id", CharactherControllers.updateCharacter);
router.post("/", CharactherControllers.createCharacter);
router.delete("/:id", CharactherControllers.deleteCharacter);

export default router;
