CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nome, email)
VALUES
    ('Ana Silva', 'ana@email.com'),
    ('Carlos Souza', 'carlos@email.com')
ON DUPLICATE KEY UPDATE
    nome = VALUES(nome),
    email = VALUES(email);

-- CREATE TABLE usuarios (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     nome VARCHAR(100),
--     email VARCHAR(100)
-- );

-- INSERT INTO usuarios (nome, email) VALUES
-- ('Ana Silva', 'ana@email.com'),
-- ('Carlos Souza', 'carlos@email.com');