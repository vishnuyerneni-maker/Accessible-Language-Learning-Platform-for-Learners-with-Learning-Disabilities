/**
 * Unit Tests for MockBackend (script.js)
 * 
 * This file tests the core data management of the application, including:
 * - Data Initialization (Seed Data)
 * - User Authentication (Login/Logout)
 * - OAuth User Management
 * - Course Progress Tracking and Locking Mechanisms
 * 
 * It mocks functionality that relies on the browser's localStorage.
 */

// --- GLOBAL MOCKS (must be before require) ---
// Mocking the browser environment (document, window, localStorage)
global.document = {
    addEventListener: jest.fn(),
    getElementById: jest.fn(),
    documentElement: { setAttribute: jest.fn(), style: { setProperty: jest.fn() } },
    body: { classList: { add: jest.fn() } }
};
global.window = {
    speechSynthesis: { cancel: jest.fn() } // accessed in script.js speakText
};
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};

// Simple in-memory storage for localStorage mock
const store = {};
global.localStorage.getItem.mockImplementation((key) => store[key] || null);
global.localStorage.setItem.mockImplementation((key, val) => { store[key] = val.toString(); });
global.localStorage.removeItem.mockImplementation((key) => { delete store[key]; });
global.localStorage.clear.mockImplementation(() => { for (k in store) delete store[k]; });
// ---------------------------------------------

const { MockBackend } = require('./script');

describe('MockBackend', () => {

    /**
     * Setup before each test:
     * 1. Clear the in-memory store to simulate a fresh browser session.
     * 2. Re-initialize the Backend to load seed data.
     */
    beforeEach(() => {
        // Reset store
        for (const key in store) delete store[key];

        // Reset MockBackend state
        MockBackend.init();
    });

    /**
     * Test: Initialization
     * Verifies that the application starts with default courses and users if storage is empty.
     */
    test('initializes with seed data', () => {
        const courses = JSON.parse(localStorage.getItem('app_courses'));
        const users = JSON.parse(localStorage.getItem('app_users_db'));

        expect(courses).toBeDefined();
        expect(courses.length).toBeGreaterThan(0);
        expect(users).toBeDefined();
        expect(users.length).toBeGreaterThan(0);
    });

    /**
     * Test: Authentication (Success)
     * Verifies that a valid user can log in and a session is created.
     */
    test('authenticates valid user', () => {
        const result = MockBackend.login('student', 'password123');
        expect(result.success).toBe(true);
        expect(result.role).toBe('student');

        const session = JSON.parse(localStorage.getItem('app_current_session'));
        expect(session).toBeDefined();
        expect(session.username).toBe('student');
    });

    /**
     * Test: Authentication (Failure)
     * Verifies that invalid credentials are rejected.
     */
    test('rejects invalid credentials', () => {
        const result = MockBackend.login('student', 'wrongpassword');
        expect(result.success).toBe(false);
        expect(localStorage.getItem('app_current_session')).toBeNull();
    });

    /**
     * Test: OAuth User Creation
     * Verifies that a new user account is created correctly from OAuth data (Mocked).
     */
    test('creates new OAuth user', () => {
        const oauthData = {
            email: 'newuser@example.com',
            name: 'New User',
            provider: 'google',
            id: 'google_123',
            picture: 'pic_url'
        };

        const newUser = MockBackend.createOAuthUser(oauthData);

        expect(newUser).toBeDefined();
        expect(newUser.email).toBe(oauthData.email);
        expect(newUser.oauthProvider).toBe('google');

        const users = JSON.parse(localStorage.getItem('app_users_db'));
        const savedUser = users.find(u => u.email === 'newuser@example.com');
        expect(savedUser).toBeDefined();
    });

    /**
     * Test: Progress Tracking
     * Verifies that updating course progress affects the user's record and activity log.
     */
    test('updates course progress', () => {
        // Log in first so we have a current user context
        MockBackend.login('student', 'password123');
        const user = MockBackend.getCurrentUser();

        // Ensure initial state (handling if seed data logic changes)
        if (!user.progress['course_101']) user.progress['course_101'] = 0;

        // Update progress to 50%
        MockBackend.updateProgress('course_101', 50);

        // Verify update in session
        const updatedUser = MockBackend.getCurrentUser();
        expect(updatedUser.progress['course_101']).toBe(50);

        // Verify activity log contains the event
        expect(updatedUser.recentActivity[0].text).toContain('Updated progress');
    });

    /**
     * Test: Course Unlocking
     * Verifies the gamification logic where completing Course 101 unlocks Course 102.
     */
    test('unlocks next course on completion', () => {
        MockBackend.login('student', 'password123');

        // Complete current course (100%)
        MockBackend.updateProgress('course_101', 100);

        // Verify next course is now unlocked
        const courses = MockBackend.getCourses();
        const nextCourse = courses.find(c => c.id === 'course_102');
        expect(nextCourse.locked).toBe(false);
    });
});
