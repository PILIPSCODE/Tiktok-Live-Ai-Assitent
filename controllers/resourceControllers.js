import { Resource } from "../models/models.js";

export const getAllResources = (req, res) => {
  Resource.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getResourceById = (req, res) => {
  const { id } = req.params;

  Resource.getById(id, (err, Resource) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Gagal mengambil data Resource", details: err.message });
    }

    if (!Resource) {
      return res.status(404).json({ error: "Resource tidak ditemukan" });
    }

    res.status(200).json(Resource);
  });
};

export const createResource = async (req, res) => {
  Resource.create(req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Resource Created Successfuly" });
  });
};

export const updateResource = (req, res) => {
  const { id } = req.params;

  Resource.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Resource Updated" });
  });
};

export const deleteResource = (req, res) => {
  const { id } = req.params;

  Resource.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Resource Deleted" });
  });
};
