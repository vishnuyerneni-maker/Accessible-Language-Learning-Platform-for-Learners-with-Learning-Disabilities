/**
 * Unit Tests for AuthManager (auth-config.js)
 * 
 * This file tests the high-level authentication flows, including:
 * - Microsoft Login Integration
 * - Google Login Integration
 * - Logout Functionality
 * 
 * It uses extensive mocking to avoid real network calls or browser redirects during testing.
 */

// --- GLOBAL MOCKS SETUP (Before require) ---
// Mock the Backend instance globally so AuthManager can interact with it
const mockBackendInstance = {
    findUserByEmail: jest.fn(),
    createOAuthUser: jest.fn(),
    saveUser: jest.fn(),
    getCurrentUser: jest.fn(),
    logout: jest.fn()
};
global.MockBackend = mockBackendInstance;

// Mock other global browser objects
global.showToast = jest.fn();
global.window = {
    location: { href: '', origin: 'http://localhost' }
};
global.localStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn()
};
global.document = {
    addEventListener: jest.fn(), // Critical for AuthManager initialization
    getElementById: jest.fn()
};
// -------------------------------------------

const { AuthManager } = require('./auth-config');

describe('AuthManager', () => {

    /**
     * Setup before each test:
     * Clear previous mock calls and set up fresh mocks for the external Auth Providers.
     */
    beforeEach(() => {
        jest.clearAllMocks();

        // Mock external Auth provider classes (MicrosoftAuth & GoogleAuth)
        // We simulate successful API responses from them.
        AuthManager.microsoftAuth = {
            login: jest.fn().mockResolvedValue({
                email: 'ms_user@example.com',
                name: 'MS User',
                provider: 'microsoft',
                id: 'ms_123'
            }),
            logout: jest.fn()
        };

        AuthManager.googleAuth = {
            login: jest.fn().mockResolvedValue({
                email: 'google_user@example.com',
                name: 'Google User',
                provider: 'google',
                id: 'g_123'
            }),
            logout: jest.fn()
        };
    });

    /**
     * Test: Microsoft Login Flow
     * 1. Simulates user clicking Microsoft login.
     * 2. Simulates Backend NOT finding the user (New User case).
     * 3. Expects user creation and redirection to dashboard.
     */
    test('handles successful Microsoft login', async () => {
        // Setup Backend to return null (user not found), triggering creation
        mockBackendInstance.findUserByEmail.mockReturnValue(null);
        mockBackendInstance.createOAuthUser.mockReturnValue({
            name: 'MS User',
            role: 'student',
            email: 'ms_user@example.com'
        });

        await AuthManager.loginWithMicrosoft();

        expect(AuthManager.microsoftAuth.login).toHaveBeenCalled();
        expect(mockBackendInstance.createOAuthUser).toHaveBeenCalled();
        expect(mockBackendInstance.saveUser).toHaveBeenCalled();
        expect(window.location.href).toBe('dashboard.html');
    });

    /**
     * Test: Google Login Flow
     * 1. Simulates user clicking Google login.
     * 2. Simulates Backend finding an EXISTING user.
     * 3. Expects update (not creation) and redirection.
     */
    test('handles successful Google login', async () => {
        // Setup Backend to find existing user
        mockBackendInstance.findUserByEmail.mockReturnValue({
            name: 'Google User',
            role: 'student',
            email: 'google_user@example.com'
        });

        await AuthManager.loginWithGoogle();

        expect(AuthManager.googleAuth.login).toHaveBeenCalled();
        expect(mockBackendInstance.createOAuthUser).not.toHaveBeenCalled();
        expect(mockBackendInstance.saveUser).toHaveBeenCalled();
        expect(window.location.href).toBe('dashboard.html');
    });

    /**
     * Test: Logout
     * Verifies that logging out triggers the appropriate provider logout and backend cleanup.
     */
    test('logs out correctly', async () => {
        // Mock current user being logged in with Microsoft
        mockBackendInstance.getCurrentUser.mockReturnValue({
            oauthProvider: 'microsoft'
        });

        await AuthManager.logout();

        expect(AuthManager.microsoftAuth.logout).toHaveBeenCalled();
        expect(mockBackendInstance.logout).toHaveBeenCalled();
        expect(window.location.href).toBe('index.html');
    });
});
