-- Database Creation
CREATE DATABASE IF NOT EXISTS dark_search_db;
USE dark_search_db;

-- Table Structure for 'websites'
-- Table Structure for 'websites'
CREATE TABLE IF NOT EXISTS websites (
    url VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Insert some sample data
INSERT INTO websites (url, name, description) VALUES 
('https://www.google.com', 'Google', 'Search the world\'s information, including webpages, images, videos and more.'),
('https://www.youtube.com', 'YouTube', 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.'),
('https://github.com', 'GitHub', 'GitHub is where over 100 million developers shape the future of software, together.')
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description);
