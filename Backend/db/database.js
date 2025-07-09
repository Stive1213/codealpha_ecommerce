const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, 'ecommerce.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Failed to connect to db:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

// USERS TABLE
db.run(`
  CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'buyer',
      request_seller INTEGER DEFAULT 0
  );
`, logError('Users'));

// PRODUCTS TABLE
db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    seller_id INTEGER,
  FOREIGN KEY(seller_id) REFERENCES users(id)
  );
`, logError('Products'));
// Add seller_id column to products table if it doesn't exist
db.get(`PRAGMA table_info(products);`, (err, columns) => {
  if (err) {
    console.error('❌ Error reading table info:', err.message);
    return;
  }
  // Check if seller_id column exists
  db.all(`PRAGMA table_info(products);`, (err, cols) => {
    if (err) {
      console.error('❌ Error fetching columns:', err.message);
      return;
    }
    const hasSellerId = cols.some(col => col.name === 'seller_id');
    if (!hasSellerId) {
      db.run(`ALTER TABLE products ADD COLUMN seller_id INTEGER;`, (err) => {
        if (err) {
          console.error('❌ Failed to add seller_id column:', err.message);
        } else {
          console.log('✅ seller_id column added to products table');
        }
      });
    } else {
      console.log('ℹ️ seller_id column already exists in products table');
    }
  });
});

// CART ITEMS TABLE
db.run(`
  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`, logError('Cart Items'));

// ORDERS TABLE
db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`, logError('Orders'));

// ORDER ITEMS TABLE
db.run(`
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`, logError('Order Items'));

// Admin user insertion
const adminEmail = 'admin@example.com';
const adminPassword = 'admin123';

bcrypt.hash(adminPassword, 10, (err, hashedPassword) => {
  if (err) {
    console.error('❌ Error hashing admin password:', err.message);
  } else {
    db.get('SELECT * FROM users WHERE email = ?', [adminEmail], (err, row) => {
      if (err) {
        console.error('❌ Error checking for existing admin:', err.message);
      } else if (!row) {
        db.run(`
          INSERT INTO users (name, email, password, role)
          VALUES (?, ?, ?, ?)
        `, ['Admin', adminEmail, hashedPassword, 'admin'], (err) => {
          if (err) {
            console.error('❌ Failed to insert admin:', err.message);
          } else {
            console.log(`✅ Admin user added (email: ${adminEmail})`);
          }
        });
      } else {
        console.log('ℹ️ Admin user already exists. Skipping insert.');
      }
    });
  }
});

// Error logger function
function logError(tableName) {
  return (err) => {
    if (err) {
      console.error(`❌ Error creating ${tableName} table:`, err.message);
    } else {
      console.log(`✅ ${tableName} table ready.`);
    }
  };
}

module.exports = db;
