/**
 * Speech Practice Engine
 * Real-time speech-to-text with accuracy monitoring and feedback
 */

const SpeechPractice = {
    // Practice data
    practiceSentences: [
        // Easy Level
        { id: 1, text: "Hello", difficulty: "easy", category: "Greetings" },
        { id: 2, text: "Good morning", difficulty: "easy", category: "Greetings" },
        { id: 3, text: "Thank you", difficulty: "easy", category: "Greetings" },
        { id: 4, text: "How are you", difficulty: "easy", category: "Greetings" },
        { id: 5, text: "Nice to meet you", difficulty: "easy", category: "Greetings" },

        // Medium Level
        { id: 6, text: "The cat is sleeping on the sofa", difficulty: "medium", category: "Animals" },
        { id: 7, text: "I like to eat apples and bananas", difficulty: "medium", category: "Food" },
        { id: 8, text: "The sun is shining brightly today", difficulty: "medium", category: "Weather" },
        { id: 9, text: "My favorite color is blue", difficulty: "medium", category: "Colors" },
        { id: 10, text: "I can count from one to ten", difficulty: "medium", category: "Numbers" },

        // Hard Level
        { id: 11, text: "The quick brown fox jumps over the lazy dog", difficulty: "hard", category: "Tongue Twisters" },
        { id: 12, text: "She sells seashells by the seashore", difficulty: "hard", category: "Tongue Twisters" },
        { id: 13, text: "Peter Piper picked a peck of pickled peppers", difficulty: "hard", category: "Tongue Twisters" },
        { id: 14, text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood", difficulty: "hard", category: "Tongue Twisters" },
        { id: 15, text: "I scream you scream we all scream for ice cream", difficulty: "hard", category: "Tongue Twisters" },

        // Sentences for practice
        { id: 16, text: "The dog barks loudly", difficulty: "easy", category: "Animals" },
        { id: 17, text: "Red yellow and blue are primary colors", difficulty: "medium", category: "Colors" },
        { id: 18, text: "Five plus five equals ten", difficulty: "medium", category: "Numbers" },
        { id: 19, text: "The elephant has a long trunk", difficulty: "medium", category: "Animals" },
        { id: 20, text: "I love learning new things every day", difficulty: "medium", category: "Learning" }
    ],

    currentSentence: null,
    recognition: null,
    isRecording: false,
    practiceStats: {
        totalAttempts: 0,
        accuracyScores: [],
        perfectScores: 0,
        completedSentences: new Set()
    },

    /**
     * Initialize speech practice
     */
    init() {
        // Load saved stats
        this.loadStats();

        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            showToast('❌ Speech recognition not supported in this browser');
            return false;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;

        this.setupRecognitionListeners();
        this.renderSentenceList();
        this.updateStatsDisplay();

        return true;
    },

    /**
     * Setup speech recognition event listeners
     */
    setupRecognitionListeners() {
        this.recognition.onstart = () => {
            this.isRecording = true;
            const micBtn = document.getElementById('mic-button');
            if (micBtn) {
                micBtn.classList.add('listening');
                micBtn.innerHTML = '🔴';
            }
            showToast('🎤 Listening... Speak now!');
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
            const display = document.getElementById('transcription-display');
            if (display) {
                if (interimTranscript) {
                    display.innerHTML = `<span style="color: var(--text-muted); font-style: italic;">${interimTranscript}</span>`;
                }
                if (finalTranscript) {
                    display.innerHTML = finalTranscript;
                    this.analyzeSpeech(finalTranscript);
                }
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isRecording = false;
            const micBtn = document.getElementById('mic-button');
            if (micBtn) {
                micBtn.classList.remove('listening');
                micBtn.innerHTML = '🎤';
            }

            if (event.error === 'no-speech') {
                showToast('No speech detected. Please try again.');
            } else if (event.error === 'not-allowed') {
                showToast('❌ Microphone access denied. Please enable microphone permissions.');
            } else {
                showToast('❌ Recognition error: ' + event.error);
            }
        };

        this.recognition.onend = () => {
            this.isRecording = false;
            const micBtn = document.getElementById('mic-button');
            if (micBtn) {
                micBtn.classList.remove('listening');
                micBtn.innerHTML = '🎤';
            }
        };
    },

    /**
     * Calculate accuracy between target and spoken text
     */
    calculateAccuracy(target, spoken) {
        // Normalize both strings
        const normalizeText = (text) => {
            return text.toLowerCase()
                .replace(/[^\w\s]/g, '') // Remove punctuation
                .replace(/\s+/g, ' ')     // Normalize spaces
                .trim();
        };

        const targetNorm = normalizeText(target);
        const spokenNorm = normalizeText(spoken);

        const targetWords = targetNorm.split(' ');
        const spokenWords = spokenNorm.split(' ');

        // Calculate word-level accuracy using Levenshtein distance
        let correctWords = 0;
        const wordMatches = [];

        targetWords.forEach((targetWord, index) => {
            const spokenWord = spokenWords[index] || '';
            const similarity = this.calculateSimilarity(targetWord, spokenWord);

            // Consider it correct if similarity is above 80%
            const isCorrect = similarity >= 0.8;
            if (isCorrect) correctWords++;

            wordMatches.push({
                target: targetWord,
                spoken: spokenWord,
                correct: isCorrect,
                similarity: similarity
            });
        });

        // Add missing words
        if (spokenWords.length > targetWords.length) {
            for (let i = targetWords.length; i < spokenWords.length; i++) {
                wordMatches.push({
                    target: '',
                    spoken: spokenWords[i],
                    correct: false,
                    similarity: 0
                });
            }
        }

        const accuracy = Math.round((correctWords / targetWords.length) * 100);

        return {
            accuracy: accuracy,
            wordMatches: wordMatches,
            correctWords: correctWords,
            totalWords: targetWords.length
        };
    },

    /**
     * Calculate similarity between two strings (0 to 1)
     */
    calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;

        if (longer.length === 0) return 1.0;

        const editDistance = this.levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    },

    /**
     * Levenshtein distance algorithm
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    },

    /**
     * Analyze speech and show results
     */
    analyzeSpeech(spokenText) {
        if (!this.currentSentence) return;

        const result = this.calculateAccuracy(this.currentSentence.text, spokenText);

        // Update stats
        this.practiceStats.totalAttempts++;
        this.practiceStats.accuracyScores.push(result.accuracy);
        if (result.accuracy === 100) {
            this.practiceStats.perfectScores++;
            this.practiceStats.completedSentences.add(this.currentSentence.id);
        }
        this.saveStats();

        // Award XP based on accuracy
        const xpEarned = Math.round(result.accuracy / 10);
        if (typeof GamificationEngine !== 'undefined') {
            const user = MockBackend.getCurrentUser();
            if (user) {
                GamificationEngine.awardXP(user, xpEarned, `Speech practice: ${result.accuracy}% accuracy`);
            }
        }

        // Display results
        this.displayResults(result);
        this.updateStatsDisplay();

        // Show celebration for perfect score
        if (result.accuracy === 100) {
            this.showCelebration();
        }
    },

    /**
     * Display analysis results
     */
    displayResults(result) {
        // Show accuracy meter
        const accuracyMeter = document.getElementById('accuracy-meter');
        const accuracyScore = document.getElementById('accuracy-score');
        const accuracyCircle = document.querySelector('.accuracy-circle');

        if (accuracyMeter && accuracyScore && accuracyCircle) {
            accuracyMeter.style.display = 'block';
            accuracyScore.textContent = result.accuracy + '%';

            // Update circular progress
            const degrees = (result.accuracy / 100) * 360;
            accuracyCircle.style.setProperty('--accuracy-deg', degrees + 'deg');
        }

        // Show word comparison
        const comparisonContainer = document.getElementById('word-comparison-container');
        const wordComparison = document.getElementById('word-comparison');

        if (comparisonContainer && wordComparison) {
            comparisonContainer.style.display = 'block';
            wordComparison.innerHTML = '';

            result.wordMatches.forEach(match => {
                const wordEl = document.createElement('div');
                wordEl.className = 'word-match';

                if (match.correct) {
                    wordEl.classList.add('word-correct');
                    wordEl.innerHTML = `✓ ${match.target}`;
                } else if (match.spoken) {
                    wordEl.classList.add('word-incorrect');
                    wordEl.innerHTML = `✗ ${match.spoken}<br><small style="opacity: 0.8;">(expected: ${match.target})</small>`;
                } else {
                    wordEl.classList.add('word-missing');
                    wordEl.innerHTML = `? ${match.target}<br><small style="opacity: 0.8;">(missing)</small>`;
                }

                wordComparison.appendChild(wordEl);
            });
        }

        // Show toast with result
        if (result.accuracy >= 90) {
            showToast(`🎉 Excellent! ${result.accuracy}% accuracy! +${Math.round(result.accuracy / 10)} XP`);
        } else if (result.accuracy >= 70) {
            showToast(`👍 Good job! ${result.accuracy}% accuracy! +${Math.round(result.accuracy / 10)} XP`);
        } else {
            showToast(`💪 Keep practicing! ${result.accuracy}% accuracy. +${Math.round(result.accuracy / 10)} XP`);
        }
    },

    /**
     * Show celebration animation
     */
    showCelebration() {
        // Create confetti effect
        const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    top: -10px;
                    left: ${Math.random() * 100}%;
                    border-radius: 50%;
                    z-index: 9999;
                    animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
                `;
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 4000);
            }, i * 30);
        }

        // Add confetti animation if not exists
        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes confettiFall {
                    to {
                        top: 100vh;
                        transform: translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },

    /**
     * Render sentence list
     */
    renderSentenceList() {
        const listContainer = document.getElementById('sentence-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        this.practiceSentences.forEach(sentence => {
            const isCompleted = this.practiceStats.completedSentences.has(sentence.id);

            const card = document.createElement('div');
            card.className = `sentence-card ${isCompleted ? 'completed' : ''}`;
            card.onclick = () => this.selectSentence(sentence);

            card.innerHTML = `
                <span class="difficulty-badge difficulty-${sentence.difficulty}">${sentence.difficulty.toUpperCase()}</span>
                <h4 style="margin: 10px 0; font-size: 1.1rem;">${sentence.text}</h4>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin: 5px 0;">
                    ${sentence.category}
                </p>
                ${isCompleted ? '<p style="color: #38ef7d; font-weight: 600; margin-top: 10px;">✓ Completed</p>' : ''}
            `;

            listContainer.appendChild(card);
        });
    },

    /**
     * Select a sentence to practice
     */
    selectSentence(sentence) {
        this.currentSentence = sentence;

        // Hide sentence list, show practice area
        document.getElementById('sentence-selection').style.display = 'none';
        document.getElementById('practice-area').style.display = 'block';

        // Set target sentence
        document.getElementById('target-sentence').textContent = sentence.text;

        // Reset displays
        document.getElementById('transcription-display').innerHTML = '<span class="transcription-placeholder">Your speech will appear here...</span>';
        document.getElementById('accuracy-meter').style.display = 'none';
        document.getElementById('word-comparison-container').style.display = 'none';
    },

    /**
     * Update stats display
     */
    updateStatsDisplay() {
        document.getElementById('total-attempts').textContent = this.practiceStats.totalAttempts;

        const avgAccuracy = this.practiceStats.accuracyScores.length > 0
            ? Math.round(this.practiceStats.accuracyScores.reduce((a, b) => a + b, 0) / this.practiceStats.accuracyScores.length)
            : 0;
        document.getElementById('avg-accuracy').textContent = avgAccuracy + '%';

        document.getElementById('perfect-scores').textContent = this.practiceStats.perfectScores;
        document.getElementById('practice-streak').textContent = this.practiceStats.completedSentences.size;
    },

    /**
     * Save stats to localStorage
     */
    saveStats() {
        const stats = {
            ...this.practiceStats,
            completedSentences: Array.from(this.practiceStats.completedSentences)
        };
        localStorage.setItem('speechPracticeStats', JSON.stringify(stats));
    },

    /**
     * Load stats from localStorage
     */
    loadStats() {
        const saved = localStorage.getItem('speechPracticeStats');
        if (saved) {
            const stats = JSON.parse(saved);
            this.practiceStats = {
                ...stats,
                completedSentences: new Set(stats.completedSentences || [])
            };
        }
    }
};

// Global functions for UI interactions
function toggleRecording() {
    if (SpeechPractice.isRecording) {
        SpeechPractice.recognition.stop();
    } else {
        SpeechPractice.recognition.start();
    }
}

function speakTargetSentence() {
    if (SpeechPractice.currentSentence && typeof VoiceFeatures !== 'undefined') {
        VoiceFeatures.readText(SpeechPractice.currentSentence.text, { rate: 0.8 });
    }
}

function tryAgain() {
    // Reset displays
    document.getElementById('transcription-display').innerHTML = '<span class="transcription-placeholder">Your speech will appear here...</span>';
    document.getElementById('accuracy-meter').style.display = 'none';
    document.getElementById('word-comparison-container').style.display = 'none';
    showToast('Ready to try again!');
}

function nextSentence() {
    // Find next sentence
    const currentIndex = SpeechPractice.practiceSentences.findIndex(s => s.id === SpeechPractice.currentSentence.id);
    const nextIndex = (currentIndex + 1) % SpeechPractice.practiceSentences.length;
    SpeechPractice.selectSentence(SpeechPractice.practiceSentences[nextIndex]);
}

function backToList() {
    document.getElementById('practice-area').style.display = 'none';
    document.getElementById('sentence-selection').style.display = 'block';
    SpeechPractice.currentSentence = null;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const user = MockBackend.getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('user-name').textContent = user.name || user.username;

    const initialized = SpeechPractice.init();
    if (!initialized) {
        showToast('❌ Speech recognition not available in this browser. Please use Chrome, Edge, or Safari.');
    }
});
