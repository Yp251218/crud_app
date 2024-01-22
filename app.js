const express = require('express');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const port = 5000;

// MySQL connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_operations',
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
    } else {
        console.log('Connected to MySQL');
    }
});

// Set up routes and start the server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Use sendFile to serve HTML file
});


// CREATE (POST)
app.post('/posts', (req, res) => {
    const { title, description, category } = req.body;
    const sql = 'INSERT INTO items (title, description, category) VALUES (?, ?, ?)';
    db.query(sql, [title, description, category], (err, result) => {
        if (err) {
            console.error('Error creating item:', err.message);
            res.status(500).send('Error creating item');
        } else {
            res.status(201).send('Item created successfully');
        }
    });
});

// READ (GET)
app.get('/allPosts', (req, res) => {
    const { category } = req.query;

    let sql = 'SELECT * FROM items';

    if (category) {
        sql += ' WHERE category = ?';
    }


    db.query(sql, [category], (err, results) => {
        if (err) {
            console.error('Error retrieving items:', err.message);
            res.status(500).send('Error retrieving items');
        } else {
            res.json(results);
        }
    });
});

app.get('/allPosts/:productId', (req, res) => {
    const { productId } = req.params;
    let sql = 'SELECT * FROM items WHERE id = ?';  
    db.query(sql, [productId], (err, results) => {
        if (err) {
            console.error('Error retrieving product:', err.message);
            res.status(500).send('Error retrieving product');
        } else {
            if (results.length > 0) {
                console.log(results[0].id);
                res.json(results[0]); // Assuming you want to send the first matching product
            } else {
                res.status(404).send('Post not found');
            }
        }
    });
});

// UPDATE (PUT)
app.put('/update/:id', (req, res) => {
    const { title, description, category } = req.body;
    const { id } = req.params;
    console.log(req.params.id);
    const sql = 'UPDATE items SET title = ?, description = ?, category = ? WHERE id = ?';
    db.query(sql, [title, description, category, id], (err, result) => {
        if (err) {
            console.error('Error updating item:', err.message);
            res.status(500).send('Error updating item');
        } else {
            res.send('Item updated successfully');
        }
    });
});

// DELETE (DELETE)
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM items WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting item:', err.message);
            res.status(500).send('Error deleting item');
        } else {
            res.send('Item deleted successfully');
        }
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


