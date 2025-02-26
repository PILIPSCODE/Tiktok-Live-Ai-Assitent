import db from "../config/database.js";

const User = {
  getAll: (callback) => {
    db.query("SELECT * FROM users", callback);
  },

  getById: (id, callback) => {
    const sql = `
        SELECT 
          u.id AS user_id, u.name, u.email, 
          i.id AS interaction_id, i.gift, i.type, i.action, i.version, i.audio,
          m.id AS music_id, m.audio AS music_audio, m.title, m.thumbnails,
          c.id AS character_id, c.hair, c.tshirt, c.color,
          r.id AS resources_id, r.name, r.type, r.Base64,
          cs.id AS chat_settings_id, cs.TypeBorder, cs.CommentPosition, cs.TextSpeed, cs.usernamePosition, cs.ResponsePosition,
          uc.id AS connection_id, uc.username, uc.prompt, uc.model, uc.apikey
        FROM users u
        LEFT JOIN interactions i ON u.id = i.user_id
        LEFT JOIN music m ON u.id = m.user_id
        LEFT JOIN characters c ON u.id = c.user_id
        LEFT JOIN resources r ON u.id = r.user_id
        LEFT JOIN chat_settings cs ON u.id = cs.user_id
        LEFT JOIN user_connections uc ON u.id = uc.user_id
        WHERE u.id = ?;
      `;

    db.query(sql, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }

      if (results.length === 0) {
        return callback(null, null);
      }

      const user = {
        id: results[0].user_id,
        name: results[0].name,
        email: results[0].email,
        interactions: [],
        music: [],
        characters: [],
        chat_settings: {},
        user_connections: [],
        resources: [],
      };

      results.forEach((row) => {
        if (
          row.interaction_id &&
          !user.interactions.some((item) => item.id === row.interaction_id)
        ) {
          user.interactions.push({
            id: row.interaction_id,
            gift: row.gift,
            type: row.type,
            action: row.action,
            version: row.version,
            audio: row.audio,
          });
        }

        if (
          row.music_id &&
          !user.music.some((item) => item.id === row.music_id)
        ) {
          user.music.push({
            id: row.music_id,
            audio: row.music_audio,
            title: row.title,
            thumbnails: row.thumbnails,
          });
        }

        if (
          row.character_id &&
          !user.characters.some((item) => item.id === row.character_id)
        ) {
          user.characters.push({
            id: row.character_id,
            hair: row.hair,
            tshirt: row.tshirt,
            color: row.color,
          });
        }

        if (
          row.resources_id &&
          !user.resources.some((item) => item.id === row.resources_id)
        ) {
          user.resources.push({
            id: row.resources_id,
            name: row.name,
            type: row.type,
            Base64: row.Base64,
          });
        }

        if (
          row.connection_id &&
          !user.user_connections.some((item) => item.id === row.connection_id)
        ) {
          user.user_connections.push({
            id: row.connection_id,
            username: row.username,
            prompt: row.prompt,
            model: row.model,
            apikey: row.apikey,
          });
        }

        if (!user.chat_settings.id && row.chat_settings_id) {
          user.chat_settings = {
            id: row.chat_settings_id,
            TypeBorder: row.TypeBorder,
            CommentPosition: row.CommentPosition,
            TextSpeed: row.TextSpeed,
            usernamePosition: row.usernamePosition,
            ResponsePosition: row.ResponsePosition,
          };
        }
      });

      callback(null, user);
    });
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO users (id, name, email, password, is_verified, token, verification_code, expired_code, created_at, updated_at)
      VALUES (UUID(), ?, ?, ?, 0, ?, ?, NOW() + INTERVAL 5 MINUTE, NOW(), NOW())
    `;
    db.query(
      sql,
      [
        data.name,
        data.email,
        data.hashedPassword,
        data.token,
        data.verificationCode,
      ],
      callback
    );
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE users 
      SET name = ?, email = ?, password = ?, updated_at = NOW() 
      WHERE id = ?
    `;
    db.query(sql, [data.name, data.email, data.password, id], callback);
  },

  delete: (id, callback) => {
    db.query("DELETE FROM users WHERE id = ?", [id], callback);
  },
};

const Interaction = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO interactions (id, user_id, gift, type, action, version, audio, created_at, updated_at) 
      VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    db.query(
      sql,
      [
        data.user_id,
        data.gift,
        data.type,
        data.action,
        data.version,
        data.audio,
      ],
      callback
    );
  },
};

const Music = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO music (id, user_id, audio, title, thumbnails, created_at, updated_at) 
      VALUES (UUID(), ?, ?, ?, ?, NOW(), NOW())
    `;
    db.query(
      sql,
      [data.user_id, data.audio, data.title, data.thumbnails],
      callback
    );
  },
};

const Character = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO characters (id, user_id, hair, tshirt, color, created_at, updated_at) 
      VALUES (UUID(), ?, ?, ?, ?, NOW(), NOW())
    `;
    db.query(sql, [data.user_id, data.hair, data.tshirt, data.color], callback);
  },
};

const ChatSettings = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO chat_settings (id, user_id, TypeBorder, CommentPosition, TextSpeed, usernamePosition, ResponsePosition, created_at, updated_at) 
      VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    db.query(
      sql,
      [
        data.user_id,
        data.TypeBorder,
        data.CommentPosition,
        data.TextSpeed,
        data.usernamePosition,
        data.ResponsePosition,
      ],
      callback
    );
  },
};

const UserConnection = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO user_connections (id, user_id, username, prompt, model, apikey, created_at, updated_at) 
      VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    db.query(
      sql,
      [data.user_id, data.username, data.prompt, data.model, data.apikey],
      callback
    );
  },
};

const Resource = {
  create: (data, callback) => {
    const sql = `
      INSERT INTO resources (id, user_id, name, type, Base64, created_at, updated_at) 
      VALUES (UUID(), ?, ?, ?, ?, NOW(), NOW())
    `;
    db.query(sql, [data.user_id, data.name, data.type, data.Base64], callback);
  },
};

export {
  User,
  Interaction,
  Music,
  Character,
  ChatSettings,
  UserConnection,
  Resource,
};
