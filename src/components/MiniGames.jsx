import React, { useState, useEffect } from 'react';
import { VoiceFeatures } from '../utils/voice';
import '../styles/style-kids.css'; // Ensure styles are available

// === DATA ===
const PICTURE_WORDS = [
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
];

const WORD_BANKS = {
    animals: ['cat', 'dog', 'bird', 'fish', 'lion', 'tiger', 'bear'],
    colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'],
    food: ['apple', 'pizza', 'bread', 'milk', 'egg', 'rice', 'cake'],
    family: ['mom', 'dad', 'sister', 'brother', 'baby', 'grandma', 'grandpa'],
    actions: ['run', 'jump', 'walk', 'read', 'write', 'play', 'sing']
};

// === COMPONENT: PICTURE MATCHING ===
export const PictureMatchingGame = ({ onClose, onComplete }) => {
    const [cards, setCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Initialize Game
        const selected = PICTURE_WORDS.sort(() => Math.random() - 0.5).slice(0, 6);
        const items = [
            ...selected.map(p => ({ id: p.word + '-emoji', type: 'emoji', value: p.emoji, word: p.word, isMatched: false })),
            ...selected.map(p => ({ id: p.word + '-text', type: 'word', value: p.word, word: p.word, isMatched: false }))
        ];
        setCards(items.sort(() => Math.random() - 0.5));
    }, []);

    const handleCardClick = (card) => {
        if (card.isMatched || selectedCards.find(c => c.id === card.id)) return;

        const newSelected = [...selectedCards, card];
        setSelectedCards(newSelected);

        if (newSelected.length === 2) {
            const [first, second] = newSelected;
            if (first.word === second.word) {
                // Match!
                setCards(prev => prev.map(c =>
                    (c.id === first.id || c.id === second.id) ? { ...c, isMatched: true } : c
                ));
                setMatchedPairs(prev => prev + 1);
                setMessage('🎉 Match!');
                setTimeout(() => setMessage(''), 1000);
            } else {
                // No Match
                setMessage('❌ Try Again');
                setTimeout(() => setMessage(''), 1000);
            }
            setTimeout(() => setSelectedCards([]), 1000);
        }
    };

    useEffect(() => {
        if (matchedPairs === 6) {
            setTimeout(() => {
                onComplete && onComplete();
            }, 1000);
        }
    }, [matchedPairs, onComplete]);

    return (
        <div className="game-overlay animate-fade-in">
            <div className="card game-modal" style={{ maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>🎯 Picture Match</h2>
                    <button onClick={onClose} className="btn-icon">✖️</button>
                </div>

                <div style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-purple)' }}>
                    Matches: {matchedPairs} / 6 {message && <span style={{ marginLeft: '20px' }}>{message}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' }}>
                    {cards.map(card => {
                        const isSelected = selectedCards.find(c => c.id === card.id);
                        return (
                            <div
                                key={card.id}
                                onClick={() => handleCardClick(card)}
                                style={{
                                    height: '120px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: card.type === 'emoji' ? '3rem' : '1.2rem',
                                    fontWeight: 'bold',
                                    background: card.isMatched ? 'var(--success-color)' : (isSelected ? 'var(--primary-orange)' : 'var(--primary-gradient)'),
                                    color: 'white',
                                    borderRadius: 'var(--radius-lg)',
                                    cursor: 'pointer',
                                    opacity: card.isMatched ? 0.5 : 1,
                                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                    marginBottom: 0, // Fix margin issue
                                    transition: 'all 0.3s'
                                }}
                            >
                                {card.value}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// === COMPONENT: MEMORY GAME ===
export const MemoryGame = ({ onClose, onComplete }) => {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState(0);

    useEffect(() => {
        const words = ['CAT', 'DOG', 'SUN', 'MOON', 'STAR', 'BOOK'];
        const items = [...words, ...words]
            .sort(() => Math.random() - 0.5)
            .map((word, index) => ({ id: index, word, isFlipped: false, isMatched: false }));
        setCards(items);
    }, []);

    const handleCardClick = (index) => {
        if (flippedCards.length >= 2 || cards[index].isFlipped || cards[index].isMatched) return;

        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedCards, index];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            const [firstIndex, secondIndex] = newFlipped;
            if (newCards[firstIndex].word === newCards[secondIndex].word) {
                // Match
                newCards[firstIndex].isMatched = true;
                newCards[secondIndex].isMatched = true;
                setCards(newCards);
                setMatchedPairs(prev => prev + 1);
                setFlippedCards([]);
            } else {
                // No match
                setTimeout(() => {
                    const resetCards = [...cards];
                    resetCards[firstIndex].isFlipped = false;
                    resetCards[secondIndex].isFlipped = false;
                    setCards(resetCards);
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    useEffect(() => {
        if (matchedPairs === 6) {
            setTimeout(() => {
                onComplete && onComplete();
            }, 500);
        }
    }, [matchedPairs, onComplete]);

    return (
        <div className="game-overlay animate-fade-in">
            <div className="card game-modal" style={{ maxWidth: '700px', width: '90%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>🧠 Memory Match</h2>
                    <button onClick={onClose} className="btn-icon">✖️</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                    {cards.map((card, index) => (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(index)}
                            style={{
                                height: '100px',
                                background: card.isFlipped || card.isMatched ? 'white' : 'var(--primary-gradient)',
                                color: 'var(--text-dark)',
                                borderRadius: 'var(--radius-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'transform 0.6s',
                                transformStyle: 'preserve-3d',
                                transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                border: card.isFlipped || card.isMatched ? '2px solid var(--primary-cyan)' : 'none'
                            }}
                        >
                            <span style={{
                                transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'none',
                                display: 'inline-block'
                            }}>
                                {(card.isFlipped || card.isMatched) ? card.word : '?'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// === COMPONENT: WORD BUILDER (DRAG & DROP) ===
export const WordBuilderGame = ({ onClose, onComplete }) => {
    const [level, setLevel] = useState(1);
    const [currentWord, setCurrentWord] = useState(null);
    const [slots, setSlots] = useState([]);
    const [letters, setLetters] = useState([]);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [usedWordIndices, setUsedWordIndices] = useState(new Set());

    const initLevel = (isNext = false) => {
        let nextLevel = isNext ? level + 1 : level;

        if (nextLevel > 10) {
            setGameCompleted(true);
            return;
        }

        setLevel(nextLevel);

        // Find a word that hasn't been used yet in this session
        let availableIndices = PICTURE_WORDS.map((_, i) => i).filter(i => !usedWordIndices.has(i));

        // Reset if we ran out of words (theoretical, since we have 12 words and need 10)
        if (availableIndices.length === 0) {
            setUsedWordIndices(new Set());
            availableIndices = PICTURE_WORDS.map((_, i) => i);
        }

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        const wordObj = PICTURE_WORDS[randomIndex];

        setUsedWordIndices(prev => new Set([...prev, randomIndex]));
        setCurrentWord(wordObj);

        // Target slots (empty)
        setSlots(new Array(wordObj.word.length).fill(null));

        // Scrambled letters
        const scrambled = wordObj.word.split('')
            .map((char, i) => ({ char, id: `${nextLevel}-${i}`, originalIndex: i }))
            .sort(() => Math.random() - 0.5);
        setLetters(scrambled);
    };

    useEffect(() => {
        initLevel();
    }, []);

    const onDragStart = (e, index) => {
        const letter = letters[index];
        e.dataTransfer.setData('text/plain', index);

        // VOICE: Spell the letter being dragged
        VoiceFeatures.readText(letter.char, { rate: 0.9, pitch: 1.1 });
    };

    const handleLevelComplete = () => {
        // VOICE: Read full word on completion
        VoiceFeatures.readText(currentWord.word, { rate: 0.8, pitch: 1.0 });

        if (level === 10) {
            setTimeout(() => {
                setGameCompleted(true);
            }, 1000);
        } else {
            setTimeout(() => {
                initLevel(true);
            }, 1500);
        }
    };

    const onDrop = (e, slotIndex) => {
        e.preventDefault();
        const letterIndex = parseInt(e.dataTransfer.getData('text/plain'));
        if (isNaN(letterIndex)) return;

        const letter = letters[letterIndex];
        const newSlots = [...slots];

        if (currentWord.word[slotIndex] === letter.char) {
            newSlots[slotIndex] = letter.char;
            setSlots(newSlots);

            const newLetters = [...letters];
            newLetters[letterIndex] = { ...newLetters[letterIndex], hidden: true };
            setLetters(newLetters);

            if (newSlots.join('') === currentWord.word) {
                handleLevelComplete();
            }
        } else {
            e.target.classList.add('animate-shake');
            setTimeout(() => e.target.classList.remove('animate-shake'), 500);
        }
    };

    if (gameCompleted) {
        return (
            <div className="game-overlay animate-fade-in">
                <div className="card game-modal" style={{ maxWidth: '600px', width: '90%', padding: '50px', textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🏆</div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Super speller!</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'var(--text-muted)' }}>
                        You completed all 10 levels and mastered 10 new words!
                    </p>
                    <button onClick={() => onComplete && onComplete()} className="btn btn-primary btn-lg btn-3d" style={{ padding: '20px 60px' }}>
                        Finish & Claim Reward 🌟
                    </button>
                </div>
            </div>
        );
    }

    if (!currentWord) return null;

    return (
        <div className="game-overlay animate-fade-in">
            <div className="card game-modal" style={{ maxWidth: '900px', width: '90%', padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h2 style={{ margin: 0 }}>🧩 Word Builder</h2>
                        <div style={{ color: 'var(--primary-purple)', fontWeight: 'bold' }}>Level {level} of 10</div>
                    </div>
                    <button onClick={onClose} className="btn-icon">✖️</button>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '10px', background: 'rgba(0,0,0,0.1)', borderRadius: '5px', marginBottom: '30px', overflow: 'hidden' }}>
                    <div style={{ width: `${(level / 10) * 100}%`, height: '100%', background: 'var(--primary-gradient)', transition: 'width 0.5s ease' }}></div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '6rem', marginBottom: '10px', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }} className="animate-float">{currentWord.emoji}</div>
                    <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {slots.join('') === currentWord.word ?
                            <span style={{ color: 'var(--success-color)', fontSize: '2rem', fontWeight: 'bold' }}>Excellent! ✨</span> :
                            "Drag the letters to their correct spots!"}
                    </div>
                </div>

                {/* SLOTS */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '50px' }}>
                    {slots.map((char, i) => (
                        <div
                            key={i}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => onDrop(e, i)}
                            style={{
                                width: '70px',
                                height: '70px',
                                border: char ? '3px solid var(--success-color)' : '3px dashed var(--primary-cyan)',
                                borderRadius: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: 'var(--primary-purple)',
                                background: char ? 'white' : 'white',
                                boxShadow: char ? 'var(--shadow-3d-sm)' : 'inset 0 2px 4px rgba(0,0,0,0.05)',
                                transition: 'all 0.4s'
                            }}
                        >
                            {char}
                        </div>
                    ))}
                </div>

                {/* LETTERS POOL */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', minHeight: '80px' }}>
                    {letters.map((l, i) => !l.hidden && (
                        <div
                            key={l.id}
                            draggable
                            onDragStart={(e) => onDragStart(e, i)}
                            style={{
                                width: '70px',
                                height: '70px',
                                background: 'var(--primary-gradient)',
                                color: 'white',
                                borderRadius: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                cursor: 'grab',
                                boxShadow: 'var(--shadow-3d-md)',
                                transform: 'translateY(0)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {l.char}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// === EXPORT WRAPPER ===
export const MiniGames = {
    PictureMatching: PictureMatchingGame,
    MemoryAndFocus: MemoryGame,
    WordBuilder: WordBuilderGame
};

// Add global styles for modal overlay
const overlayStyle = document.createElement('style');
overlayStyle.textContent = `
.game-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(5px);
}
.game-modal {
    background: var(--surface-color);
    border: 2px solid var(--primary-cyan);
    box-shadow: 0 0 50px rgba(6, 182, 212, 0.3);
}
`;
document.head.appendChild(overlayStyle);
