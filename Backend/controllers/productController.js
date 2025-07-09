const db = require('../db/database');

// ---------------------------
// Get All Products (Public for Buyers)
// ---------------------------
const getAllProducts = (req, res) => {
  const query = `SELECT * FROM products`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch products' });
    res.json({ products: rows });
  });
};

const getProductById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM products WHERE id = ?';

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('❌ Error fetching product by ID:', err.message);
      return res.status(500).json({ message: 'Failed to fetch product' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product: row });
  });
};

// ---------------------------
// Get Products for Logged-in Seller
// ---------------------------
const getSellerProducts = (req, res) => {
  const sellerId = req.headers['x-user-id'];

  const query = `SELECT * FROM products WHERE seller_id = ?`;
  db.all(query, [sellerId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch products' });
    res.json({ products: rows });
  });
};

// ---------------------------
// Add a New Product
// ---------------------------
const addProduct = (req, res) => {
  const { name, description, price, image } = req.body;
  const sellerId = req.headers['x-user-id'];

  const query = `INSERT INTO products (name, description, price, image, seller_id) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [name, description, price, image, sellerId], function (err) {
    if (err) return res.status(500).json({ message: 'Failed to add product' });
    res.status(201).json({ message: 'Product added', productId: this.lastID });
  });
};

// ---------------------------
// Update Product (with ownership check)
// ---------------------------
const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, image } = req.body;
  const sellerId = req.headers['x-user-id'];

  // Check ownership first
  const checkQuery = `SELECT seller_id FROM products WHERE id = ?`;
  db.get(checkQuery, [id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!row) return res.status(404).json({ message: 'Product not found' });
    if (row.seller_id != sellerId) {
      return res.status(403).json({ message: 'Unauthorized: Not your product' });
    }

    // Proceed to update
    const updateQuery = `
      UPDATE products
      SET name = ?, description = ?, price = ?, image = ?
      WHERE id = ?
    `;
    db.run(updateQuery, [name, description, price, image, id], function (err) {
      if (err) return res.status(500).json({ message: 'Failed to update product' });
      res.json({ message: 'Product updated' });
    });
  });
};

// ---------------------------
// Delete Product (with ownership check)
// ---------------------------
const deleteProduct = (req, res) => {
  const { id } = req.params;
  const sellerId = req.headers['x-user-id'];

  // Check ownership first
  const checkQuery = `SELECT seller_id FROM products WHERE id = ?`;
  db.get(checkQuery, [id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!row) return res.status(404).json({ message: 'Product not found' });
    if (row.seller_id != sellerId) {
      return res.status(403).json({ message: 'Unauthorized: Not your product' });
    }

    // Proceed to delete
    const deleteQuery = `DELETE FROM products WHERE id = ?`;
    db.run(deleteQuery, [id], function (err) {
      if (err) return res.status(500).json({ message: 'Failed to delete product' });
      res.json({ message: 'Product deleted' });
    });
  });
};

// ---------------------------
// Get Seller Orders
// ---------------------------
const getSellerOrders = (req, res) => {
  const sellerId = req.headers['x-user-id'];

  const query = `
    SELECT o.id AS order_id, o.created_at, o.total, o.status,
           oi.quantity, oi.price,
           p.name AS product_name,
           u.name AS buyer_name, u.email AS buyer_email
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    JOIN users u ON o.user_id = u.id
    WHERE p.seller_id = ?
    ORDER BY o.created_at DESC
  `;

  db.all(query, [sellerId], (err, rows) => {
    if (err) {
      console.error('❌ Error fetching seller orders:', err.message);
      return res.status(500).json({ message: 'Failed to fetch orders' });
    }

    res.status(200).json({ orders: rows });
  });
};

module.exports = {
  getAllProducts,
  getSellerProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getSellerOrders,
  getProductById
};
