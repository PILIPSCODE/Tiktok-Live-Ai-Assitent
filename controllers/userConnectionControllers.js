import { UserConnection } from "../models/models.js";

export const getAllUserConnnection = (req, res) => {
  UserConnection.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getUserConnectionById = (req, res) => {
  const { id } = req.params;

  UserConnection.getById(id, (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Gagal mengambil data user", details: err.message });
    }

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    res.status(200).json(user);
  });
};

export const createUserConnection = async (req, res) => {
  UserConnection.create(req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "UserConnection Created Successfuly" });
  });
};

export const updateUserConnection = (req, res) => {
  const { id } = req.params;

  UserConnection.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User Updated" });
  });
};

export const deleteUserConnection = (req, res) => {
  const { id } = req.params;

  UserConnection.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User Deleted" });
  });
};
