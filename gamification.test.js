/**
 * Unit Tests for Gamification Engine
 * 
 * This file contains test cases to verify the functionality of the gamification system.
 * It uses Jest as the testing framework.
 * 
 * Key features tested:
 * - User initialization
 * - XP awarding and level calculations
 * - Badge unlocking logic
 * - Daily streak tracking (using time mocking)
 * - DOM interaction mocking
 */

const { GamificationEngine, GAMIFICATION_CONFIG } = require('./gamification');

describe('GamificationEngine', () => {
    let mockUser;

    /**
     * Setup: Mocking the DOM Environment
     * Since gamification.js interacts with the browser DOM (e.g., creating elements for animations),
     * we must mock 'document' and 'window' so tests can run in Node.js without crashing.
     */
    beforeAll(() => {
        // Mock DOM for non-browser environments
        if (typeof document === 'undefined') {
            global.document = {
                createElement: () => ({
                    style: {},
                    animate: () => ({ onfinish: () => { } }),
                    remove: () => { }
                }),
                body: {
                    appendChild: () => { }
                }
            };
            global.window = {
                innerHeight: 800
            };
        }
    });

    /**
     * Setup: Reset User State
     * Before each test, we create a fresh mock user to ensure tests don't affect each other.
     */
    beforeEach(() => {
        mockUser = {
            id: 'user123',
            name: 'Test User'
        };
    });

    /**
     * Test Case 1: Initialization
     * Verifies that a new user starts with 0 XP, Level 1, and no badges.
     */
    test('initializes user with default gamification data', () => {
        const user = GamificationEngine.initializeUser({ ...mockUser });
        expect(user.gamification).toBeDefined();
        expect(user.gamification.xp).toBe(0);
        expect(user.gamification.level).toBe(1);
        expect(user.gamification.badges).toEqual([]);
    });

    /**
     * Test Case 2: XP Awarding
     * Verifies that the system correctly adds XP and logs the activity.
     */
    test('awards XP and updates user data', () => {
        let user = GamificationEngine.initializeUser({ ...mockUser });
        const result = GamificationEngine.awardXP(user, 50, 'Test Action');

        expect(user.gamification.xp).toBe(50);
        expect(result.newXP).toBe(50);
        expect(user.recentActivity[0].text).toContain('+50 XP');
    });

    /**
     * Test Case 3: Level Calculation
     * Verifies that the valid XP thresholds correctly translate to levels.
     * Level 1: 0-99 XP
     * Level 2: 100-299 XP
     * Level 3: 300+ XP
     */
    test('calculates levels correctly', () => {
        // Level 1: 0 XP
        expect(GamificationEngine.calculateLevel(0)).toBe(1);
        // Level 2: 100 XP
        expect(GamificationEngine.calculateLevel(100)).toBe(2);
        expect(GamificationEngine.calculateLevel(150)).toBe(2);
        // Level 3: 300 XP
        expect(GamificationEngine.calculateLevel(300)).toBe(3);
    });

    /**
     * Test Case 4: Level Up Event
     * Verifies that crossing a level threshold triggers a level-up event/message.
     */
    test('handles level up correctly', () => {
        let user = GamificationEngine.initializeUser({ ...mockUser });
        // Award enough XP to level up from 1 to 2 (needs 100 XP)
        const result = GamificationEngine.awardXP(user, 100, 'Big XP Boost');

        expect(result.leveledUp).toBe(true);
        expect(result.newLevel).toBe(2);
        expect(user.gamification.level).toBe(2);

        // Check if any recent activity contains the level up message
        const hasLevelUpMessage = user.recentActivity.some(a => a.text.includes('Level Up!'));
        expect(hasLevelUpMessage).toBe(true);
    });

    /**
     * Test Case 5: Streak Tracking
     * Verifies daily login streaks.
     * 
     * Technical Note: 
     * We use `jest.useFakeTimers()` to manipulate the system time. 
     * This allows us to simulate logging in on Monday, then Tuesday (streak +1), 
     * or skipping a day (streak reset) instantly.
     */
    test('updates streak correctly', () => {
        let user = GamificationEngine.initializeUser({ ...mockUser });

        jest.useFakeTimers();

        // 1. Simulate First Login on Jan 1st
        jest.setSystemTime(new Date('2024-01-01T12:00:00Z'));
        GamificationEngine.updateStreak(user);
        expect(user.gamification.currentStreak).toBe(1);

        // 2. Simulate Next Day Login on Jan 2nd (Streak should increase)
        jest.setSystemTime(new Date('2024-01-02T12:00:00Z'));
        GamificationEngine.updateStreak(user);
        expect(user.gamification.currentStreak).toBe(2);

        // 3. Simulate Skipping a Day -> Jan 4th (Streak should break/reset)
        jest.setSystemTime(new Date('2024-01-04T12:00:00Z'));
        GamificationEngine.updateStreak(user);
        expect(user.gamification.currentStreak).toBe(1);

        jest.useRealTimers();
    });

    /**
     * Test Case 6: Badge Awarding
     * Verifies that a user earns a badge when the specific condition is met.
     */
    test('awards badges when conditions are met', () => {
        let user = GamificationEngine.initializeUser({ ...mockUser });

        // Simulate condition for 'first_lesson': lessonsCompleted >= 1
        user.gamification.lessonsCompleted = 1;

        const newBadges = GamificationEngine.checkBadges(user);

        expect(newBadges.length).toBe(1);
        expect(newBadges[0].id).toBe('first_lesson');
        expect(user.gamification.badges).toContain('first_lesson');
    });

    /**
     * Test Case 7: Duplicate Badge Prevention
     * Verifies that the system doesn't award the same badge twice.
     */
    test('does not award duplicate badges', () => {
        let user = GamificationEngine.initializeUser({ ...mockUser });
        user.gamification.lessonsCompleted = 1;
        // Pre-assign the badge
        user.gamification.badges = ['first_lesson'];

        const newBadges = GamificationEngine.checkBadges(user);

        expect(newBadges.length).toBe(0);
    });
});
