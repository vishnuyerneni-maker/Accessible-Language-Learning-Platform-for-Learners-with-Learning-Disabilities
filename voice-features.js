/**
 * Enhanced Voice Features
 * - Text-to-Speech with word-by-word highlighting
 * - Microphone voice input (Speech Recognition)
 * - Voice commands
 */

// ============================================
// TEXT-TO-SPEECH WITH HIGHLIGHTING
// ============================================
const VoiceFeatures = {
    
    currentUtterance: null,
    isReading: false,
    
    /**
     * Read text aloud with word-by-word highlighting
     */
    readTextWithHighlight(elementId, options = {}) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            return;
        }

        // Stop any current speech
        this.stopReading();

        const text = element.innerText || element.textContent;
        const words = text.split(/\s+/);
        
        // Store original HTML
        const originalHTML = element.innerHTML;
        
        // Wrap each word in a span
        element.innerHTML = words.map((word, index) => 
            `<span id="word-${index}" class="tts-word" style="transition: all 0.3s;">${word}</span>`
        ).join(' ');

        // Configure speech synthesis
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.rate = options.rate || 0.9;
        this.currentUtterance.pitch = options.pitch || 1.0;
        this.currentUtterance.volume = options.volume || 1.0;

        // Get available voices
        const voices = speechSynthesis.getVoices();
        const englishVoice = voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        if (englishVoice) {
            this.currentUtterance.voice = englishVoice;
        }

        let currentWordIndex = 0;
        const wordDuration = (60 / (this.currentUtterance.rate * 150)) * 1000; // Approximate duration per word

        // Highlight words as they're spoken
        const highlightInterval = setInterval(() => {
            if (currentWordIndex >= words.length || !this.isReading) {
                clearInterval(highlightInterval);
                // Restore original HTML after reading
                setTimeout(() => {
                    element.innerHTML = originalHTML;
                }, 500);
                return;
            }

            // Remove highlight from previous word
            if (currentWordIndex > 0) {
                const prevWord = document.getElementById(`word-${currentWordIndex - 1}`);
                if (prevWord) {
                    prevWord.style.background = 'transparent';
                    prevWord.style.color = 'inherit';
                    prevWord.style.transform = 'scale(1)';
                }
            }

            // Highlight current word
            const currentWord = document.getElementById(`word-${currentWordIndex}`);
            if (currentWord) {
                currentWord.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                currentWord.style.color = 'white';
                currentWord.style.padding = '2px 6px';
                currentWord.style.borderRadius = '4px';
                currentWord.style.transform = 'scale(1.1)';
                currentWord.style.fontWeight = 'bold';
                
                // Scroll into view if needed
                currentWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            currentWordIndex++;
        }, wordDuration);

        // Speech events
        this.currentUtterance.onstart = () => {
            this.isReading = true;
            showToast('🔊 Reading aloud...');
            
            // Show stop button
            const stopBtn = document.createElement('button');
            stopBtn.id = 'stop-reading-btn';
            stopBtn.className = 'btn btn-secondary';
            stopBtn.innerHTML = '⏹️ Stop Reading';
            stopBtn.style.cssText = 'position: fixed; bottom: 30px; right: 30px; z-index: 1000; animation: slideInRight 0.3s;';
            stopBtn.onclick = () => this.stopReading();
            document.body.appendChild(stopBtn);
        };

        this.currentUtterance.onend = () => {
            this.isReading = false;
            clearInterval(highlightInterval);
            element.innerHTML = originalHTML;
            
            const stopBtn = document.getElementById('stop-reading-btn');
            if (stopBtn) stopBtn.remove();
            
            showToast('✅ Finished reading');
        };

        this.currentUtterance.onerror = (event) => {
            console.error('Speech error:', event);
            this.isReading = false;
            clearInterval(highlightInterval);
            element.innerHTML = originalHTML;
            showToast('❌ Speech error occurred');
        };

        // Start speaking
        speechSynthesis.speak(this.currentUtterance);
    },

    /**
     * Stop reading
     */
    stopReading() {
        if (this.currentUtterance) {
            speechSynthesis.cancel();
            this.isReading = false;
            
            const stopBtn = document.getElementById('stop-reading-btn');
            if (stopBtn) stopBtn.remove();
        }
    },

    /**
     * Simple read text (without highlighting)
     */
    readText(text, options = {}) {
        this.stopReading();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate || 1.0;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        const voices = speechSynthesis.getVoices();
        const englishVoice = voices.find(voice => voice.lang.startsWith('en')) || voices[0];
        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        speechSynthesis.speak(utterance);
    }
};

// ============================================
// MICROPHONE / SPEECH RECOGNITION
// ============================================
const VoiceInput = {
    
    recognition: null,
    isListening: false,
    
    /**
     * Initialize speech recognition
     */
    init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported in this browser');
            return false;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.setupListeners();
        return true;
    },

    /**
     * Setup recognition event listeners
     */
    setupListeners() {
        this.recognition.onstart = () => {
            this.isListening = true;
            showToast('🎤 Listening...');
            
            // Show listening indicator
            const indicator = document.createElement('div');
            indicator.id = 'voice-indicator';
            indicator.innerHTML = `
                <div style="position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: var(--primary-gradient); color: white; padding: 15px 30px; border-radius: 50px; box-shadow: var(--shadow-xl); z-index: 1000; animation: pulse 1.5s infinite;">
                    <span style="font-size: 1.5rem; animation: pulse 1s infinite;">🎤</span>
                    <span style="margin-left: 10px; font-weight: 600;">Listening...</span>
                </div>
            `;
            document.body.appendChild(indicator);
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // Display interim results
            if (interimTranscript) {
                this.updateTranscriptDisplay(interimTranscript, false);
            }

            // Process final results
            if (finalTranscript) {
                this.updateTranscriptDisplay(finalTranscript, true);
                this.processVoiceCommand(finalTranscript);
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            
            const indicator = document.getElementById('voice-indicator');
            if (indicator) indicator.remove();
            
            if (event.error === 'no-speech') {
                showToast('No speech detected. Try again.');
            } else {
                showToast('❌ Voice recognition error');
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            
            const indicator = document.getElementById('voice-indicator');
            if (indicator) indicator.remove();
        };
    },

    /**
     * Start listening
     */
    startListening(callback) {
        if (!this.recognition) {
            const initialized = this.init();
            if (!initialized) {
                alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
                return;
            }
        }

        if (this.isListening) {
            this.stopListening();
            return;
        }

        this.onTranscriptCallback = callback;
        this.recognition.start();
    },

    /**
     * Stop listening
     */
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    },

    /**
     * Update transcript display
     */
    updateTranscriptDisplay(transcript, isFinal) {
        const targetInput = document.getElementById('voice-input-target');
        if (targetInput) {
            if (isFinal) {
                targetInput.value = transcript;
                targetInput.dispatchEvent(new Event('input', { bubbles: true }));
            } else {
                // Show interim results with different styling
                targetInput.placeholder = transcript;
            }
        }

        if (this.onTranscriptCallback) {
            this.onTranscriptCallback(transcript, isFinal);
        }
    },

    /**
     * Process voice commands
     */
    processVoiceCommand(command) {
        const lowerCommand = command.toLowerCase();

        // Navigation commands
        if (lowerCommand.includes('go to dashboard') || lowerCommand.includes('open dashboard')) {
            window.location.href = 'dashboard.html';
        } else if (lowerCommand.includes('go to profile') || lowerCommand.includes('open profile')) {
            window.location.href = 'profile.html';
        } else if (lowerCommand.includes('log out') || lowerCommand.includes('logout')) {
            MockBackend.logout();
            window.location.href = 'index.html';
        }
        // Theme commands
        else if (lowerCommand.includes('dark mode') || lowerCommand.includes('dark theme')) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('siteTheme', 'dark');
            showToast('🌙 Dark mode enabled');
        } else if (lowerCommand.includes('light mode') || lowerCommand.includes('light theme')) {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('siteTheme', 'light');
            showToast('☀️ Light mode enabled');
        }
        // Reading commands
        else if (lowerCommand.includes('read this') || lowerCommand.includes('read aloud')) {
            const mainContent = document.querySelector('main') || document.body;
            VoiceFeatures.readTextWithHighlight(mainContent.id || 'main-content');
        } else if (lowerCommand.includes('stop reading')) {
            VoiceFeatures.stopReading();
        }
    },

    /**
     * Add voice input button to element
     */
    addVoiceButton(inputElementId) {
        const inputElement = document.getElementById(inputElementId);
        if (!inputElement) return;

        // Create voice button
        const voiceBtn = document.createElement('button');
        voiceBtn.type = 'button';
        voiceBtn.className = 'btn btn-ghost';
        voiceBtn.innerHTML = '🎤';
        voiceBtn.title = 'Voice input';
        voiceBtn.style.cssText = 'position: absolute; right: 10px; top: 50%; transform: translateY(-50%); padding: 8px 12px;';
        
        voiceBtn.onclick = () => {
            // Set target for voice input
            inputElement.id = inputElement.id || 'voice-input-target';
            this.startListening((transcript, isFinal) => {
                if (isFinal) {
                    inputElement.value = transcript;
                }
            });
        };

        // Make input container relative
        const container = inputElement.parentElement;
        if (container) {
            container.style.position = 'relative';
            container.appendChild(voiceBtn);
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize voice input
    VoiceInput.init();
    
    // Load voices (they may not be available immediately)
    if (speechSynthesis) {
        speechSynthesis.onvoiceschanged = () => {
            console.log('Voices loaded:', speechSynthesis.getVoices().length);
        };
    }
});
