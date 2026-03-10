const mongoose = require('mongoose');
require('dotenv').config();

const CourseSchema = new mongoose.Schema({
    id: String,
    title: String
});
const Course = mongoose.model('Course', CourseSchema);

const fs = require('fs');

async function checkCourses() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        let log = 'Connected to MongoDB\n';

        const courses = await Course.find({});
        log += `Found ${courses.length} courses:\n`;
        courses.forEach(c => {
            log += `- _id: ${c._id}, id: ${c.id}, title: ${c.title}\n`;
        });

        fs.writeFileSync('courses_log.txt', log);
        console.log('Log written to courses_log.txt');

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        fs.writeFileSync('courses_log.txt', 'Error: ' + err.message);
    }
}

checkCourses();
