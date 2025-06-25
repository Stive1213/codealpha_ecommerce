const express = require('express');
const cors = require('cors');
const db= require('./db/database');
const app = express();
const port = 5000;

// Middleware to parse JSON request bodies
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce API');
})



// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});