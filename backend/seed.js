require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

const seedCourses = [
    {
        id: 'course_101',
        title: 'English Greeting Basics',
        description: 'Learn how to introduce yourself and ask simple questions.',
        totalModules: 3,
        image: '👋',
        locked: false,
        modules: [
            { id: 1, title: 'Saying Hello', content: 'The most common way to greet someone is to say: "Hello!"', type: 'text' },
            { id: 2, title: 'Time of Day Greetings', content: 'Good Morning, Good Afternoon, Good Evening', type: 'text' },
            { id: 3, title: 'Introductions', content: 'My name is... Nice to meet you!', type: 'text' }
        ]
    },
    {
        id: 'dyslexia_101',
        title: 'Letter Tracing Magic',
        description: 'Master the alphabet with fun tracing exercises!',
        totalModules: 26,
        image: '✍️',
        locked: false
    },
    {
        id: 'dyslexia_102',
        title: 'Phonics Sound Safari',
        description: 'Listen and match sounds in the jungle.',
        totalModules: 15,
        image: '🦁',
        locked: false
    },
    {
        id: 'course_colors',
        title: 'Colors & Shapes',
        description: 'Explore the colorful world around you!',
        totalModules: 4,
        image: '🎨',
        locked: false,
        modules: [
            { id: 1, title: 'The Color Red', content: 'Apples are Red.', type: 'text' },
            { id: 2, title: 'The Color Blue', content: 'The Sky is Blue.', type: 'text' },
            { id: 3, title: 'The Color Yellow', content: 'The Sun is Yellow.', type: 'text' },
            { id: 4, title: 'Mixing Colors', content: 'Red + Yellow = Orange', type: 'text' }
        ]
    },
    {
        id: 'course_numbers',
        title: 'Numbers 1-10',
        description: 'Count from one to ten with fun friends.',
        totalModules: 5,
        image: '🔢',
        locked: false
    },
    {
        id: 'course_animals',
        title: 'Amazing Animals',
        description: 'Roar, squeak, and jump with animals!',
        totalModules: 6,
        image: '🐯',
        locked: false
    },
    {
        id: 'course_102',
        title: 'Active Listening Skills',
        description: 'Practice understanding spoken phrases.',
        totalModules: 4,
        image: '👂',
        locked: false
    },
    {
        id: 'course_103',
        title: 'Vocabulary: Home',
        description: 'Essential words for daily life.',
        totalModules: 5,
        image: '🏠',
        locked: false
    },
    {
        id: 'course_104',
        title: 'Business English',
        description: 'Professional communication basics.',
        totalModules: 6,
        image: '💼',
        locked: false
    },
    {
        id: 'course_105',
        title: 'Travel Phrases',
        description: 'Essential expressions for traveling.',
        totalModules: 5,
        image: '✈️',
        locked: false
    }
];

const bcrypt = require('bcryptjs');
const User = require('./models/User');

// ... (seedCourses array remains the same, assuming it's above this block or I'll just append to the script)

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await Course.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared Courses and Users');

        // Insert Courses
        await Course.insertMany(seedCourses);
        console.log('Courses seeded');

        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        const passwordStudent = await bcrypt.hash('password123', salt);
        const passwordAdmin = await bcrypt.hash('admin123', salt);

        // Create Student
        const student = await User.create({
            username: 'student',
            email: 'student@example.com',
            password: passwordStudent,
            role: 'student',
            gamification: {
                xp: 100,
                level: 2,
                badges: ['Explorer', 'First Steps'],
                currentStreak: 3
            },
            progress: {
                'course_101': 50
            }
        });
        console.log('Student user created');

        // Create Parent (linked to Student)
        await User.create({
            username: 'parent',
            email: 'parent@example.com',
            password: passwordStudent, // same password for demo
            role: 'parent',
            linkedChildId: student.id,
            linkedChildUsername: student.username
        });
        console.log('Parent user created');

        // Create Admin
        await User.create({
            username: 'admin',
            email: 'admin@accesslearn.com',
            password: passwordAdmin,
            role: 'admin'
        });
        console.log('Admin user created');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
