const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement, deleteAnnouncement, clearAnnouncements } = require('../controllers/announcementController');
const { protect, admin } = require('../utils/authMiddleware');

router.get('/', protect, getAnnouncements);
router.post('/', protect, admin, createAnnouncement);
router.delete('/', protect, admin, clearAnnouncements);
router.delete('/:id', protect, admin, deleteAnnouncement);

module.exports = router;
