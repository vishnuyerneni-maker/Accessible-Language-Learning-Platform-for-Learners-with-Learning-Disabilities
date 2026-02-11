const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');

// Middleware to verify token (Inline for simplicity, should be separate file)
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const jwt = require('jsonwebtoken');

// Get Current User Profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update Progress
router.post('/progress', auth, async (req, res) => {
    const { courseId, percent } = req.body;
    try {
        const user = await User.findById(req.user.id);

        // Update progress if higher
        const currentProgress = user.progress.get(courseId) || 0;
        if (percent > currentProgress) {
            user.progress.set(courseId, percent);

            // Add Activity
            user.recentActivity.unshift({
                text: `Updated progress in ${courseId} to ${percent}%`
            });

            // Simple Gamification Logic
            if (percent === 100) {
                user.gamification.xp += 50;
            } else {
                user.gamification.xp += 10;
            }

            await user.save();
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Child Progress (For Parents)
router.get('/child-progress', auth, async (req, res) => {
    try {
        const parent = await User.findById(req.user.id);
        if (parent.role !== 'parent' || !parent.linkedChildId) {
            return res.status(400).json({ message: 'No linked child found' });
        }

        const child = await User.findById(parent.linkedChildId).select('-password');
        res.json(child);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Admin: Get All Users
router.get('/', auth, async (req, res) => {
    console.log('Admin: Get All Users Request received');
    if (req.user.role !== 'admin') {
        console.log('Admin: Access denied for role:', req.user.role);
        return res.status(403).json({ message: 'Admin only' });
    }
    try {
        const users = await User.find().select('-password');
        console.log(`Admin: Found ${users.length} users`);
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Admin: Get System Analytics (Simple aggregation)
router.get('/analytics', auth, async (req, res) => {
    console.log('Admin: Analytics Request received');
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    try {
        const users = await User.find().select('gamification role');
        const courses = await Course.find();

        const totalUsers = users.length;
        const totalXP = users.reduce((acc, user) => acc + (user.gamification?.xp || 0), 0);
        const activeStudents = users.filter(u => u.role === 'student').length;

        res.json({
            userStats: { total: totalUsers, totalXP, activeStudents },
            courseStats: { total: courses.length, completionRates: [] } // Completion rates would require more complex aggregation
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
