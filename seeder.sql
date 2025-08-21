-- Hapus database jika sudah ada, lalu buat ulang
DROP DATABASE IF EXISTS railway;
CREATE DATABASE railway;
USE railway;

-- Matikan validasi foreign key sementara
SET FOREIGN_KEY_CHECKS = 0;

-- Tabel Users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,  
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT 0,
    token VARCHAR(255) DEFAULT NULL,
    verification_code VARCHAR(6) DEFAULT NULL,
    expired_code TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Interactions
CREATE TABLE IF NOT EXISTS interactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    gift VARCHAR(255),
    type VARCHAR(50),
    action VARCHAR(50),
    version VARCHAR(50),
    audio VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel Music
CREATE TABLE IF NOT EXISTS music (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    audio VARCHAR(255),
    title VARCHAR(255),
    thumbnails VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel Characters
CREATE TABLE IF NOT EXISTS characters (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    hair VARCHAR(50),
    tshirt VARCHAR(50),
    color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel Resources
CREATE TABLE IF NOT EXISTS resources (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100),
    type VARCHAR(50),
    Base64 TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel Chat Settings
CREATE TABLE IF NOT EXISTS chat_settings (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    TypeBorder VARCHAR(50),
    CommentPosition VARCHAR(50),
    TextSpeed INT,
    usernamePosition VARCHAR(50),
    ResponsePosition VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel User Connections
CREATE TABLE IF NOT EXISTS user_connections (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    username VARCHAR(100),
    prompt TEXT,
    model VARCHAR(100),
    apikey VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Aktifkan kembali validasi foreign key
SET FOREIGN_KEY_CHECKS = 1;

-- Hapus data lama jika ada
-- DELETE FROM users;
-- DELETE FROM interactions;
-- DELETE FROM music;
-- DELETE FROM characters;
-- DELETE FROM resources;
-- DELETE FROM chat_settings;
-- DELETE FROM user_connections;

DELIMITER //

CREATE TRIGGER set_verification_code_before_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    SET NEW.verification_code = LPAD(FLOOR(RAND() * 1000000), 6, '0'); -- Kode 6 digit acak
    SET NEW.expired_code = NOW() + INTERVAL 5 MINUTE; -- Berlaku 5 menit
END //

DELIMITER ;

-- Masukkan data awal ke tabel users dengan UUID unik
INSERT INTO users (id, name, email, password, is_verified, token, verification_code, expired_code) VALUES
(UUID(), 'John Doe', 'john@example.com', 'hashedpassword123', 1, 'token1', '123456', NOW() + INTERVAL 5 MiNUTE),
(UUID(), 'Alice Smith', 'alice@example.com', 'hashedpassword456', 1, 'token2', '654321', NOW() + INTERVAL 5 MINUTE);

-- Ambil ID pengguna untuk referensi tabel lain
SET @user1 = (SELECT id FROM users WHERE email = 'john@example.com');
SET @user2 = (SELECT id FROM users WHERE email = 'alice@example.com');

-- Masukkan data awal ke tabel interactions
INSERT INTO interactions (id, user_id, gift, type, action, version, audio) VALUES
(UUID(), @user1, 'Gift1', 'TypeA', 'ActionX', '1.0', 'audio1.mp3'),
(UUID(), @user2, 'Gift2', 'TypeB', 'ActionY', '1.1', 'audio2.mp3');

-- Masukkan data awal ke tabel music
INSERT INTO music (id, user_id, audio, title, thumbnails) VALUES
(UUID(), @user1, 'song1.mp3', 'Title1', 'thumb1.jpg'),
(UUID(), @user2, 'song2.mp3', 'Title2', 'thumb2.jpg');

-- Masukkan data awal ke tabel characters
INSERT INTO characters (id, user_id, hair, tshirt, color) VALUES
(UUID(), @user1, 'Short', 'Red', 'Blue'),
(UUID(), @user2, 'Long', 'Black', 'Green');

-- Masukkan data awal ke tabel resources
INSERT INTO resources (id, user_id, name, type, Base64) VALUES
(UUID(), @user1, 'Resource1', 'Type1', 'Base64EncodedData1'),
(UUID(), @user2, 'Resource2', 'Type2', 'Base64EncodedData2');

-- Masukkan data awal ke tabel chat_settings
INSERT INTO chat_settings (id, user_id, TypeBorder, CommentPosition, TextSpeed, usernamePosition, ResponsePosition) VALUES
(UUID(), @user1, 'Rounded', 'Top', 5, 'Left', 'Right'),
(UUID(), @user2, 'Square', 'Bottom', 3, 'Right', 'Left');

-- Masukkan data awal ke tabel user_connections
INSERT INTO user_connections (id, user_id, username, prompt, model, apikey) VALUES
(UUID(), @user1, 'john_conn', 'Hello, AI!', 'GPT-4', 'api_key_1'),
(UUID(), @user2, 'alice_conn', 'Good morning!', 'GPT-4', 'api_key_2');

-- Tampilkan hasil
SELECT * FROM users;
SELECT * FROM interactions;
SELECT * FROM music;
SELECT * FROM characters;
SELECT * FROM resources;
SELECT * FROM chat_settings;
SELECT * FROM user_connections;


