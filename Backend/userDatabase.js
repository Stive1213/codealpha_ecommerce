const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

// Define the path to the SQLite database file
const dbPath = path.resolve(__dirname, 'ecommerce.db');

// Initialize the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create the users table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created or already exists.');
    }
  });
});

// Function to register a new user with hashed password
async function registerUser(firstName, lastName, email, password) {
  try {
    // Generate a salt with 10 rounds (adjustable for security)
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the user into the database
    const stmt = db.prepare(`
      INSERT INTO users (firstName, lastName, email, password)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(firstName, lastName, email, hashedPassword, (err) => {
      if (err) {
        console.error('Error inserting user:', err.message);
      } else {
        console.log('User registered successfully:', email);
      }
    });
    stmt.finalize();
  } catch (err) {
    console.error('Error hashing password:', err.message);
  }
}

// Function to verify a user during login
async function verifyUser(email, password) {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT * FROM users WHERE email = ?
    `, [email], async (err, row) => {
      if (err) {
        return reject('Error querying user: ' + err.message);
      }
      if (!row) {
        return resolve({ success: false, message: 'User not found' });
      }

      // Compare the provided password with the stored hashed password
      const match = await bcrypt.compare(password, row.password);
      if (match) {
        resolve({ success: true, user: { id: row.id, firstName: row.firstName, lastName: row.lastName, email: row.email } });
      } else {
        resolve({ success: false, message: 'Invalid password' });
      }
    });
  });
}

// Export the database and functions for use in other modules
module.exports = {
  db,
  registerUser,
  verifyUser,
};