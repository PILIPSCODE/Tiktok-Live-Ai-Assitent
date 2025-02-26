import { ChatSettings } from "../models/models.js";

export const getAllChatSettings = (req, res) => {
  ChatSettings.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getChatSettingsById = (req, res) => {
  const { id } = req.params;

  ChatSettings.getById(id, (err, ChatSettings) => {
    if (err) {
      return res.status(500).json({
        error: "Gagal mengambil data ChatSettings",
        details: err.message,
      });
    }

    if (!ChatSettings) {
      return res.status(404).json({ error: "ChatSettings tidak ditemukan" });
    }

    res.status(200).json(ChatSettings);
  });
};

export const createChatSettings = async (req, res) => {
  ChatSettings.create(req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "ChatSettings Created Successfuly" });
  });
};

export const updateChatSettings = (req, res) => {
  const { id } = req.params;

  ChatSettings.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "ChatSettings Updated" });
  });
};

export const deleteChatSettings = (req, res) => {
  const { id } = req.params;

  ChatSettings.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "ChatSettings Deleted" });
  });
};
