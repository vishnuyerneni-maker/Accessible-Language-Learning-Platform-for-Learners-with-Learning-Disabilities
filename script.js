/**
 * Project: Accessible Language Learning Platform
 * Module: Core Accessibility & Data Engine
 * Sprint: 1 & 2 (Functional Upgrade)
 * Author: Team Member (Abstracted)
 *
 * Description:
 * 1. Accessibility Engine: Manages themes, fonts, and TTS.
 * 2. MockBackend: Simulates a database using localStorage for courses, users, and progress.
 */

// === CONFIGURATION ===
// WARNING: Exposing API keys in frontend code is unsafe for production.
// This is done here strictly for a designated prototype environment.
const GEMINI_API_KEY = "AIzaSyA5xcQTKIB5nlCd0LHrvLJwN6Ndb84Svoo";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// === AI SERVICE ===
const GeminiService = {
    async generateQuizQuestion(topic) {
        const prompt = `
            Generate 1 multiple choice quiz question about "${topic}" for a beginner English learner.
            Return ONLY a raw JSON object (no markdown formatting, no backticks) with this structure:
            {
                "question": "The question text",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctIndex": 0, // 0-3 indicating the correct option
                "explanation": "A short, helpful explanation of why the correct answer is right."
            }
        `;

        try {
            const response = await fetch(GEMINI_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;
            // Clean up if model adds markdown blocks
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (error) {
            console.error("AI Generation Failed:", error);
            // Fallback content if AI fails or quota exceeded
            return {
                question: "What is a common way to say hello? (Offline Fallback)",
                options: ["Hi", "Bye", "See ya", "Nope"],
                correctIndex: 0,
                explanation: "'Hi' is a standard, friendly greeting in English."
            };
        }
    }
};

// === MOCK DATABASE & API LAYER ===
const MockBackend = {
    // Initial Seed Data (Simulating a DB)
    seedData: {
        courses: [
            {
                id: 'course_101',
                title: 'English Greeting Basics',
                description: 'Learn how to introduce yourself and ask simple questions.',
                totalModules: 3,
                image: '👋', // Emoji as placeholder image
                locked: false
            },
            {
                id: 'course_102',
                title: 'Active Listening Skills',
                description: 'Practice understanding spoken phrases in noisy environments.',
                totalModules: 4,
                image: '👂',
                locked: true // Requires 101 completion (logic simulated)
            },
            {
                id: 'course_103',
                title: 'Vocabulary: Home & Family',
                description: 'Essential words for daily life.',
                totalModules: 5,
                image: '🏠',
                locked: true
            }
        ],
        users: [
             {
                id: 'u_1',
                username: 'student',
                password: 'password123', // stored plain text for prototype simplicity
                role: 'student',
                name: 'Student User',
                email: 'student@example.com',
                progress: { 'course_101': 0, 'course_102': 0, 'course_103': 0 },
                recentActivity: []
            },
            {
                id: 'u_p1',
                username: 'parent',
                password: 'password123',
                role: 'parent',
                name: 'Parent User',
                email: 'parent@example.com',
                linkedChildId: 'u_1'
            }
        ]
    },

    // Initialize DB if empty
    init() {
        if (!localStorage.getItem('app_courses')) {
            localStorage.setItem('app_courses', JSON.stringify(this.seedData.courses));
        }
        // We now store a list of users, not just one "currentUser" session
        if (!localStorage.getItem('app_users_db')) {
            localStorage.setItem('app_users_db', JSON.stringify(this.seedData.users));
        }
    },

    // Login Method
    login(username, password) {
        const users = JSON.parse(localStorage.getItem('app_users_db'));
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Set active session
            localStorage.setItem('app_current_session', JSON.stringify(user));
            return { success: true, role: user.role };
        }
        return { success: false, message: "Invalid credentials" };
    },

    logout() {
        localStorage.removeItem('app_current_session');
    },

    // Get current logged in user (Session)
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('app_current_session'));
    },
    
    // Save user state back to the MAIN "users db"
    saveUser(updatedUser) {
        // Update session
        localStorage.setItem('app_current_session', JSON.stringify(updatedUser));
        
        // Update DB
        const users = JSON.parse(localStorage.getItem('app_users_db'));
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem('app_users_db', JSON.stringify(users));
        }
    },

    // Get all courses with user progress attached
    getCourses() {
        const courses = JSON.parse(localStorage.getItem('app_courses'));
        const user = this.getCurrentUser();
        
        if (!user || user.role !== 'student') return courses;

        return courses.map(course => ({
            ...course,
            progress: user.progress[course.id] || 0
        }));
    },

    // Update progress for a specific course
    updateProgress(courseId, percent) {
        const user = this.getCurrentUser();
        
        // Only update if new percentage is higher
        if (!user.progress[courseId] || percent > user.progress[courseId]) {
            user.progress[courseId] = percent;
            
            // Log activity
            user.recentActivity.unshift({
                text: `Updated progress in ${courseId} to ${percent}%`,
                time: new Date().toLocaleString()
            });

            // Unlock next course logic (Simple simulation)
            if (courseId === 'course_101' && percent === 100) {
                 this.unlockCourse('course_102');
                 user.recentActivity.unshift({
                    text: `🎊 Unlocked: Active Listening Skills`,
                    time: new Date().toLocaleString()
                });
            }

            this.saveUser(user);
        }
    },

    unlockCourse(courseId) {
        const courses = JSON.parse(localStorage.getItem('app_courses'));
        const course = courses.find(c => c.id === courseId);
        if (course) {
            course.locked = false;
            localStorage.setItem('app_courses', JSON.stringify(courses));
        }
    },

    saveUser(user) {
        localStorage.setItem('app_user', JSON.stringify(user));
    },
    
    // Add a simple quiz result
    submitQuiz(quizName, score) {
        const user = this.getCurrentUser();
        user.recentActivity.unshift({
            text: `Completed Quiz: ${quizName} - Score: ${score}%`,
            time: new Date().toLocaleString()
        });
        this.saveUser(user);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // === Initialize Accessibility Settings ===
    initAccessibility();
    
    // === Initialize Data ===
    MockBackend.init();

    // === Event Listeners for Toolbar ===
    const themeBtn = document.getElementById('a11y-theme');
    const fontBtn = document.getElementById('a11y-font');
    const sizeUpBtn = document.getElementById('a11y-size-up');
    const sizeDownBtn = document.getElementById('a11y-size-down');

    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    if (fontBtn) fontBtn.addEventListener('click', toggleDyslexiaFont);
    if (sizeUpBtn) sizeUpBtn.addEventListener('click', () => adjustFontSize(1));
    if (sizeDownBtn) sizeDownBtn.addEventListener('click', () => adjustFontSize(-1));
});

/**
 * Loads saved preferences from localStorage and applies them.
 * This ensures the user's choices are remembered on page reload.
 */
function initAccessibility() {
    console.log("Initializing Accessibility Preferences...");

    // 1. Load Theme
    const savedTheme = localStorage.getItem('siteTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // 2. Load Dyslexia Font
    const isDyslexic = localStorage.getItem('dyslexiaFont') === 'true';
    if (isDyslexic) {
        document.body.classList.add('dyslexia-font');
    }

    // 3. Load Font Size (Default 16px)
    const savedFontSize = parseInt(localStorage.getItem('fontSize')) || 16;
    document.documentElement.style.setProperty('--base-font-size', savedFontSize + 'px');
}

/**
 * Cycles through available themes: Light -> Dark -> High Contrast -> Light
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme = 'light';

    if (currentTheme === 'light') {
        newTheme = 'dark';
    } else if (currentTheme === 'dark') {
        newTheme = 'high-contrast';
    } else {
        newTheme = 'light'; // Reset to default
    }

    // Apply and Save
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('siteTheme', newTheme);
    
    // Feedback
    const themeNames = {
        'light': 'Light Mode',
        'dark': 'Dark Mode',
        'high-contrast': 'High Contrast Mode'
    };
    showToast(`Switched to ${themeNames[newTheme]}`);
}

/**
 * Toggles the 'dyslexia-font' class on the body.
 * This overrides the default font-family with a more readable alternative.
 */
function toggleDyslexiaFont() {
    const body = document.body;
    body.classList.toggle('dyslexia-font');
    
    // Save state
    const isEnabled = body.classList.contains('dyslexia-font');
    localStorage.setItem('dyslexiaFont', isEnabled);
    
    showToast(isEnabled ? "Dyslexia-Friendly Font Enabled" : "Standard Font Enabled");
}

/**
 * Adjusts the global font size variable.
 * @param {number} change - Positive or negative integer (e.g., +2 or -2)
 */
function adjustFontSize(change) {
    const root = document.documentElement;
    const currentSize = parseInt(getComputedStyle(root).getPropertyValue('--base-font-size')) || 16;
    
    // Limit font size range: 12px to 24px
    let newSize = currentSize + change;
    if (newSize < 12) newSize = 12;
    if (newSize > 32) newSize = 32; // Allow large text for low vision

    // Apply and Save
    root.style.setProperty('--base-font-size', newSize + 'px');
    localStorage.setItem('fontSize', newSize);
    
    showToast(`Font Size: ${newSize}px`);
}

/**
 * Helper: Text-to-Speech implementation
 * Reads the text content of a given element.
 * @param {string} elementId - The ID of the HTML element to read.
 */
function speakText(elementId) {
    const text = document.getElementById(elementId).innerText;
    if (!text) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use preferences if available (could be extended later)
    utterance.rate = 1.0; // Normal speed
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
    showToast("Reading aloud...");
}

/**
 * Displays a temporary toast notification at the bottom of the screen.
 * @param {string} message - The message to display
 */
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    // Set content and show
    toast.innerText = message;
    toast.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
