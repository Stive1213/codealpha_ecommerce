const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  approveSeller,
  getPendingSellers,
  getAllUsers
} = require('../controllers/userController');

router.post('/', registerUser);
router.post('/login', loginUser);
router.put('/approve-seller/:userId', approveSeller);
router.get('/pending-sellers', getPendingSellers);
router.get('/all', getAllUsers);

module.exports = router;
