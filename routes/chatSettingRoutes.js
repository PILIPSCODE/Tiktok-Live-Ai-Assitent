import express from "express";

import * as ChatSettingsControllers from "../controllers/chatSettingsControllers.js";

const router = express.Router();

router.get("/", ChatSettingsControllers.getAllChatSettings);
router.get("/:id", ChatSettingsControllers.getChatSettingsById);
router.put("/:id", ChatSettingsControllers.updateChatSettings);
router.post("/", ChatSettingsControllers.createChatSettings);
router.delete("/:id", ChatSettingsControllers.deleteChatSettings);

export default router;
