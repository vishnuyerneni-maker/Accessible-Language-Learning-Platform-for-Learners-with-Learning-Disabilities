const Announcement = require('../models/Announcement');

// @desc    Get all active announcements
// @route   GET /api/announcements
// @access  Private
exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ active: true }).sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create announcement (Admin only)
// @route   POST /api/announcements
// @access  Private/Admin
exports.createAnnouncement = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'Announcement text is required' });
        }

        const announcement = await Announcement.create({
            text: text.trim(),
            active: true
        });

        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete announcement (Admin only)
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (announcement) {
            await announcement.deleteOne();
            res.json({ message: 'Announcement removed' });
        } else {
            res.status(404).json({ message: 'Announcement not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear all announcements (Admin only)
// @route   DELETE /api/announcements
// @access  Private/Admin
exports.clearAnnouncements = async (req, res) => {
    try {
        await Announcement.deleteMany({});
        res.json({ message: 'All announcements cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
