import { Interaction } from "../models/models.js";

export const getAllInteractions = (req, res) => {
  Interaction.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getInteractionById = (req, res) => {
  const { id } = req.params;

  Interaction.getById(id, (err, Interaction) => {
    if (err) {
      return res.status(500).json({
        error: "Gagal mengambil data Interaction",
        details: err.message,
      });
    }

    if (!Interaction) {
      return res.status(404).json({ error: "Interaction tidak ditemukan" });
    }

    res.status(200).json(Interaction);
  });
};

export const createInteraction = async (req, res) => {
  Interaction.create(req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Interaction Created Successfuly" });
  });
};

export const updateInteraction = (req, res) => {
  const { id } = req.params;

  Interaction.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Interaction Updated" });
  });
};

export const deleteInteraction = (req, res) => {
  const { id } = req.params;

  Interaction.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Interaction Deleted" });
  });
};
