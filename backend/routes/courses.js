const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Middleware
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

// Get All Courses
router.get('/', auth, async (req, res) => {
    try {
        const courses = await Course.find();
        // We could merge user progress here if we wanted to mirror the old getCourses() 
        // but typically clean APIs return pure resources. 
        // The frontend can merge the data from /users/me or we can do it here.
        // Let's do it here for backward compatibility with the frontend logic if needed,
        // OR rely on the frontend to fetch both.
        // For now, just return courses.
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create Course (Admin only - simplified)
router.post('/', auth, async (req, res) => {
    console.log('Admin: Create Course Request:', req.body);
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

    try {
        const newCourse = new Course(req.body);
        const course = await newCourse.save();
        console.log('Admin: Course Created:', course);
        res.json(course);
    } catch (err) {
        console.error('Admin: Course Creation Error:', err.message);
        res.status(500).send('Server error');
    }
});

// Delete Course (Admin only)
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

    try {
        console.log(`Admin: Delete Course Request for ID: ${req.params.id}`);
        let course = await Course.findOne({ id: req.params.id });
        if (!course) {
            console.log(`Admin: Course not found by custom ID: ${req.params.id}. Checking ObjectId...`);
            if (mongoose.Types.ObjectId.isValid(req.params.id)) {
                course = await Course.findById(req.params.id);
            }
        }

        if (!course) {
            console.log(`Admin: Course not found for ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Course not found' });
        }

        await Course.deleteOne({ _id: course._id });
        res.json({ message: 'Course removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update Course (Admin only)
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

    try {
        let course = await Course.findOne({ id: req.params.id });
        if (!course) {
            // Check if it's a valid MongoDB ObjectId before querying
            if (mongoose.Types.ObjectId.isValid(req.params.id)) {
                course = await Course.findById(req.params.id);
            }
        }

        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Update fields
        const { title, description, image, totalModules, locked } = req.body;
        if (title) course.title = title;
        if (description) course.description = description;
        if (image) course.image = image;
        if (totalModules) course.totalModules = totalModules;
        if (locked !== undefined) course.locked = locked;

        await course.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
