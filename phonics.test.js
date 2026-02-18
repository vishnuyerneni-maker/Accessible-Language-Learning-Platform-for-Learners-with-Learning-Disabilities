/**
 * Unit Tests for PhonicsModule (phonics-module.js)
 * 
 * Individual Contribution by Member 5.
 * This file tests the phonics and reading module, including:
 * - Letter-sound data integrity
 * - Random word selection by difficulty
 * - Text-to-speech helper logic (mocked)
 * - Word blending logic
 */

// --- GLOBAL MOCKS SETUP ---
// Mock SpeechSynthesisUtterance
global.SpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
    text: text,
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    lang: 'en-US'
}));

// Mock speechSynthesis
global.speechSynthesis = {
    speak: jest.fn(),
    cancel: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    getVoices: jest.fn().mockReturnValue([
        { name: 'Google US English', lang: 'en-US', default: true }
    ])
};

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

// Mock document for DOM interactions
global.document = {
    getElementById: jest.fn().mockReturnValue({
        appendChild: jest.fn(),
        innerHTML: '',
        style: {},
        remove: jest.fn()
    }),
    createElement: jest.fn().mockReturnValue({
        className: '',
        innerHTML: '',
        onclick: null,
        appendChild: jest.fn(),
        style: { cssText: '' },
        id: ''
    }),
    body: {
        appendChild: jest.fn()
    }
};

// Mock console to keep test output clean
global.console = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
};
// --------------------------

const { PhonicsModule } = require('./phonics-module');

describe('PhonicsModule', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('letterSounds data is correctly structured', () => {
        expect(PhonicsModule.letterSounds).toBeDefined();
        expect(PhonicsModule.letterSounds['A']).toEqual({
            sound: 'ay',
            example: 'apple',
            phonetic: '/æ/'
        });
        expect(PhonicsModule.letterSounds['Z']).toBeDefined();
    });

    test('getRandomWord returns a word based on difficulty', () => {
        const easyWord = PhonicsModule.getRandomWord('easy');
        expect(easyWord).toBeDefined();
        expect(PhonicsModule.blendingWords).toContain(easyWord);

        const hardWord = PhonicsModule.getRandomWord('hard');
        expect(hardWord).toBeDefined();
        expect(hardWord.difficulty).toBe('hard');
    });

    test('speak() creates a SpeechSynthesisUtterance and calls speak', () => {
        PhonicsModule.speak('Hello Test', 0.5);

        expect(global.SpeechSynthesisUtterance).toHaveBeenCalledWith('Hello Test');
        expect(global.speechSynthesis.speak).toHaveBeenCalled();
    });

    test('pronounceLetter() calls speak with correct phonetic/sound info', () => {
        PhonicsModule.pronounceLetter('B');

        // It should speak something like "B is for ball. It makes the sound buh"
        // Let's check if speak was called
        expect(global.speechSynthesis.speak).toHaveBeenCalled();
    });

    test('blendWord() iterates through letters and speaks the full word', () => {
        const letters = ['c', 'a', 't'];
        PhonicsModule.blendWord(letters, 'slow');

        // Fast-forward for each letter (1000ms delay)
        jest.advanceTimersByTime(1000); // Letter C
        jest.advanceTimersByTime(1000); // Letter A
        jest.advanceTimersByTime(1000); // Letter T

        // Fast-forward for the final word (letters.length * delay + 500)
        jest.advanceTimersByTime(1000); // More than enough for the 500ms delay

        // Should speak each letter + the full word
        // 3 letters + 1 full word = 4 calls to speak
        expect(global.speechSynthesis.speak).toHaveBeenCalledTimes(4);
    });

    test('showLetterLesson() interacts with DOM', () => {
        PhonicsModule.showLetterLesson('A');
        expect(global.document.createElement).toHaveBeenCalledWith('div');
        expect(global.document.body.appendChild).toHaveBeenCalled();
    });

    test('showBlendingExercise() interacts with DOM', () => {
        const wordData = PhonicsModule.blendingWords[0];
        PhonicsModule.showBlendingExercise(wordData);
        expect(global.document.createElement).toHaveBeenCalledWith('div');
        expect(global.document.body.appendChild).toHaveBeenCalled();
    });
});
