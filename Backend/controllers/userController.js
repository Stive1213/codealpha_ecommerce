const db = require('../db/database');
const bcrypt = require('bcrypt');

// ---------------------------
// Register a New User
// ---------------------------
const registerUser = async (req, res) => {
  const { name, email, password, requestSeller } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const role = requestSeller ? 'pending_seller' : 'buyer';
    const request_seller = requestSeller ? 1 : 0;

    const query = `
      INSERT INTO users (name, email, password, role, request_seller)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [name, email, hashedPassword, role, request_seller], function (err) {
      if (err) {
        console.error('❌ Registration error:', err.message);
        return res.status(500).json({ message: 'Email already exists or database error' });
      }

      return res.status(201).json({
        message: 'User registered successfully',
        userId: this.lastID,
        role
      });
    });
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
};

// ---------------------------
// User Login
// ---------------------------
const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], async (err, user) => {
    if (err) {
      console.error('❌ Login query error:', err.message);
      return res.status(500).json({ message: 'Database error during login' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('❌ Password check error:', error.message);
      return res.status(500).json({ message: 'Internal error during login' });
    }
  });
};

// ---------------------------
// Approve Seller (Admin Only)
// ---------------------------
const approveSeller = (req, res) => {
  const { userId } = req.params;

  const query = `UPDATE users
                 SET role = 'seller',
                     request_seller = 0
                 WHERE id = ? AND role = 'pending_seller'`;

  db.run(query, [userId], function (err) {
    if (err) {
      console.error('❌ Error approving seller:', err.message);
      return res.status(500).json({ message: 'Error approving seller' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'User not found or already approved' });
    }

    return res.status(200).json({ message: 'Seller approved successfully' });
  });
};

module.exports = {
  registerUser,
  loginUser,
  approveSeller
};
