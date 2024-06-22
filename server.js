const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS numbers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number INTEGER
)`);

// Middleware to parse JSON bodies
app.use(express.json());

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Route to insert a number into the database
app.post('/insert', (req, res) => {
    const { number } = req.body;
    
    // Insert into database
    db.run(`INSERT INTO numbers (number) VALUES (?)`, [number], function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
        res.json({ message: `Number ${number} inserted into database.` });
    });
});

// Serve static files from the 'public' directory (not needed for this example)
// app.use(express.static('public'));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
