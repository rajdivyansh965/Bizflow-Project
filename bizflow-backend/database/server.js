const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON requests

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "your_username",
  password: "your_password",
  database: "inventory_db",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Get all inventory items
app.get("/api/items", (req, res) => {
  db.query("SELECT * FROM inventory", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Add a new item
app.post("/api/items", (req, res) => {
  const { name, quantity } = req.body;
  const query = "INSERT INTO inventory (name, quantity) VALUES (?, ?)";
  db.query(query, [name, quantity], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ id: results.insertId, name, quantity });
    }
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
