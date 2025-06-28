const express = require('express');
const router = express.Router();
const { registerUser, loginUser, approveSeller } = require('../controllers/userController');

router.post('/', registerUser);
router.post('/login', loginUser);
router.put('/approve-seller/:userId', approveSeller); // 👈 we'll define this next

module.exports = router;
