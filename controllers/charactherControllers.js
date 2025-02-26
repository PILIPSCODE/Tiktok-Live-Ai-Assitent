import { Character } from "../models/models.js";

export const getAllCharacters = (req, res) => {
  Character.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getCharacterById = (req, res) => {
  const { id } = req.params;

  Character.getById(id, (err, Character) => {
    if (err) {
      return res.status(500).json({
        error: "Gagal mengambil data Character",
        details: err.message,
      });
    }

    if (!Character) {
      return res.status(404).json({ error: "Character tidak ditemukan" });
    }

    res.status(200).json(Character);
  });
};

export const createCharacter = async (req, res) => {
  Character.create(req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Character Created Successfuly" });
  });
};

export const updateCharacter = (req, res) => {
  const { id } = req.params;

  Character.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Character Updated" });
  });
};

export const deleteCharacter = (req, res) => {
  const { id } = req.params;

  Character.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Character Deleted" });
  });
};
