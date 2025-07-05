const db = require('../db/database');

// Get all products
const getAllProducts = (req, res) => {
  db.all(`SELECT * FROM products`, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching products' });
    res.json({ products: rows });
  });
};

// Add product to cart
const addToCart = (req, res) => {
  const { userId, productId, quantity } = req.body;
  db.run(
    `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)`,
    [userId, productId, quantity],
    function (err) {
      if (err) return res.status(500).json({ message: 'Error adding to cart' });
      res.status(201).json({ message: 'Added to cart', cartItemId: this.lastID });
    }
  );
};

// Get user's cart
const getCart = (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT ci.id, p.name, p.price, ci.quantity
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `;
  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error retrieving cart' });
    res.json({ cart: rows });
  });
};

// Remove item from cart
const removeFromCart = (req, res) => {
  const cartItemId = req.params.cartItemId;
  db.run(`DELETE FROM cart_items WHERE id = ?`, [cartItemId], function (err) {
    if (err) return res.status(500).json({ message: 'Error removing item' });
    res.json({ message: 'Item removed from cart' });
  });
};

// Checkout
const checkout = (req, res) => {
  const userId = req.params.userId;

  const getCartQuery = `SELECT * FROM cart_items WHERE user_id = ?`;
  db.all(getCartQuery, [userId], (err, items) => {
    if (err) return res.status(500).json({ message: 'Error checking out' });

    if (!items.length) return res.status(400).json({ message: 'Cart is empty' });

    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    db.run(`INSERT INTO orders (user_id, total) VALUES (?, ?)`, [userId, total], function (err) {
      if (err) return res.status(500).json({ message: 'Error creating order' });

      const orderId = this.lastID;

      const insertItems = items.map(item =>
        db.run(
          `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.price]
        )
      );

      db.run(`DELETE FROM cart_items WHERE user_id = ?`, [userId]);

      res.status(201).json({ message: 'Order placed', orderId });
    });
  });
};

module.exports = {
  getAllProducts,
  addToCart,
  getCart,
  removeFromCart,
  checkout,
};
