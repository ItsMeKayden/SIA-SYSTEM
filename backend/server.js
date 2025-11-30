const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'washtrack_db',
});

// FOR CHECKING CONNECTION
db.connect((err) => {
  if (err) {
    console.log('Database connection failed:', err.message);
    console.log('Error code:', err.code);
  } else {
    console.log('Connected to database');
  }
});

// FOR SIGNUP FUNCTIONALITY
app.post('/signupuser', (req, res) => {
  const { username, password, email, contact } = req.body;

  const sql =
    'INSERT INTO tbl_user (fld_username, fld_password, fld_email, fld_contact) VALUES (?, ?, ?, ?)';

  db.query(sql, [username, password, email, contact], (err, result) => {
    if (err) {
      res.json({ success: false, error: 'Failed to sign up:' + err.message });
    } else {
      res.json({ success: true, message: 'User added!' });
    }
  });
});

// FOR ADMIN LOGIN
app.post('/loginadmin', (req, res) => {
  const { email, password } = req.body;

  console.log('Admin login attempt:', { email, password });

  const sql =
    'SELECT * FROM tbl_admin WHERE fld_email = ? AND fld_password = ?';

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log('Database error:', err.message);
      res.json({ success: false, error: 'Login failed: ' + err.message });
    } else {
      console.log('Query result:', result);
      if (result.length > 0) {
        res.json({
          success: true,
          message: 'Admin login successful',
          adminID: result[0].fld_adminID,
        });
      } else {
        res.json({ success: false, error: 'Invalid email or password' });
      }
    }
  });
});

// FOR USER LOGIN
app.post('/loginuser', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM tbl_user WHERE fld_email = ? AND fld_password = ?';

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      res.json({ success: false, error: 'Login failed: ' + err.message });
    } else if (result.length > 0) {
      res.json({
        success: true,
        message: 'User login successful',
        userID: result[0].fld_userID,
        username: result[0].fld_username,
      });
    } else {
      res.json({ success: false, error: 'Invalid email or password' });
    }
  });
});

// FOR GETTING USER BY ID
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  console.log('Fetching user with ID:', userId, 'Type:', typeof userId);

  const sql = 'SELECT * FROM tbl_user WHERE fld_userID = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('User fetch error:', err.message);
      res.json({
        success: false,
        error: 'Failed to fetch user: ' + err.message,
      });
    } else if (result.length > 0) {
      console.log('User found:', result[0]);
      res.json({ success: true, data: result[0] });
    } else {
      console.log(
        'User not found with ID:',
        userId,
        'Query executed successfully but no results'
      );
      res.json({ success: false, error: 'User not found' });
    }
  });
});

// FOR GETTING ALL SERVICES
app.get('/services', (req, res) => {
  console.log('GET /services endpoint called');
  const sql = 'SELECT * FROM tbl_services';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Services fetch error:', err);
      res.json({
        success: false,
        error: 'Failed to fetch services: ' + err.message,
      });
    } else {
      console.log('Services returned:', result.length, 'records');
      res.json({ success: true, data: result });
    }
  });
});

// FOR CREATING A NEW SERVICE
app.post('/services', (req, res) => {
  const { name, description, status, price } = req.body;

  console.log('Creating service with:', { name, description, status, price });

  const sql =
    'INSERT INTO tbl_services (fld_serviceName, fld_description, fld_serviceStatus, fld_servicePrice) VALUES (?, ?, ?, ?)';

  db.query(sql, [name, description, status, price], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.json({
        success: false,
        error: 'Failed to create service: ' + err.message,
      });
    } else {
      console.log('Service created with ID:', result.insertId);
      res.json({
        success: true,
        message: 'Service created successfully',
        id: result.insertId,
      });
    }
  });
});

// FOR UPDATING A SERVICE
app.put('/services/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, status, price } = req.body;

  console.log('Updating service ID:', id, 'Type:', typeof id, 'with:', {
    name,
    description,
    status,
    price,
  });

  const sql =
    'UPDATE tbl_services SET fld_serviceName = ?, fld_description = ?, fld_serviceStatus = ?, fld_servicePrice = ? WHERE fld_serviceID = ?';

  db.query(sql, [name, description, status, price, id], (err, result) => {
    if (err) {
      console.error('Update error:', err);
      return res.json({
        success: false,
        error: 'Failed to update service: ' + err.message,
      });
    }

    console.log('Update result - Rows affected:', result.affectedRows);

    if (result.affectedRows === 0) {
      return res.json({ success: false, error: 'Service ID not found' });
    }

    res.json({ success: true, message: 'Service updated successfully' });
  });
});

// FOR DELETING A SERVICE
app.delete('/services/:id', (req, res) => {
  const id = parseInt(req.params.id);

  console.log('Deleting service ID:', id, 'Type:', typeof id);

  const sql = 'DELETE FROM tbl_services WHERE fld_serviceID = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Delete error:', err);
      return res.json({
        success: false,
        error: 'Failed to delete service: ' + err.message,
      });
    }

    console.log('Delete result - Rows affected:', result.affectedRows);

    if (result.affectedRows === 0) {
      return res.json({ success: false, error: 'Service ID not found' });
    }

    res.json({ success: true, message: 'Service deleted successfully' });
  });
});

// FOR GETTING ALL ORDERS or ORDERS BY USER ID
app.get('/orders', (req, res) => {
  const { userID } = req.query;

  let sql = `
    SELECT 
      o.fld_orderID,
      o.fld_userID,
      o.fld_serviceID,
      o.fld_adminID,
      o.fld_orderDate,
      o.fld_orderStatus,
      o.fld_amount,
      o.fld_items,
      u.fld_username,
      s.fld_serviceName
    FROM tbl_orders o
    LEFT JOIN tbl_user u ON o.fld_userID = u.fld_userID
    LEFT JOIN tbl_services s ON o.fld_serviceID = s.fld_serviceID
  `;

  // If userID is provided, filter by that userID
  if (userID) {
    sql += ` WHERE o.fld_userID = ? `;
    console.log('Fetching orders for userID:', userID);
    db.query(
      sql + 'ORDER BY o.fld_orderDate DESC',
      [parseInt(userID)],
      (err, result) => {
        if (err) {
          res.json({
            success: false,
            error: 'Failed to fetch orders: ' + err.message,
          });
        } else {
          res.json({ success: true, data: result });
        }
      }
    );
  } else {
    // Fetch all orders (for admin)
    sql += ` ORDER BY o.fld_orderDate DESC`;
    console.log('Fetching all orders');
    db.query(sql, (err, result) => {
      if (err) {
        res.json({
          success: false,
          error: 'Failed to fetch orders: ' + err.message,
        });
      } else {
        res.json({ success: true, data: result });
      }
    });
  }
});

// FOR CREATING A NEW ORDER
app.post('/orders', (req, res) => {
  const { userID, serviceID, orderDate, status, amount, adminID, items } =
    req.body;

  console.log('Creating order with:', {
    userID,
    serviceID,
    orderDate,
    status,
    amount,
    adminID,
    items,
  });

  const sql =
    'INSERT INTO tbl_orders (fld_userID, fld_serviceID, fld_orderDate, fld_orderStatus, fld_amount, fld_adminID, fld_items) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.query(
    sql,
    [userID, serviceID, orderDate, status, amount, adminID, items],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        res.json({
          success: false,
          error: 'Failed to create order: ' + err.message,
        });
      } else {
        console.log('Order created with ID:', result.insertId);
        res.json({
          success: true,
          message: 'Order created successfully',
          id: result.insertId,
        });
      }
    }
  );
});

// FOR UPDATING ORDER STATUS
app.put('/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { status, serviceID, orderDate, amount, items } = req.body;

  process.stdout.write('\n=== PUT /orders/:id called ===\n');
  process.stdout.write(`Order ID: ${id}\n`);
  process.stdout.write(`Request body: ${JSON.stringify(req.body)}\n`);

  // Check if this is a full update (has serviceID, orderDate, amount, items) or status-only update
  const isFullUpdate = serviceID && orderDate && amount !== undefined && items;
  process.stdout.write(`Is full update: ${isFullUpdate}\n`);

  if (isFullUpdate) {
    // Full order update
    const sql =
      'UPDATE tbl_orders SET fld_serviceID = ?, fld_orderDate = ?, fld_orderStatus = ?, fld_amount = ?, fld_items = ? WHERE fld_orderID = ?';

    const params = [
      parseInt(serviceID),
      orderDate,
      status,
      parseFloat(amount),
      items,
      id,
    ];

    process.stdout.write('Executing FULL UPDATE\n');
    process.stdout.write(`SQL: ${sql}\n`);
    process.stdout.write(`Params: ${JSON.stringify(params)}\n`);

    db.query(sql, params, (err, result) => {
      if (err) {
        process.stdout.write(`UPDATE ERROR: ${err.message}\n`);
        return res.json({
          success: false,
          error: 'Failed to update order: ' + err.message,
        });
      }

      process.stdout.write(
        `UPDATE SUCCESSFUL. Rows affected: ${result.affectedRows}\n`
      );

      if (result.affectedRows === 0) {
        process.stdout.write(`Order ID not found: ${id}\n`);
        return res.json({ success: false, error: 'Order ID not found' });
      }

      res.json({ success: true, message: 'Order updated successfully' });
    });
  } else {
    // Status-only update
    const sql =
      'UPDATE tbl_orders SET fld_orderStatus = ? WHERE fld_orderID = ?';
    process.stdout.write('Executing STATUS-ONLY UPDATE\n');
    process.stdout.write(`SQL: ${sql}\n`);
    process.stdout.write(`Params: ${JSON.stringify([status, id])}\n`);

    db.query(sql, [status, id], (err, result) => {
      if (err) {
        process.stdout.write(`UPDATE ERROR: ${err.message}\n`);
        return res.json({
          success: false,
          error: 'Failed to update order: ' + err.message,
        });
      }

      process.stdout.write(
        `UPDATE SUCCESSFUL. Rows affected: ${result.affectedRows}\n`
      );

      if (result.affectedRows === 0) {
        process.stdout.write(`Order ID not found: ${id}\n`);
        return res.json({ success: false, error: 'Order ID not found' });
      }

      res.json({ success: true, message: 'Order updated successfully' });
    });
  }
});

// FOR DELETING AN ORDER
app.delete('/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);

  console.log('Deleting order ID:', id);

  const sql = 'DELETE FROM tbl_orders WHERE fld_orderID = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Delete error:', err);
      return res.json({
        success: false,
        error: 'Failed to delete order: ' + err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.json({ success: false, error: 'Order ID not found' });
    }

    res.json({ success: true, message: 'Order deleted successfully' });
  });
});

app.listen(8081, '0.0.0.0', () => {
  console.log('Server running on port 8081');
});
