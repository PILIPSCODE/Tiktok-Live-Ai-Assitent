import { Music } from "../models/models.js";

export const getAllMusics = (req, res) => {
  Music.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getMusicById = (req, res) => {
  const { id } = req.params;

  Music.getById(id, (err, Music) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Gagal mengambil data Music", details: err.message });
    }

    if (!Music) {
      return res.status(404).json({ error: "Music tidak ditemukan" });
    }

    res.status(200).json(Music);
  });
};

export const createMusic = async (req, res) => {
  Music.create(req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Music Created Successfuly" });
  });
};

export const updateMusic = (req, res) => {
  const { id } = req.params;

  Music.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Music Updated" });
  });
};

export const deleteMusic = (req, res) => {
  const { id } = req.params;

  Music.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Music Deleted" });
  });
};
