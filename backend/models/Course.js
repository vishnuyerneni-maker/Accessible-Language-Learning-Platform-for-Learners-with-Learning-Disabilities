const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    id: {
        type: String, // String ID to match frontend seed data (e.g. 'course_101')
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    totalModules: {
        type: Number,
        default: 0
    },
    image: {
        type: String // Emoji or URL
    },
    locked: {
        type: Boolean,
        default: false
    },
    // Can extend with actual module content if needed in future
    modules: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    }
});

module.exports = mongoose.model('Course', CourseSchema);
