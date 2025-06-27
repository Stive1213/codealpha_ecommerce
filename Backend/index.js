// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

const userRoutes = require('./routes/users');

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
