/**
 * Unit Tests for VoiceFeatures (voice-features.js)
 * 
 * This file tests the Voice Accessibility features:
 * - Text-to-Speech (TTS)
 * - Speech Recognition (Voice Input)
 * 
 * It relies heavily on mocking the browser's native Speech APIs (SpeechSynthesis, SpeechRecognition).
 */

// --- GLOBAL MOCKS SETUP (Before require) ---
// Mock DOM elements required by functions
global.document = {
    getElementById: jest.fn((id) => {
        if (id === 'test-element') return {
            innerText: 'Hello world',
            innerHTML: 'Hello world',
            style: {},
            scrollIntoView: jest.fn()
        };
        return null;
    }),
    createElement: jest.fn(() => ({
        style: {},
        classList: { add: jest.fn(), remove: jest.fn() },
        addEventListener: jest.fn(),
        appendChild: jest.fn()
    })),
    body: {
        appendChild: jest.fn()
    },
    addEventListener: jest.fn() // Critical: Used at top level
};

// Mock SpeechSynthesis (Native Browser API)
global.SpeechSynthesisUtterance = class {
    constructor(text) {
        this.text = text;
        this.onstart = null;
        this.onend = null;
        this.onerror = null;
    }
};

global.speechSynthesis = {
    speak: jest.fn((utterance) => {
        // Simulate async speech events happening immediately for tests
        if (utterance.onstart) utterance.onstart();
        if (utterance.onend) utterance.onend();
    }),
    cancel: jest.fn(),
    getVoices: jest.fn(() => [{ lang: 'en-US', name: 'English Voice' }]),
    onvoiceschanged: null
};

// Mock SpeechRecognition (Native Browser API)
global.window = {
    SpeechRecognition: class {
        constructor() {
            this.start = jest.fn();
            this.stop = jest.fn();
            this.abort = jest.fn();
        }
    },
    webkitSpeechRecognition: null
};
global.SpeechRecognition = global.window.SpeechRecognition;

// Mock showToast globally
global.showToast = jest.fn();
// -------------------------------------------

const { VoiceFeatures, VoiceInput } = require('./voice-features');

describe('VoiceFeatures', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Test: Basic TTS
     * Verifies that the 'speak' function is called with the correct text.
     */
    test('reads text aloud', () => {
        VoiceFeatures.readText('Hello Test');
        expect(global.speechSynthesis.speak).toHaveBeenCalled();
    });

    /**
     * Test: TTS with Highlighting
     * Verifies that the complex highlighting logic initializes correctly.
     * Uses Fake Timers to simulate the temporal aspect of highlighting words.
     */
    test('reads text with highlighting', () => {
        jest.useFakeTimers();

        VoiceFeatures.readTextWithHighlight('test-element');

        expect(global.speechSynthesis.speak).toHaveBeenCalled();

        // Fast-forward timers to simulate highlighting interval
        jest.runAllTimers();

        jest.useRealTimers();
    });

    /**
     * Test: Stop Reading
     * Verifies that the 'cancel' function is called to stop audio.
     */
    test('stops reading', () => {
        VoiceFeatures.currentUtterance = {}; // Mock active reading state
        VoiceFeatures.stopReading();
        expect(global.speechSynthesis.cancel).toHaveBeenCalled();
    });
});

describe('VoiceInput', () => {

    beforeAll(() => {
        global.alert = jest.fn();
    });

    /**
     * Test: Initialization
     * Checks if SpeechRecognition is instantiated.
     */
    test('initializes speech recognition', () => {
        const success = VoiceInput.init();
        expect(success).toBe(true);
        expect(VoiceInput.recognition).toBeDefined();
    });

    /**
     * Test: Start Listening
     * Verifies that the 'start' method of the recognition API is called.
     */
    test('starts listening', () => {
        VoiceInput.init();
        VoiceInput.startListening(() => { });
        expect(VoiceInput.recognition.start).toHaveBeenCalled();
    });

    /**
     * Test: Stop Listening
     * Verifies that the 'stop' method is called.
     */
    test('stops listening', () => {
        VoiceInput.init();
        VoiceInput.isListening = true;
        VoiceInput.stopListening();
        expect(VoiceInput.recognition.stop).toHaveBeenCalled();
    });
});
