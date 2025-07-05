const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// ✅ CORS should come first
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json());

const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const buyerRoutes = require('./routes/buyer');
app.use('/buyer', buyerRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
