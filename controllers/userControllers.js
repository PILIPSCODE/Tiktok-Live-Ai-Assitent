import { User } from "../models/models.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import db from "../config/database.js";

const SECRET_KEY = "your_secret_key";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "comini816@gmail.com",
    pass: "adnh niyx oyve lpnp",
  },
});

export const getAllUsers = (req, res) => {
  User.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getUserById = (req, res) => {
  const { id } = req.params;

  User.getById(id, (err, user) => {
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

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const verification_code = Math.floor(100000 + Math.random() * 900000);
  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1d" });

  const data = {
    name,
    email,
    hashedPassword,
    token,
    verification_code,
  };

  User.create(data, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    const mailOptions = {
      from: "comini816@gmail.com",
      to: email,
      subject: "Verify Your Email",
      text: `This Your Verification ${data.verification_code} expired in 5 minutes`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error)
        return res.status(403).json({
          message: "Your email address already exists",
        });
      res.status(201).json({
        message:
          "Registration successful. Please check your email to verify your account.",
      });
    });
  });
};

export const verification = (req, res) => {
  const { email, verification_code } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0)
      return res
        .status(401)
        .json({ error: "Verifikasi expired silahkan lakukan signUp kembali" });

    const user = result[0];
    const sql = `
    UPDATE users 
    SET is_verified = ?, updated_at = NOW() 
    WHERE id = ?
  `;
    if (user.verification_code === verification_code) {
      db.query(sql, [1, user.id], (err, result) => {
        if (!err) {
          return res.status(200).json({ message: "Verifikasi berhasil" });
        }
      });
    } else {
      return res.status(403).json({ message: "Verification_code not Match" });
    }
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(401).json({ error: "User not found" });

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ error: "Invalid credentials" });

      if (!user.is_verified)
        return res.status(401).json({ error: "Email not verified" });

      const token = jwt.sign({ email: user.email, id: user.id }, "SECRET_KEY", {
        expiresIn: "1d",
      });

      res.status(200).json({ message: "Login successful", token });
    }
  );
};

export const updateUser = (req, res) => {
  const { id } = req.params;

  User.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User Updated" });
  });
};

export const deleteUser = (req, res) => {
  const { id } = req.params;

  User.delete(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User Deleted" });
  });
};

// Middleware auth example
export const getProfile = [
  authMiddleware,
  (req, res) => {
    const userId = req.user.id;

    User.getById(userId, (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ error: "User tidak ditemukan" });
      res.json(user);
    });
  },
];
