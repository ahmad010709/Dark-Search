const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection Configuration
const dbConfig = {
    host: 'localhost',
    user: 'root', // Default XAMPP/MySQL user
    password: '', // Default XAMPP/MySQL password (empty)
    multipleStatements: true
};

let dbConnection;

function handleDisconnect() {
    dbConnection = mysql.createConnection(dbConfig);

    dbConnection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err.code);
            console.log('Retrying in 5 seconds... (Please ensure MySQL/XAMPP is running)');
            setTimeout(handleDisconnect, 5000);
        } else {
            console.log('Connected to MySQL server.');
            initDatabase();
        }
    });

    dbConnection.on('error', (err) => {
        console.error('MySQL Database Error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
            handleDisconnect();
        } else {
            console.error('Fatal MySQL error, retrying connection in 5s...');
            setTimeout(handleDisconnect, 5000);
        }
    });
}

// Initialize Database and Tables
function initDatabase() {
    const createDbQuery = `CREATE DATABASE IF NOT EXISTS dark_search_db`;

    dbConnection.query(createDbQuery, (err) => {
        if (err) {
            console.error('Error creating database:', err);
            return;
        }

        // Now connect to the specific database
        dbConnection.changeUser({ database: 'dark_search_db' }, (err) => {
            if (err) {
                console.error('Error switching to database:', err);
                return;
            }

            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS websites (
                    url VARCHAR(255) NOT NULL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;

            dbConnection.query(createTableQuery, (err) => {
                if (err) {
                    console.error('Error creating table:', err);
                } else {
                    console.log('Websites table ensured.');
                }
            });
        });
    });
}

// Start the connection handler
handleDisconnect();

// API Routes

// GET /api/websites - Fetch all or search
app.get('/api/websites', (req, res) => {
    const query = req.query.q;
    let sql = 'SELECT * FROM websites';
    let params = [];

    if (query && query.trim().length > 0) {
        // Split query into individual words for "smart" matching
        // e.g., "share all" will match "share it all" because both "share" and "all" are present
        const words = query.trim().split(/\s+/);

        const conditions = words.map(() => '(name LIKE ? OR description LIKE ?)');
        sql += ' WHERE ' + conditions.join(' AND ');

        words.forEach(word => {
            const term = `%${word}%`;
            params.push(term, term);
        });
    }

    sql += ' ORDER BY created_at DESC';

    dbConnection.query(sql, params, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
});

// POST /api/websites - Add a new website
app.post('/api/websites', (req, res) => {
    const { name, url, description } = req.body;

    if (!name || !url) {
        return res.status(400).json({ error: 'Name and URL are required' });
    }

    const sql = 'INSERT INTO websites (url, name, description) VALUES (?, ?, ?)';
    dbConnection.query(sql, [url, name, description || ''], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'This website URL already exists.' });
            }
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.status(201).json({ url, name, description });
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
