const db = require('../db/database');

// Browse all products
const getAllProducts = (req, res) => {
  db.all(`SELECT * FROM products`, [], (err, rows) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ products: rows });
  });
};

// Product detail
const getProductById = (req, res) => {
  db.get(`SELECT * FROM products WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!row) return res.status(404).json({ message: 'Product not found' });
    res.json({ product: row });
  });
};

// Add to cart
const addToCart = (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ message: 'Missing userId, productId, or quantity' });
  }

  // Validate product exists
  db.get(`SELECT id FROM products WHERE id = ?`, [productId], (err, product) => {
    if (err) {
      console.error('Database error checking product:', err.message);
      return res.status(500).json({ message: 'Database error' });
    }
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validate user exists (optional, if you have a users table)
    db.get(`SELECT id FROM users WHERE id = ?`, [userId], (err, user) => {
      if (err) {
        console.error('Database error checking user:', err.message);
        return res.status(500).json({ message: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const query = `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)`;
      db.run(query, [userId, productId, quantity], function (err) {
        if (err) {
          console.error('Failed to add to cart:', err.message);
          return res.status(500).json({ message: `Failed to add to cart: ${err.message}` });
        }
        res.status(201).json({ message: 'Added to cart', cartItemId: this.lastID });
      });
    });
  });
};



// View cart
const getCart = (req, res) => {
  db.all(
    `SELECT ci.id, p.name, p.price, ci.quantity
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = ?`,
    [req.params.userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ cart: rows });
    }
  );
};

// Remove cart item
const removeFromCart = (req, res) => {
  db.run(
    `DELETE FROM cart_items WHERE id = ?`,
    [req.params.itemId],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: 'Removed' });
    }
  );
};


// Place order
const placeOrder = (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'userId required' });

  db.all(
    `SELECT ci.product_id, ci.quantity, p.price
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = ?`,
    [userId],
    (err, items) => {
      if (err) return res.status(500).json({ message: err.message });
      if (!items.length) return res.status(400).json({ message: 'Cart empty' });

      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      db.run(`INSERT INTO orders (user_id, total) VALUES (?, ?)`, [userId, total], function (err) {
        if (err) return res.status(500).json({ message: err.message });
        const orderId = this.lastID;

        const stmt = db.prepare(`INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`);
        items.forEach(i => stmt.run(orderId, i.product_id, i.quantity, i.price));
        stmt.finalize();

        // Clear cart
        db.run(`DELETE FROM cart_items WHERE user_id = ?`, [userId], err => {
          if (err) console.error('Failed to clear cart:', err);
        });

        res.json({ orderId });
      });
    }
  );
};

module.exports = {
  getAllProducts,
  getProductById,
  addToCart,
  getCart,
  removeFromCart,
  placeOrder
};
