import express from "express";
import * as MusicControllers from "../controllers/musicControllers.js";

const router = express.Router();

router.get("/", MusicControllers.getAllMusics);
router.get("/:id", MusicControllers.getMusicById);
router.put("/:id", MusicControllers.updateMusic);
router.post("/", MusicControllers.createMusic);
router.delete("/:id", MusicControllers.deleteMusic);

export default router;
