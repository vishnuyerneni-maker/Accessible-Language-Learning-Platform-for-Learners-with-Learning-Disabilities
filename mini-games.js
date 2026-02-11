/**
 * Mini-Games & Spelling Support Module
 * - Picture-Word Matching
 * - Memory Card Game
 * - Word Scramble
 * - Spelling Hints & Word Banks
 */

const MiniGames = {
    
    // Picture-word pairs database
    pictureWords: [
        { word: 'CAT', emoji: '🐱', hint: 'A furry pet that says meow' },
        { word: 'DOG', emoji: '🐕', hint: 'A loyal pet that barks' },
        { word: 'SUN', emoji: '☀️', hint: 'Bright and warm in the sky' },
        { word: 'MOON', emoji: '🌙', hint: 'Shines at night' },
        { word: 'TREE', emoji: '🌳', hint: 'Tall with leaves and branches' },
        { word: 'HOUSE', emoji: '🏠', hint: 'Where we live' },
        { word: 'CAR', emoji: '🚗', hint: 'Vehicle with four wheels' },
        { word: 'APPLE', emoji: '🍎', hint: 'Red or green fruit' },
        { word: 'BOOK', emoji: '📚', hint: 'You read this' },
        { word: 'HEART', emoji: '❤️', hint: 'Symbol of love' },
        { word: 'STAR', emoji: '⭐', hint: 'Twinkles in the night sky' },
        { word: 'FLOWER', emoji: '🌸', hint: 'Pretty plant that blooms' }
    ],
    
    /**
     * Picture-Word Matching Game
     */
    showPictureMatching() {
        // Select 6 random pairs
        const selected = this.pictureWords.sort(() => Math.random() - 0.5).slice(0, 6);
        const items = [...selected.map(p => ({type: 'emoji', value: p.emoji, word: p.word})),
                       ...selected.map(p => ({type: 'word', value: p.word, word: p.word}))];
        items.sort(() => Math.random() - 0.5);
        
        let selectedCards = [];
        let matchedPairs = 0;
        
        const modal = document.createElement('div');
        modal.id = 'picture-matching-modal';
        modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeIn 0.3s; padding: 20px;';
        
        const cards = items.map((item, index) => `
            <div class="match-card" data-index="${index}" data-word="${item.word}" data-type="${item.type}"
                 style="
                    width: 140px;
                    height: 140px;
                    background: var(--primary-gradient);
                    border-radius: var(--radius-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: ${item.type === 'emoji' ? '3.5rem' : '1.5rem'};
                    font-weight: bold;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: var(--shadow-lg);
                    user-select: none;
                 ">
                ${item.value}
            </div>
        `).join('');
        
        modal.innerHTML = `
            <div class="card" style="max-width: 900px; width: 90%; padding: 50px; text-align: center; animation: scaleIn 0.3s;">
                <button onclick="document.getElementById('picture-matching-modal').remove()" 
                        style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 2rem; cursor: pointer; color: var(--text-muted);">&times;</button>
                
                <h2 style="margin-bottom: 10px;">🎯 Match Pictures with Words</h2>
                <p style="color: var(--text-muted); margin-bottom: 30px;">Click on a picture and then its matching word</p>
                <div id="match-score" style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color); margin-bottom: 20px;">
                    Matches: 0 / 6
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; max-width: 700px; margin: 0 auto;">
                    ${cards}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup click handlers
        setTimeout(() => {
            const cardElements = document.querySelectorAll('.match-card');
            
            cardElements.forEach(card => {
                card.addEventListener('click', () => {
                    if (card.classList.contains('matched')) return;
                    
                    // Toggle selection
                    if (card.classList.contains('selected')) {
                        card.classList.remove('selected');
                        card.style.transform = 'scale(1)';
                        card.style.border = 'none';
                        selectedCards = selectedCards.filter(c => c !== card);
                        return;
                    }
                    
                    card.classList.add('selected');
                    card.style.transform = 'scale(1.1)';
                    card.style.border = '4px solid white';
                    selectedCards.push(card);
                    
                    // Check if two cards are selected
                    if (selectedCards.length === 2) {
                        const [card1, card2] = selectedCards;
                        
                        if (card1.dataset.word === card2.dataset.word) {
                            // Match!
                            matchedPairs++;
                            card1.classList.add('matched');
                            card2.classList.add('matched');
                            card1.style.opacity = '0.3';
                            card2.style.opacity = '0.3';
                            card1.style.border = '4px solid var(--success-color)';
                            card2.style.border = '4px solid var(--success-color)';
                            
                            document.getElementById('match-score').textContent = `Matches: ${matchedPairs} / 6`;
                            showToast('✓ Match!');
                            
                            if (typeof PhonicsModule !== 'undefined') {
                                PhonicsModule.speak(card1.dataset.word, 1.0);
                            }
                            
                            if (matchedPairs === 6) {
                                setTimeout(() => {
                                    showCelebration('All Matched!');
                                    showToast('🎉 Perfect! You matched all pairs!');
                                }, 500);
                            }
                        } else {
                            // No match
                            showToast('✗ Try again');
                            setTimeout(() => {
                                card1.classList.remove('selected');
                                card2.classList.remove('selected');
                                card1.style.transform = 'scale(1)';
                                card2.style.transform = 'scale(1)';
                                card1.style.border = 'none';
                                card2.style.border = 'none';
                            }, 1000);
                        }
                        
                        selectedCards = [];
                    }
                });
            });
        }, 100);
    },
    
    /**
     * Memory Card Game
     */
    showMemoryGame() {
        const words = ['CAT', 'DOG', 'SUN', 'MOON', 'STAR', 'BOOK'];
        const cards = [...words, ...words].sort(() => Math.random() - 0.5);
        
        let flippedCards = [];
        let matchedPairs = 0;
        
        const modal = document.createElement('div');
        modal.id = 'memory-game-modal';
        modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeIn 0.3s; padding: 20px;';
        
        const cardElements = cards.map((word, index) => `
            <div class="memory-card" data-index="${index}" data-word="${word}"
                 style="
                    width: 120px;
                    height: 120px;
                    background: var(--primary-gradient);
                    border-radius: var(--radius-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: var(--shadow-lg);
                    position: relative;
                    transform-style: preserve-3d;
                 ">
                <div class="card-back" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 3rem; backface-visibility: hidden;">
                    ?
                </div>
                <div class="card-front" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; backface-visibility: hidden; transform: rotateY(180deg);">
                    ${word}
                </div>
            </div>
        `).join('');
        
        modal.innerHTML = `
            <div class="card" style="max-width: 800px; width: 90%; padding: 50px; text-align: center; animation: scaleIn 0.3s;">
                <button onclick="document.getElementById('memory-game-modal').remove()" 
                        style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 2rem; cursor: pointer; color: var(--text-muted);">&times;</button>
                
                <h2 style="margin-bottom: 10px;">🧠 Memory Match</h2>
                <p style="color: var(--text-muted); margin-bottom: 30px;">Find matching pairs of words</p>
                <div id="memory-score" style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color); margin-bottom: 20px;">
                    Pairs: 0 / 6
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; max-width: 600px; margin: 0 auto;">
                    ${cardElements}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup game logic
        setTimeout(() => {
            const cardEls = document.querySelectorAll('.memory-card');
            
            cardEls.forEach(card => {
                card.addEventListener('click', () => {
                    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
                    if (flippedCards.length >= 2) return;
                    
                    // Flip card
                    card.style.transform = 'rotateY(180deg)';
                    card.classList.add('flipped');
                    flippedCards.push(card);
                    
                    if (flippedCards.length === 2) {
                        const [card1, card2] = flippedCards;
                        
                        if (card1.dataset.word === card2.dataset.word) {
                            // Match!
                            matchedPairs++;
                            card1.classList.add('matched');
                            card2.classList.add('matched');
                            card1.style.opacity = '0.5';
                            card2.style.opacity = '0.5';
                            
                            document.getElementById('memory-score').textContent = `Pairs: ${matchedPairs} / 6`;
                            showToast('✓ Match!');
                            
                            if (matchedPairs === 6) {
                                setTimeout(() => {
                                    showCelebration('Memory Master!');
                                }, 500);
                            }
                            
                            flippedCards = [];
                        } else {
                            // No match
                            setTimeout(() => {
                                card1.style.transform = 'rotateY(0deg)';
                                card2.style.transform = 'rotateY(0deg)';
                                card1.classList.remove('flipped');
                                card2.classList.remove('flipped');
                                flippedCards = [];
                            }, 1000);
                        }
                    }
                });
            });
        }, 100);
    }
};

/**
 * Spelling Support Module
 */
const SpellingSupport = {
    
    // Word banks by category
    wordBanks: {
        animals: ['cat', 'dog', 'bird', 'fish', 'lion', 'tiger', 'bear'],
        colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'],
        food: ['apple', 'pizza', 'bread', 'milk', 'egg', 'rice', 'cake'],
        family: ['mom', 'dad', 'sister', 'brother', 'baby', 'grandma', 'grandpa'],
        actions: ['run', 'jump', 'walk', 'read', 'write', 'play', 'sing']
    },
    
    /**
     * Show spelling practice with hints
     */
    showSpellingPractice(word, category = 'animals') {
        const hints = this.generateHints(word);
        const wordBank = this.wordBanks[category] || this.wordBanks.animals;
        
        const modal = document.createElement('div');
        modal.id = 'spelling-modal';
        modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeIn 0.3s;';
        
        const wordBankHTML = wordBank.map(w => `
            <span onclick="SpellingSupport.insertWord('${w}')" 
                  style="
                    background: var(--primary-gradient);
                    color: white;
                    padding: 8px 16px;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: all 0.2s;
                    display: inline-block;
                    margin: 5px;
                  "
                  onmouseover="this.style.transform='scale(1.1)'"
                  onmouseout="this.style.transform='scale(1)'">
                ${w}
            </span>
        `).join('');
        
        modal.innerHTML = `
            <div class="card" style="max-width: 700px; width: 90%; padding: 50px; text-align: center; animation: scaleIn 0.3s;">
                <button onclick="document.getElementById('spelling-modal').remove()" 
                        style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 2rem; cursor: pointer; color: var(--text-muted);">&times;</button>
                
                <h2 style="margin-bottom: 20px;">✏️ Spelling Practice</h2>
                <p style="color: var(--text-muted); margin-bottom: 30px;">Spell the word: <strong style="color: var(--primary-color); font-size: 1.5rem;">${word.toUpperCase()}</strong></p>
                
                <div style="margin-bottom: 30px;">
                    <input type="text" id="spelling-input" placeholder="Type your answer..." 
                           style="
                                font-size: 2rem;
                                padding: 20px;
                                border: 3px solid var(--primary-color);
                                border-radius: var(--radius-lg);
                                width: 100%;
                                max-width: 400px;
                                text-align: center;
                                text-transform: uppercase;
                                font-weight: bold;
                                background: var(--surface-elevated);
                                color: var(--text-main);
                           ">
                </div>
                
                <div id="hint-container" style="margin-bottom: 30px; min-height: 60px;">
                    <button onclick="SpellingSupport.showHint('${word}')" class="btn btn-secondary">
                        💡 Show Hint
                    </button>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <p style="color: var(--text-muted); margin-bottom: 15px; font-weight: bold;">Word Bank (${category}):</p>
                    <div style="display: flex; flex-wrap: wrap; justify-content: center;">
                        ${wordBankHTML}
                    </div>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="SpellingSupport.checkSpelling('${word}')" class="btn btn-primary btn-lg">
                        ✓ Check Spelling
                    </button>
                    <button onclick="if(typeof PhonicsModule !== 'undefined') PhonicsModule.speak('${word}', 0.8)" class="btn btn-secondary">
                        🔊 Hear Word
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    /**
     * Generate hints for a word
     */
    generateHints(word) {
        return {
            firstLetter: `Starts with: ${word[0].toUpperCase()}`,
            lastLetter: `Ends with: ${word[word.length - 1].toUpperCase()}`,
            length: `${word.length} letters long`,
            pattern: word.split('').map((l, i) => i === 0 || i === word.length - 1 ? l.toUpperCase() : '_').join(' ')
        };
    },
    
    /**
     * Show spelling hint
     */
    showHint(word) {
        const hints = this.generateHints(word);
        const hintContainer = document.getElementById('hint-container');
        
        hintContainer.innerHTML = `
            <div style="background: var(--primary-gradient); color: white; padding: 20px; border-radius: var(--radius-lg); animation: slideIn 0.3s;">
                <p style="font-size: 1.3rem; margin-bottom: 10px;">💡 ${hints.firstLetter}</p>
                <p style="font-size: 1.5rem; font-weight: bold; letter-spacing: 5px;">${hints.pattern}</p>
                <p style="font-size: 1.1rem; margin-top: 10px;">${hints.length}</p>
            </div>
        `;
    },
    
    /**
     * Insert word from word bank
     */
    insertWord(word) {
        const input = document.getElementById('spelling-input');
        if (input) {
            input.value = word.toUpperCase();
            input.focus();
        }
    },
    
    /**
     * Check spelling
     */
    checkSpelling(correctWord) {
        const input = document.getElementById('spelling-input');
        const userAnswer = input.value.trim().toUpperCase();
        
        if (userAnswer === correctWord.toUpperCase()) {
            showCelebration('Correct!');
            showToast('🎉 Perfect spelling!');
            if (typeof PhonicsModule !== 'undefined') {
                PhonicsModule.speak(`Excellent! ${correctWord}`, 1.0);
            }
            setTimeout(() => {
                document.getElementById('spelling-modal').remove();
            }, 2000);
        } else {
            showToast('❌ Try again!');
            input.style.borderColor = 'var(--error-color)';
            input.style.animation = 'shake 0.5s';
            setTimeout(() => {
                input.style.borderColor = 'var(--primary-color)';
                input.style.animation = '';
            }, 500);
        }
    }
};
