const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, updateProgress, getChildProgress, toggleChildCourseLock, getSystemStats } = require('../controllers/userController');
const { protect, admin, adminOrTeacher } = require('../utils/authMiddleware');

router.get('/', protect, adminOrTeacher, getAllUsers);
router.get('/stats', protect, getSystemStats);
router.delete('/:id', protect, adminOrTeacher, deleteUser);
router.put('/progress', protect, updateProgress);
router.get('/child/:id', protect, getChildProgress);
router.put('/child/lock', protect, toggleChildCourseLock);

module.exports = router;
