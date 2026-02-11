const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');

        const userCount = await User.countDocuments();
        console.log(`Total Users: ${userCount}`);

        const users = await User.find({}, 'username role email');
        console.log('Users:', users);

        const courseCount = await Course.countDocuments();
        console.log(`Total Courses: ${courseCount}`);

        const courses = await Course.find({}, 'title id');
        console.log('Courses:', courses);

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
