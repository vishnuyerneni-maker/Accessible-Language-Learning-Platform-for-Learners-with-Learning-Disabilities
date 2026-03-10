import React, { useState, useEffect } from 'react';
import { VoiceFeatures } from '../utils/voice';
import IconMapping from './IconMapping';
import { Target, X, Brain, Trophy, Star, Puzzle, Sparkles, XCircle, PartyPopper, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// === DATA ===
const PICTURE_WORDS = [
    { word: 'CAT', iconName: 'Cat', hint: 'A furry pet that says meow' },
    { word: 'DOG', iconName: 'Dog', hint: 'A loyal pet that barks' },
    { word: 'SUN', iconName: 'Sun', hint: 'Bright and warm in the sky' },
    { word: 'MOON', iconName: 'Moon', hint: 'Shines at night' },
    { word: 'TREE', iconName: 'TreePine', hint: 'Tall with leaves and branches' },
    { word: 'HOUSE', iconName: 'Home', hint: 'Where we live' },
    { word: 'CAR', iconName: 'Car', hint: 'Vehicle with four wheels' },
    { word: 'APPLE', iconName: 'Apple', hint: 'Red or green fruit' },
    { word: 'BOOK', iconName: 'Book', hint: 'You read this' },
    { word: 'HEART', iconName: 'Heart', hint: 'Symbol of love' },
    { word: 'STAR', iconName: 'Star', hint: 'Twinkles in the night sky' },
    { word: 'FLOWER', iconName: 'Flower', hint: 'Pretty plant that blooms' }
];

// === COMPONENT: PICTURE MATCHING ===
export const PictureMatchingGame = ({ onClose, onComplete }) => {
    const { t, i18n } = useTranslation();
    const [cards, setCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const selected = PICTURE_WORDS.sort(() => Math.random() - 0.5).slice(0, 6);
        const items = [
            ...selected.map(p => ({ id: p.word + '-icon', type: 'icon', value: p.iconName, word: p.word, isMatched: false })),
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
                setCards(prev => prev.map(c =>
                    (c.id === first.id || c.id === second.id) ? { ...c, isMatched: true } : c
                ));
                setMatchedPairs(prev => prev + 1);
                setMessage(<><PartyPopper size={20} style={{marginRight: '8px'}}/> {t('miniGames.match')}</>);
                VoiceFeatures.readText(i18n.language === 'hi' ? "मिल गया!" : "Match!", { lang: i18n.language === 'hi' ? 'hi-IN' : 'en-US' });
                setTimeout(() => setMessage(''), 1000);
            } else {
                setMessage(<><XCircle size={20} style={{marginRight: '8px'}}/> {t('miniGames.tryAgain')}</>);
                VoiceFeatures.readText(i18n.language === 'hi' ? "फिर से प्रयास करें।" : "Try again.", { lang: i18n.language === 'hi' ? 'hi-IN' : 'en-US' });
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
        <div className="game-overlay reveal active">
            <div className="game-modal-content" style={{ maxWidth: '900px', width: '95%', background: 'var(--surface-elevated)', borderRadius: '40px', padding: '40px', border: '1px solid var(--border-color)', boxShadow: '0 40px 80px rgba(0,0,0,0.3)', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '25px', right: '25px', width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={24}/>
                </button>

                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ display: 'inline-flex', width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(6,182,212,0.1)', color: 'var(--primary-cyan)', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                        <Target size={32}/>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>{t('dyslexiaCenter.pictureTitle')}</h2>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginBottom: '30px', fontWeight: 800 }}>
                    <div style={{ background: 'var(--surface-color)', padding: '10px 24px', borderRadius: '100px', border: '1px solid var(--border-color)', color: 'var(--primary-cyan)' }}>
                        {t('miniGames.matches')}: {matchedPairs} / 6
                    </div>
                    {message && <div style={{ color: 'var(--primary-purple)', animation: 'bounce 0.5s infinite alternate', display: 'flex', alignItems: 'center' }}>{message}</div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', padding: '10px' }}>
                    {cards.map(card => {
                        const isSelected = selectedCards.find(c => c.id === card.id);
                        return (
                            <div
                                key={card.id}
                                onClick={() => handleCardClick(card)}
                                className="button-hover-effect"
                                style={{
                                    height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: card.isMatched ? 'rgba(34,197,94,0.1)' : (isSelected ? 'rgba(251,146,60,0.1)' : 'var(--surface-color)'),
                                    border: `2px solid ${card.isMatched ? 'var(--primary-green)' : (isSelected ? 'var(--primary-orange)' : 'var(--border-color)')}`,
                                    borderRadius: '24px', cursor: 'pointer', opacity: card.isMatched ? 0.6 : 1,
                                    transform: isSelected ? 'scale(1.05)' : 'scale(1)', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                }}
                            >
                                {card.type === 'icon' ? <IconMapping iconName={card.value} size={60} color={card.isMatched ? 'var(--primary-green)' : 'var(--text-dark)'} /> : <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)' }}>{card.value}</span>}
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
    const { t, i18n } = useTranslation();
    const EMOJI_PAIRS = [
        { word: 'CAT',  emoji: '🐱' },
        { word: 'DOG',  emoji: '🐶' },
        { word: 'SUN',  emoji: '☀️' },
        { word: 'MOON', emoji: '🌙' },
        { word: 'STAR', emoji: '⭐' },
        { word: 'BOOK', emoji: '📚' },
    ];

    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [moves, setMoves] = useState(0);
    const [locked, setLocked] = useState(false);

    useEffect(() => {
        const items = [...EMOJI_PAIRS, ...EMOJI_PAIRS]
            .sort(() => Math.random() - 0.5)
            .map((item, index) => ({ id: index, word: item.word, emoji: item.emoji, isFlipped: false, isMatched: false }));
        setCards(items);
    }, []);

    const handleCardClick = (index) => {
        if (locked || cards[index].isFlipped || cards[index].isMatched) return;

        const newCards = cards.map((c, i) => i === index ? { ...c, isFlipped: true } : c);
        setCards(newCards);

        const newFlipped = [...flippedCards, index];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            setLocked(true);
            const [firstIndex, secondIndex] = newFlipped;
            if (newCards[firstIndex].word === newCards[secondIndex].word) {
                const matched = newCards.map((c, i) =>
                    i === firstIndex || i === secondIndex ? { ...c, isMatched: true } : c
                );
                setCards(matched);
                setMatchedPairs(prev => prev + 1);
                setFlippedCards([]);
                setLocked(false);
                VoiceFeatures.readText(i18n.language === 'hi' ? "बहुत अच्छे!" : "Great match!", { lang: i18n.language === 'hi' ? 'hi-IN' : 'en-US' });
            } else {
                setTimeout(() => {
                    setCards(newCards.map((c, i) =>
                        i === firstIndex || i === secondIndex ? { ...c, isFlipped: false } : c
                    ));
                    setFlippedCards([]);
                    setLocked(false);
                }, 1000);
            }
        }
    };

    useEffect(() => {
        if (matchedPairs === 6) {
            setTimeout(() => { onComplete && onComplete(); }, 600);
        }
    }, [matchedPairs, onComplete]);

    return (
        <div className="game-overlay reveal active">
            <div className="game-modal-content" style={{ maxWidth: '700px', width: '90%', background: 'var(--surface-elevated)', borderRadius: '40px', padding: '40px', border: '1px solid var(--border-color)', boxShadow: '0 40px 80px rgba(0,0,0,0.3)', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '25px', right: '25px', width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={24}/>
                </button>

                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ display: 'inline-flex', width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(139,92,246,0.1)', color: 'var(--primary-purple)', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                        <Brain size={32}/>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>{t('dyslexiaCenter.memoryTitle')}</h2>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', color: 'var(--text-muted)', fontWeight: 800 }}>
                    <div style={{ background: 'var(--primary-cyan)', color: 'black', padding: '8px 20px', borderRadius: '100px' }}>{t('miniGames.matches')}: {matchedPairs} / 6</div>
                    <div style={{ background: 'var(--primary-orange)', color: 'black', padding: '8px 20px', borderRadius: '100px' }}>{t('miniGames.moves')}: {moves}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                    {cards.map((card, index) => (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(index)}
                            className="button-hover-effect"
                            style={{
                                height: '110px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: card.isFlipped || card.isMatched ? '3.5rem' : '2rem', cursor: card.isMatched ? 'default' : 'pointer',
                                background: card.isMatched ? 'rgba(34,197,94,0.15)' : (card.isFlipped ? 'white' : 'var(--primary-gradient)'),
                                border: `3px solid ${card.isMatched ? 'var(--primary-green)' : (card.isFlipped ? 'var(--primary-cyan)' : 'transparent')}`,
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                transform: card.isFlipped || card.isMatched ? 'scale(1.05)' : 'scale(1)',
                                boxShadow: card.isFlipped ? '0 10px 30px rgba(6,182,212,0.2)' : 'none',
                            }}
                        >
                            {(card.isFlipped || card.isMatched) ? card.emoji : '❓'}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// === COMPONENT: WORD BUILDER ===
export const WordBuilderGame = ({ onClose, onComplete }) => {
    const { t, i18n } = useTranslation();
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
        let availableIndices = PICTURE_WORDS.map((_, i) => i).filter(i => !usedWordIndices.has(i));
        if (availableIndices.length === 0) {
            setUsedWordIndices(new Set());
            availableIndices = PICTURE_WORDS.map((_, i) => i);
        }
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        const wordObj = PICTURE_WORDS[randomIndex];
        setUsedWordIndices(prev => new Set([...prev, randomIndex]));
        setCurrentWord(wordObj);
        setSlots(new Array(wordObj.word.length).fill(null));
        const scrambled = wordObj.word.split('').map((char, i) => ({ char, id: `${nextLevel}-${i}` })).sort(() => Math.random() - 0.5);
        setLetters(scrambled);
    };

    useEffect(() => { initLevel(); }, []);

    const onDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index);
        VoiceFeatures.readText(letters[index].char);
    };

    const onDrop = (e, slotIndex) => {
        e.preventDefault();
        const letterIndex = parseInt(e.dataTransfer.getData('text/plain'));
        if (isNaN(letterIndex)) return;
        const letter = letters[letterIndex];
        if (currentWord.word[slotIndex] === letter.char) {
            const newSlots = [...slots];
            newSlots[slotIndex] = letter.char;
            setSlots(newSlots);
            const newLetters = [...letters];
            newLetters[letterIndex] = { ...newLetters[letterIndex], hidden: true };
            setLetters(newLetters);
            if (newSlots.join('') === currentWord.word) {
                VoiceFeatures.readText(currentWord.word);
                if (level === 10) setTimeout(() => setGameCompleted(true), 1000);
                else setTimeout(() => initLevel(true), 1500);
            }
        }
    };

    if (gameCompleted) {
        return (
            <div className="game-overlay reveal active">
                <div className="game-modal-content" style={{ maxWidth: '600px', width: '90%', background: 'var(--surface-elevated)', borderRadius: '40px', padding: '60px', textAlign: 'center', boxShadow: '0 40px 80px rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'inline-flex', width: '100px', height: '100px', borderRadius: '30px', background: 'rgba(234,179,8,0.1)', color: '#eab308', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
                        <Trophy size={60} />
                    </div>
                    <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '15px' }}>{t('miniGames.superSpeller')}</h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', fontWeight: 500 }}>{t('miniGames.masteredWords')}</p>
                    <button onClick={() => onComplete && onComplete()} className="btn button-hover-effect" style={{ background: 'var(--primary-cyan)', color: 'black', border: 'none', padding: '18px 48px', borderRadius: '20px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', margin: '0 auto' }}>
                        {t('miniGames.claimReward')} <Star size={24}/>
                    </button>
                </div>
            </div>
        );
    }

    if (!currentWord) return null;

    return (
        <div className="game-overlay reveal active">
            <div className="game-modal-content" style={{ maxWidth: '900px', width: '95%', background: 'var(--surface-elevated)', borderRadius: '40px', padding: '50px', position: 'relative', border: '1px solid var(--border-color)', boxShadow: '0 40px 80px rgba(0,0,0,0.3)' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '25px', right: '25px', width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={24}/>
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(249,115,22,0.1)', color: 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Puzzle size={32}/>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>{t('dyslexiaCenter.wordBuilderTitle')}</h2>
                            <div style={{ color: 'var(--primary-purple)', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase' }}>{t('miniGames.level')} {level} {t('miniGames.of')} 10</div>
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', marginBottom: '40px', overflow: 'hidden' }}>
                    <div style={{ width: `${(level / 10) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-orange), var(--primary-pink))', transition: 'width 0.8s' }}></div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <div style={{ display: 'inline-flex', padding: '30px', background: 'rgba(0,0,0,0.02)', borderRadius: '40px', marginBottom: '20px' }}>
                        <IconMapping iconName={currentWord.iconName} size={120} color="var(--primary-orange)"/>
                    </div>
                    <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {slots.join('') === currentWord.word ? <span style={{ color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>{t('miniGames.excellent')} <Sparkles size={28}/></span> : t('miniGames.dragInstruction')}
                    </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '60px' }}>
                    {slots.map((char, i) => (
                        <div key={i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, i)} style={{ width: '85px', height: '85px', border: char ? '3px solid var(--primary-green)' : '3px dashed var(--primary-cyan)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 800, color: 'var(--text-dark)', background: char ? 'rgba(34,197,94,0.05)' : 'white', transition: 'all 0.4s' }}>
                            {char}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    {letters.map((l, i) => !l.hidden && (
                        <div key={l.id} draggable onDragStart={(e) => onDragStart(e, i)} className="button-hover-effect" style={{ width: '80px', height: '80px', background: 'var(--primary-gradient)', color: 'white', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, cursor: 'grab', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
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

const overlayStyle = document.createElement('style');
overlayStyle.textContent = `
.game-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(15px); z-index: 9999; display: flex; alignItems: center; justifyContent: center; padding: 20px; }
.button-hover-effect:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
.button-hover-effect:active { transform: translateY(0); }
@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-5px); } }
`;
document.head.appendChild(overlayStyle);
