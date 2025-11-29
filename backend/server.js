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
  
  console.log('Admin signup attempt:', { username, password, role }); // Add this line
  
  const sql = "INSERT INTO tbl_admin (fld_username, fld_password, fld_role) VALUES (?, ?, ?)";
  
  db.query(sql, [username, password, role], (err, result) => {
    if (err) {
      console.error('Database error:', err); // Add this line
      res.json({ success: false, error: "Failed to sign up: " + err.message }); // Include error message
    } else {
      res.json({ success: true, message: "User added!" });
    }
  });
});

// FOR LOGIN FUNCTIONALITY
app.post('/loginuser', (req, res) => {
  const { username, password } = req.body;
  
  const sql = "SELECT * FROM tbl_user WHERE fld_username = ? AND fld_password = ?";
  
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      res.json({ success: false, error: "Server error. Please try again." });
    } else {
      if (results.length > 0) {
        res.json({ 
          success: true, 
          message: "Login successful!", 
          user: results[0] 
        });
      } else {
        res.json({ 
          success: false, 
          error: "Invalid username or password" 
        });
      }
    }
  });
});

app.post('/loginadmin', (req, res) => {
  const { username, password } = req.body;
  
  const sql = "SELECT * FROM tbl_admin WHERE fld_username = ? AND fld_password = ?";
  
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      res.json({ success: false, error: "Server error. Please try again." });
    } else {
      if (results.length > 0) {
        res.json({ 
          success: true, 
          message: "Admin login successful!", 
          user: results[0] 
        });
      } else {
        res.json({ 
          success: false, 
          error: "Invalid admin credentials" 
        });
      }
    }
  });
});

app.listen(8081, () => {
  console.log('Server running on port 8081');
});