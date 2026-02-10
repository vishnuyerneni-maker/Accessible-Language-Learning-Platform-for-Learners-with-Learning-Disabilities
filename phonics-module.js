/**
 * Phonics & Reading Module
 * - Letter-sound lessons
 * - Word blending exercises
 * - Pronunciation practice
 * - Slow reading mode
 */

const PhonicsModule = {
    
    // Letter sounds data
    letterSounds: {
        'A': { sound: 'ay', example: 'apple', phonetic: '/æ/' },
        'B': { sound: 'buh', example: 'ball', phonetic: '/b/' },
        'C': { sound: 'kuh', example: 'cat', phonetic: '/k/' },
        'D': { sound: 'duh', example: 'dog', phonetic: '/d/' },
        'E': { sound: 'eh', example: 'egg', phonetic: '/ɛ/' },
        'F': { sound: 'fuh', example: 'fish', phonetic: '/f/' },
        'G': { sound: 'guh', example: 'goat', phonetic: '/g/' },
        'H': { sound: 'huh', example: 'hat', phonetic: '/h/' },
        'I': { sound: 'ih', example: 'igloo', phonetic: '/ɪ/' },
        'J': { sound: 'juh', example: 'jump', phonetic: '/dʒ/' },
        'K': { sound: 'kuh', example: 'kite', phonetic: '/k/' },
        'L': { sound: 'luh', example: 'lion', phonetic: '/l/' },
        'M': { sound: 'muh', example: 'moon', phonetic: '/m/' },
        'N': { sound: 'nuh', example: 'nest', phonetic: '/n/' },
        'O': { sound: 'oh', example: 'orange', phonetic: '/ɒ/' },
        'P': { sound: 'puh', example: 'pig', phonetic: '/p/' },
        'Q': { sound: 'kwuh', example: 'queen', phonetic: '/kw/' },
        'R': { sound: 'ruh', example: 'rabbit', phonetic: '/r/' },
        'S': { sound: 'suh', example: 'sun', phonetic: '/s/' },
        'T': { sound: 'tuh', example: 'tree', phonetic: '/t/' },
        'U': { sound: 'uh', example: 'umbrella', phonetic: '/ʌ/' },
        'V': { sound: 'vuh', example: 'van', phonetic: '/v/' },
        'W': { sound: 'wuh', example: 'water', phonetic: '/w/' },
        'X': { sound: 'ks', example: 'box', phonetic: '/ks/' },
        'Y': { sound: 'yuh', example: 'yellow', phonetic: '/j/' },
        'Z': { sound: 'zuh', example: 'zebra', phonetic: '/z/' }
    },
    
    // Word blending exercises
    blendingWords: [
        { letters: ['c', 'a', 't'], word: 'cat', difficulty: 'easy' },
        { letters: ['d', 'o', 'g'], word: 'dog', difficulty: 'easy' },
        { letters: ['s', 'u', 'n'], word: 'sun', difficulty: 'easy' },
        { letters: ['b', 'a', 't'], word: 'bat', difficulty: 'easy' },
        { letters: ['p', 'i', 'g'], word: 'pig', difficulty: 'easy' },
        { letters: ['r', 'a', 't'], word: 'rat', difficulty: 'easy' },
        { letters: ['b', 'e', 'd'], word: 'bed', difficulty: 'easy' },
        { letters: ['c', 'u', 'p'], word: 'cup', difficulty: 'easy' },
        { letters: ['r', 'u', 'n'], word: 'run', difficulty: 'medium' },
        { letters: ['j', 'u', 'm', 'p'], word: 'jump', difficulty: 'medium' },
        { letters: ['s', 't', 'o', 'p'], word: 'stop', difficulty: 'medium' },
        { letters: ['b', 'l', 'u', 'e'], word: 'blue', difficulty: 'medium' },
        { letters: ['g', 'r', 'e', 'e', 'n'], word: 'green', difficulty: 'hard' },
        { letters: ['b', 'r', 'o', 'w', 'n'], word: 'brown', difficulty: 'hard' }
    ],
    
    /**
     * Pronounce a letter with its sound
     */
    pronounceLetter(letter) {
        letter = letter.toUpperCase();
        const data = this.letterSounds[letter];
        
        if (!data) return;
        
        // Speak letter name
        this.speak(`Letter ${letter}`);
        
        setTimeout(() => {
            // Speak sound
            this.speak(`${data.sound} sound`);
        }, 1500);
        
        setTimeout(() => {
            // Speak example word
            this.speak(`${letter} for ${data.example}`);
        }, 3000);
    },
    
    /**
     * Text-to-speech helper
     */
    speak(text, rate = 0.8) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        const voices = speechSynthesis.getVoices();
        const englishVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        if (englishVoice) utterance.voice = englishVoice;
        
        speechSynthesis.speak(utterance);
    },
    
    /**
     * Word blending exercise with slow pronunciation
     */
    blendWord(letters, speed = 'slow') {
        const speeds = {
            'slow': 1000,
            'medium': 600,
            'fast': 300
        };
        
        const delay = speeds[speed] || speeds.slow;
        
        // Pronounce each letter slowly
        letters.forEach((letter, index) => {
            setTimeout(() => {
                const data = this.letterSounds[letter.toUpperCase()];
                if (data) {
                    this.speak(data.sound, 0.7);
                    
                    // Highlight letter if element exists
                    const letterEl = document.getElementById(`blend-letter-${index}`);
                    if (letterEl) {
                        letterEl.style.background = 'var(--primary-gradient)';
                        letterEl.style.color = 'white';
                        letterEl.style.transform = 'scale(1.3)';
                        
                        setTimeout(() => {
                            letterEl.style.background = 'transparent';
                            letterEl.style.color = 'inherit';
                            letterEl.style.transform = 'scale(1)';
                        }, delay - 100);
                    }
                }
            }, index * delay);
        });
        
        // Pronounce complete word
        setTimeout(() => {
            const word = letters.join('');
            this.speak(word, 0.9);
            showToast(`✨ ${word.toUpperCase()}!`);
        }, letters.length * delay + 500);
    },
    
    /**
     * Show letter learning interface
     */
    showLetterLesson(letter) {
        letter = letter.toUpperCase();
        const data = this.letterSounds[letter];
        
        if (!data) return;
        
        const modal = document.createElement('div');
        modal.id = 'phonics-modal';
        modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeIn 0.3s;';
        
        modal.innerHTML = `
            <div class="card" style="max-width: 600px; width: 90%; padding: 50px; text-align: center; animation: scaleIn 0.3s;">
                <button onclick="document.getElementById('phonics-modal').remove()" 
                        style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 2rem; cursor: pointer; color: var(--text-muted);">&times;</button>
                
                <div style="font-size: 8rem; margin-bottom: 30px; background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;">
                    ${letter}
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2 style="margin-bottom: 15px;">Letter ${letter}</h2>
                    <p style="font-size: 1.5rem; color: var(--text-muted); margin-bottom: 10px;">
                        Sound: <strong style="color: var(--primary-color);">${data.sound}</strong>
                    </p>
                    <p style="font-size: 1.2rem; color: var(--text-muted);">
                        Phonetic: ${data.phonetic}
                    </p>
                </div>
                
                <div style="padding: 30px; background: var(--surface-elevated); border-radius: var(--radius-lg); margin-bottom: 30px;">
                    <p style="font-size: 1.3rem; margin-bottom: 15px;">Example Word:</p>
                    <p style="font-size: 2rem; font-weight: bold; color: var(--primary-color);">
                        ${data.example}
                    </p>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="PhonicsModule.pronounceLetter('${letter}')" class="btn btn-primary btn-lg">
                        🔊 Hear Letter Sound
                    </button>
                    <button onclick="PhonicsModule.speak('${data.example}', 0.8)" class="btn btn-secondary btn-lg">
                        🗣️ Hear Example
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    /**
     * Show word blending exercise
     */
    showBlendingExercise(wordData) {
        const modal = document.createElement('div');
        modal.id = 'blending-modal';
        modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeIn 0.3s;';
        
        const lettersHTML = wordData.letters.map((letter, index) => `
            <div id="blend-letter-${index}" style="
                font-size: 4rem; 
                font-weight: bold; 
                padding: 20px 30px; 
                background: var(--surface-elevated); 
                border-radius: var(--radius-lg); 
                margin: 0 10px;
                transition: all 0.3s;
                box-shadow: var(--shadow-md);
            ">${letter.toUpperCase()}</div>
        `).join('');
        
        modal.innerHTML = `
            <div class="card" style="max-width: 800px; width: 90%; padding: 50px; text-align: center; animation: scaleIn 0.3s;">
                <button onclick="document.getElementById('blending-modal').remove()" 
                        style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 2rem; cursor: pointer; color: var(--text-muted);">&times;</button>
                
                <h2 style="margin-bottom: 30px;">🎯 Word Blending Exercise</h2>
                <p style="color: var(--text-muted); margin-bottom: 40px; font-size: 1.2rem;">
                    Listen and blend the sounds together
                </p>
                
                <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 40px;">
                    ${lettersHTML}
                    <div style="font-size: 3rem; margin: 0 20px;">→</div>
                    <div id="result-word" style="
                        font-size: 4rem; 
                        font-weight: bold; 
                        color: var(--primary-color);
                        min-width: 150px;
                    ">?</div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="PhonicsModule.blendWord(${JSON.stringify(wordData.letters)}, 'slow')" class="btn btn-primary btn-lg">
                        🐢 Slow Blend
                    </button>
                    <button onclick="PhonicsModule.blendWord(${JSON.stringify(wordData.letters)}, 'medium')" class="btn btn-secondary btn-lg">
                        🚶 Medium Speed
                    </button>
                    <button onclick="PhonicsModule.blendWord(${JSON.stringify(wordData.letters)}, 'fast')" class="btn btn-ghost btn-lg">
                        🏃 Fast Blend
                    </button>
                </div>
                
                <button onclick="document.getElementById('result-word').textContent = '${wordData.word.toUpperCase()}'; PhonicsModule.speak('${wordData.word}', 1.0)" 
                        class="btn btn-outline" 
                        style="margin-top: 30px; padding: 15px 40px;">
                    👁️ Show Answer
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    /**
     * Get random blending word by difficulty
     */
    getRandomWord(difficulty = 'easy') {
        const words = this.blendingWords.filter(w => w.difficulty === difficulty);
        return words[Math.floor(Math.random() * words.length)];
    }
};

// Initialize speech synthesis voices
if (speechSynthesis) {
    speechSynthesis.onvoiceschanged = () => {
        console.log('Phonics: Voices loaded');
    };
}
