const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "061504",
  database: "washtrack_db"
});

// FOR CHECKING CONNECTION
db.connect((err) => {
  if (err) {
    console.log('Database connection failed');
  } else {
    console.log('Connected to database');
  }
});

// FOR SIGNUP FUNCTIONALITY
app.post('/signupuser', (req, res) => {
  const { username, password, email, contact } = req.body;
  
  const sql = "INSERT INTO tbl_user (fld_username, fld_password, fld_email, fld_contact) VALUES (?, ?, ?, ?)";
  
  db.query(sql, [username, password, email, contact], (err, result) => {
    if (err) {
      res.json({ success: false, error: "Failed to sign up:" + err.message});
    } else {
      res.json({ success: true, message: "User added!" });
    }
  });
});

app.post('/signupadmin', (req, res) => {
  const { username, password, role } = req.body;
  
  const sql = "INSERT INTO tbl_admin (fld_username, fld_password, fld_role) VALUES (?, ?, ?)";
  
  db.query(sql, [username, password, role], (err, result) => {
    if (err) {
      res.json({ success: false, error: "Failed to sign up" });
    } else {
      res.json({ success: true, message: "User added!" });
    }
  });
});

app.listen(8081, () => {
  console.log('Server running on port 8081');
});