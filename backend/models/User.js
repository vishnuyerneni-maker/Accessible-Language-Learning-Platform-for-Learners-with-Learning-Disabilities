const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, // Hashed password, null for OAuth users
    },
    role: {
        type: String,
        enum: ['student', 'parent', 'admin'],
        default: 'student'
    },
    name: {
        type: String
    },
    // Progress Mapping: CourseID -> Percentage
    progress: {
        type: Map,
        of: Number,
        default: {}
    },
    // Gamification Data
    gamification: {
        xp: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        badges: [String],
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastLoginDate: { type: Date }
    },
    // For Parent-Child Linking
    linkedChildId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    parentSettings: {
        lockedCourses: [String] // Array of Course IDs locked by parent
    },
    // Security
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String },

    // OAuth
    oauthProvider: { type: String }, // 'google', 'microsoft'
    oauthId: { type: String },
    profilePicture: { type: String },

    recentActivity: [{
        text: String,
        time: { type: Date, default: Date.now }
    }],

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
