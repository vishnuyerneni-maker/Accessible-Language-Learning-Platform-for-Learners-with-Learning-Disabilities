import React, { useState, useEffect } from 'react';
import { X, Volume2, MessageCircle, Target, Clock, Activity, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { VoiceFeatures } from '../utils/voice';

// === DATA ===
const LETTER_SOUNDS = {
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
};

const BLENDING_WORDS = [
    { letters: ['c', 'a', 't'], word: 'cat', difficulty: 'easy' },
    { letters: ['d', 'o', 'g'], word: 'dog', difficulty: 'easy' },
    { letters: ['s', 'u', 'n'], word: 'sun', difficulty: 'easy' },
    { letters: ['b', 'a', 't'], word: 'bat', difficulty: 'easy' },
    { letters: ['r', 'u', 'n'], word: 'run', difficulty: 'medium' },
    { letters: ['j', 'u', 'm', 'p'], word: 'jump', difficulty: 'medium' },
    { letters: ['s', 't', 'o', 'p'], word: 'stop', difficulty: 'medium' },
    { letters: ['g', 'r', 'e', 'e', 'n'], word: 'green', difficulty: 'hard' }
];

// === COMPONENT: PHONICS LESSON ===
export const PhonicsLesson = ({ letter, onClose }) => {
    const { t, i18n } = useTranslation();
    const data = LETTER_SOUNDS[letter.toUpperCase()];

    useEffect(() => {
        if (data) {
            const lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
            VoiceFeatures.readText(
                i18n.language === 'hi' ? `अक्षर ${letter}` : `Letter ${letter}`,
                { lang, rate: 0.8 }
            );
            setTimeout(() => VoiceFeatures.readText(`${data.sound}`, { lang: 'en-US', rate: 0.7 }), 1500);
            setTimeout(() => VoiceFeatures.readText(
                i18n.language === 'hi' ? `${letter} के लिए ${data.example}` : `${letter} for ${data.example}`,
                { lang, rate: 0.8 }
            ), 3000);
        }
    }, [letter, data, i18n.language]);

    if (!data) return null;

    return (
        <div className="game-overlay reveal active">
            <div style={{
                maxWidth: '650px', width: '90%', background: 'var(--surface-elevated)',
                borderRadius: '40px', padding: '50px', border: '1px solid var(--border-color)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.3)', position: 'relative', textAlign: 'center'
            }}>
                <button onClick={onClose} className="button-hover-effect" style={{
                    position: 'absolute', top: '25px', right: '25px', width: '45px', height: '45px',
                    borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: 'none',
                    color: 'var(--text-dark)', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                }}><X size={24}/></button>

                <div style={{
                    display: 'inline-flex', width: '60px', height: '60px', borderRadius: '18px',
                    background: 'rgba(6,182,212,0.1)', color: 'var(--primary-cyan)',
                    alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
                }}><Sparkles size={32}/></div>

                <div style={{
                    fontSize: '9rem', fontWeight: 900,
                    background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '20px',
                    letterSpacing: '-0.05em'
                }}>{letter}</div>

                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 15px 0', color: 'var(--text-dark)' }}>
                        {t('phonics.letter')} {letter}
                    </h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '1.2rem', fontWeight: 700 }}>
                        <span style={{ color: 'var(--text-muted)' }}>
                            {t('phonics.sound')}: <strong style={{ color: 'var(--primary-cyan)' }}>{data.sound}</strong>
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                            {t('phonics.phonetic')}: <strong style={{ color: 'var(--primary-purple)' }}>{data.phonetic}</strong>
                        </span>
                    </div>
                </div>

                <div style={{
                    padding: '30px', background: 'var(--surface-color)', borderRadius: '24px',
                    marginBottom: '40px', border: '1px solid var(--border-color)'
                }}>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 700, margin: '0 0 10px 0', textTransform: 'uppercase' }}>
                        {t('phonics.exampleWord')}
                    </p>
                    <p style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary-pink)', margin: 0 }}>
                        {data.example.toUpperCase()}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button onClick={() => VoiceFeatures.readText(data.sound, { rate: 0.6 })} className="btn button-hover-effect" style={{
                        background: 'var(--primary-cyan)', color: 'black', border: 'none',
                        padding: '16px 30px', borderRadius: '18px', fontWeight: 800,
                        display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'
                    }}>
                        <Volume2 size={24}/> {t('phonics.hearSound')}
                    </button>
                    <button onClick={() => VoiceFeatures.readText(data.example)} className="btn button-hover-effect" style={{
                        background: 'var(--surface-color)', color: 'var(--text-dark)',
                        border: '1px solid var(--border-color)', padding: '16px 30px',
                        borderRadius: '18px', fontWeight: 800, display: 'flex',
                        alignItems: 'center', gap: '10px', cursor: 'pointer'
                    }}>
                        <MessageCircle size={24}/> {t('phonics.hearExample')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// === COMPONENT: BLENDING PRACTICE ===
export const BlendingPractice = ({ onClose }) => {
    const { t } = useTranslation();
    const [currentWord, setCurrentWord] = useState(BLENDING_WORDS[0]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const playBlend = (speed = 'slow') => {
        const delays = { slow: 1200, medium: 800, fast: 400 };
        const delay = delays[speed];
        setActiveIndex(-1);
        setShowAnswer(false);

        currentWord.letters.forEach((l, i) => {
            setTimeout(() => {
                const sound = LETTER_SOUNDS[l.toUpperCase()]?.sound || l;
                VoiceFeatures.readText(sound, { rate: 0.7 });
                setActiveIndex(i);
            }, i * delay);
        });

        setTimeout(() => {
            setActiveIndex(-1);
            VoiceFeatures.readText(currentWord.word);
            setShowAnswer(true);
        }, currentWord.letters.length * delay + 500);
    };

    const nextWord = () => {
        const next = BLENDING_WORDS[Math.floor(Math.random() * BLENDING_WORDS.length)];
        setCurrentWord(next);
        setShowAnswer(false);
        setActiveIndex(-1);
    };

    return (
        <div className="game-overlay reveal active">
            <div style={{
                maxWidth: '850px', width: '95%', background: 'var(--surface-elevated)',
                borderRadius: '40px', padding: '50px', border: '1px solid var(--border-color)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.3)', position: 'relative', textAlign: 'center'
            }}>
                <button onClick={onClose} className="button-hover-effect" style={{
                    position: 'absolute', top: '25px', right: '25px', width: '45px', height: '45px',
                    borderRadius: '50%', background: 'rgba(0,0,0,0.05)', border: 'none',
                    color: 'var(--text-dark)', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                }}><X size={24}/></button>

                <div style={{
                    display: 'inline-flex', width: '60px', height: '60px', borderRadius: '18px',
                    background: 'rgba(16,185,129,0.1)', color: 'var(--primary-green)',
                    alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
                }}><Target size={32}/></div>

                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 40px 0', color: 'var(--text-dark)' }}>
                    {t('phonics.wordBlending')}
                </h2>

                <div style={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    marginBottom: '50px', flexWrap: 'wrap', gap: '15px'
                }}>
                    {currentWord.letters.map((l, i) => (
                        <div key={i} style={{
                            width: '100px', height: '120px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontSize: '4.5rem', fontWeight: 900,
                            background: activeIndex === i ? 'var(--primary-green)' : 'var(--surface-color)',
                            color: activeIndex === i ? 'white' : 'var(--text-dark)',
                            borderRadius: '24px',
                            border: `3px solid ${activeIndex === i ? 'var(--primary-green)' : 'var(--border-color)'}`,
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            transform: activeIndex === i ? 'scale(1.15) translateY(-5px)' : 'scale(1)',
                            boxShadow: activeIndex === i ? '0 20px 40px rgba(34,197,94,0.3)' : 'none'
                        }}>{l.toUpperCase()}</div>
                    ))}
                    <div style={{ fontSize: '3rem', margin: '0 10px', color: 'var(--text-muted)', fontWeight: 800 }}>→</div>
                    <div style={{
                        minWidth: '180px', height: '120px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '4.5rem', fontWeight: 900,
                        color: 'var(--primary-pink)',
                        background: showAnswer ? 'rgba(236,72,153,0.05)' : 'rgba(0,0,0,0.02)',
                        borderRadius: '24px',
                        border: `3px dashed ${showAnswer ? 'var(--primary-pink)' : 'var(--border-color)'}`,
                        transition: 'all 0.5s'
                    }}>{showAnswer ? currentWord.word.toUpperCase() : '?'}</div>
                </div>

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
                    <button onClick={() => playBlend('slow')} className="btn button-hover-effect" style={{
                        background: 'var(--surface-color)', color: 'var(--text-dark)',
                        border: '1px solid var(--border-color)', padding: '16px 30px',
                        borderRadius: '18px', fontWeight: 800, display: 'flex',
                        alignItems: 'center', gap: '10px', cursor: 'pointer'
                    }}><Clock size={22}/> {t('phonics.slow')}</button>
                    <button onClick={() => playBlend('medium')} className="btn button-hover-effect" style={{
                        background: 'var(--primary-cyan)', color: 'black', border: 'none',
                        padding: '16px 35px', borderRadius: '18px', fontWeight: 800,
                        display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'
                    }}><Activity size={22}/> {t('phonics.medium')}</button>
                    <button onClick={() => playBlend('fast')} className="btn button-hover-effect" style={{
                        background: 'var(--primary-pink)', color: 'white', border: 'none',
                        padding: '16px 30px', borderRadius: '18px', fontWeight: 800,
                        display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'
                    }}><Zap size={22}/> {t('phonics.fast')}</button>
                </div>

                <button onClick={nextWord} className="btn button-hover-effect" style={{
                    background: 'transparent', color: 'var(--primary-purple)',
                    border: '2px solid var(--primary-purple)', padding: '12px 30px',
                    borderRadius: '100px', fontWeight: 800, fontSize: '1.1rem',
                    display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer'
                }}>{t('phonics.nextWord')} <ArrowRight size={20}/></button>
            </div>
        </div>
    );
};
