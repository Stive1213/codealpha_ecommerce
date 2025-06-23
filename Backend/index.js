const express = require('express');
const { registerUser, verifyUser } = require('./userDatabase');
const app = express();
const port = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// API endpoint for user registration
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Basic validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await registerUser(firstName, lastName, email, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user: ' + err.message });
  }
});

// API endpoint for user login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await verifyUser(email, password);
    if (result.success) {
      res.status(200).json({ message: 'Login successful', user: result.user });
    } else {
      res.status(401).json({ error: result.message });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error logging in: ' + err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});