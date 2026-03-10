const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    id: { type: String, sparse: true, unique: true }, // Optional sparse index — nulls won't conflict
    text: { type: String, required: true },
    active: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);
