import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { VoiceFeatures, VoiceInput } from '../utils/voice';
import { ArrowLeft, Mic, Target, Star, Volume2, Trophy, RefreshCw, ChevronRight, Play, Headphones } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SpeechPractice = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isHindi = i18n.language === 'hi';
    const observer = useRef(null);

    // Levenshtein distance for phonetic scoring
    const getLevenshteinDistance = (a, b) => {
        if (!a || !a.length) return b ? b.length : 0;
        if (!b || !b.length) return a ? a.length : 0;
        const matrix = [];
        for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
        for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
                }
            }
        }
        return matrix[b.length][a.length];
    };

    const practiceSentences = [
        { id: 1, text: "Hello", hi: "नमस्ते", difficulty: "easy", category: "Greetings" },
        { id: 2, text: "Good morning", hi: "सुप्रभात", difficulty: "easy", category: "Greetings" },
        { id: 3, text: "How are you today", hi: "आज आप कैसे हैं", difficulty: "easy", category: "Greetings" },
        { id: 4, text: "The sun is shining bright", hi: "सूरज चमक रहा है", difficulty: "easy", category: "Daily Life" },
        { id: 5, text: "I love to read books", hi: "मुझे किताबें पढ़ना पसंद है", difficulty: "medium", category: "Daily Life" },
        { id: 6, text: "The dog barks loudly", hi: "कुत्ता जोर से भौंकता है", difficulty: "medium", category: "Animals" },
        { id: 7, text: "Birds fly high in the sky", hi: "पक्षी आसमान में ऊंचे उड़ते हैं", difficulty: "medium", category: "Animals" },
        { id: 8, text: "She sells seashells by the seashore", hi: "वह समुद्र के किनारे सीपियाँ बेचती है", difficulty: "hard", category: "Tongue Twisters" },
        { id: 9, text: "Practice makes perfect every single day", hi: "अभ्यास हर दिन परिपूर्ण बनाता है", difficulty: "hard", category: "Education" }
    ];

    const [currentSentence, setCurrentSentence] = useState(null);
    const [transcription, setTranscription] = useState('');
    const [interim, setInterim] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [accuracyResult, setAccuracyResult] = useState(null);
    const [stats, setStats] = useState({ totalAttempts: 0, accuracyScores: [], perfectScores: 0 });

    useEffect(() => {
        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => observer.current.observe(el));

        return () => observer.current?.disconnect();
    }, [currentSentence, accuracyResult]);

    const lastInterimRef = useRef('');

    const startRecording = () => {
        setAccuracyResult(null);
        setTranscription('');
        setInterim('');
        lastInterimRef.current = '';
        setIsRecording(true);

        // Auto-stop after 10 seconds to prevent getting stuck
        const autoStopTimer = setTimeout(() => {
            VoiceInput.stopListening();
            setIsRecording(false);
            // If we have an interim transcript but no final, use it
            if (lastInterimRef.current && !transcription) {
                setTranscription(lastInterimRef.current);
                analyzeSpeech(lastInterimRef.current);
            }
        }, 10000);

        VoiceInput.startListening(
            (finalText, interimText) => {
                if (interimText) {
                    setInterim(interimText);
                    lastInterimRef.current = interimText;
                }
                if (finalText) {
                    clearTimeout(autoStopTimer);
                    setTranscription(finalText);
                    analyzeSpeech(finalText);
                    setIsRecording(false);
                }
            },
            (error) => { clearTimeout(autoStopTimer); console.error(error); setIsRecording(false); },
            () => {
                clearTimeout(autoStopTimer);
                setIsRecording(false);
                // Fallback: if recognition ended without final but we have interim, use it
                if (lastInterimRef.current && !transcription) {
                    setTranscription(lastInterimRef.current);
                    analyzeSpeech(lastInterimRef.current);
                }
            }
        );
    };

    const stopRecording = () => {
        VoiceInput.stopListening();
        setIsRecording(false);
        // If manually stopped with interim text, evaluate it
        if (lastInterimRef.current && !transcription) {
            setTranscription(lastInterimRef.current);
            analyzeSpeech(lastInterimRef.current);
        }
    };

    const analyzeSpeech = (spokenText) => {
        if (!currentSentence) return;
        const targetText = isHindi ? currentSentence.hi : currentSentence.text;
        const target = targetText.toLowerCase().replace(/[^\w\s\u0900-\u097F]/g, '');
        const spoken = spokenText.toLowerCase().replace(/[^\w\s\u0900-\u097F]/g, '');

        const targetWords = target.split(/\s+/).filter(w => w.length > 0);
        const spokenWords = spoken.split(/\s+/).filter(w => w.length > 0);

        const wordFeedback = targetWords.map((targetWord, i) => {
            const spokenWord = spokenWords[i] || '';
            const distance = getLevenshteinDistance(targetWord, spokenWord);
            const maxLength = Math.max(targetWord.length, spokenWord.length);
            const similarity = maxLength === 0 ? 1 : (maxLength - distance) / maxLength;
            return { targetWord, spokenWord, isCorrect: similarity >= 0.75, similarity: Math.round(similarity * 100) };
        });

        const matches = wordFeedback.filter(f => f.isCorrect).length;
        const accuracy = Math.round((matches / targetWords.length) * 100);

        setAccuracyResult({ accuracy, wordFeedback, spoken, target });
        setStats(prev => ({
            ...prev,
            totalAttempts: prev.totalAttempts + 1,
            accuracyScores: [...prev.accuracyScores, accuracy],
            perfectScores: accuracy === 100 ? prev.perfectScores + 1 : prev.perfectScores
        }));
    };

    const speakTarget = () => {
        if (currentSentence) VoiceFeatures.readText(isHindi ? currentSentence.hi : currentSentence.text, { rate: 0.8, lang: isHindi ? 'hi-IN' : 'en-US' });
    };

    const avgAccuracy = stats.accuracyScores.length > 0
        ? Math.round(stats.accuracyScores.reduce((a, b) => a + b, 0) / stats.accuracyScores.length)
        : 0;

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <header className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', marginBottom: '12px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--primary-cyan)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                            <ArrowLeft size={16}/> {t('common.back', 'Back')}
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Mic size={24} color="var(--primary-cyan)" className="animate-pulse" />
                            </div>
                            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)', letterSpacing: '-0.02em' }}>{t('speechLab.title')}</h2>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div className="hover-3d" style={{ background: 'var(--surface-elevated)', padding: '15px 25px', borderRadius: '18px', border: '1px solid var(--border-color)', textAlign: 'center', minWidth: '140px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '5px' }}>{t('speechLab.totalAttempts')}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-cyan)' }}>{stats.totalAttempts}</div>
                        </div>
                        <div className="hover-3d" style={{ background: 'var(--surface-elevated)', padding: '15px 25px', borderRadius: '18px', border: '1px solid var(--border-color)', textAlign: 'center', minWidth: '140px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '5px' }}>{t('speechLab.avgAccuracy')}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-orange)' }}>{avgAccuracy}%</div>
                        </div>
                    </div>
                </header>

                {!currentSentence ? (
                    <div className="reveal">
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '25px', color: 'var(--text-dark)' }}>{t('speechLab.chooseSubtitle')}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '25px', paddingBottom: '40px' }}>
                            {practiceSentences.map((s, idx) => (
                                <div key={s.id} className="reveal hover-3d" onClick={() => setCurrentSentence(s)} style={{ background: 'var(--surface-elevated)', padding: '28px', borderRadius: '24px', cursor: 'pointer', border: '1px solid var(--border-color)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative', overflow: 'hidden', animationDelay: `${idx * 0.05}s` }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: s.difficulty === 'easy' ? 'var(--primary-green)' : s.difficulty === 'medium' ? 'var(--primary-cyan)' : 'var(--primary-orange)' }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', padding: '4px 10px', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)' }}>{s.category}</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: s.difficulty === 'easy' ? 'var(--primary-green)' : s.difficulty === 'medium' ? 'var(--primary-cyan)' : 'var(--primary-orange)' }}>{s.difficulty.toUpperCase()}</span>
                                    </div>
                                    <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-dark)', lineHeight: 1.4 }}>{isHindi ? s.hi : s.text}</h4>
                                    <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)', fontWeight: 700, fontSize: '0.9rem' }}>
                                        {t('dashboard.startCourse')} <ChevronRight size={16} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="reveal" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="hover-3d" style={{ background: 'linear-gradient(135deg, var(--primary-cyan), var(--primary-purple))', color: 'white', padding: '50px 40px', borderRadius: '32px', marginBottom: '40px', textAlign: 'center', boxShadow: '0 20px 40px rgba(6,182,212,0.2)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
                            <h4 style={{ margin: '0 0 15px 0', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>{t('speechLab.practiceLabel')}</h4>
                            <div style={{ fontSize: '2.8rem', fontWeight: 800, margin: '0 0 30px 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>{isHindi ? currentSentence.hi : currentSentence.text}</div>
                            <button className="btn button-hover-effect" onClick={speakTarget} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '12px 28px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                                <Volume2 size={20}/> {t('speechLab.listenBtn')}
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', marginBottom: '50px' }}>
                            <button 
                                onClick={isRecording ? stopRecording : startRecording} 
                                className={isRecording ? 'mic-pulse' : ''}
                                style={{ 
                                    width: '120px', height: '120px', borderRadius: '50%', border: 'none', 
                                    background: isRecording ? 'var(--primary-orange)' : 'var(--surface-elevated)', 
                                    color: isRecording ? 'white' : 'var(--primary-cyan)', 
                                    boxShadow: isRecording ? '0 0 40px rgba(251,146,60,0.4)' : '0 15px 35px rgba(0,0,0,0.1)', 
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    border: isRecording ? 'none' : '2px solid var(--border-color)'
                                }}
                            >
                                <Mic size={48} />
                            </button>
                            
                            <div className="hover-3d" style={{ background: 'var(--surface-elevated)', padding: '40px', borderRadius: '28px', width: '100%', textAlign: 'center', border: '2px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '0.05em' }}>{t('speechLab.transcriptionLabel')}</div>
                                <div style={{ fontSize: '2.2rem', color: isRecording ? 'var(--text-muted)' : 'var(--text-dark)', fontWeight: 700, lineHeight: 1.3 }}>
                                    {transcription || interim || <span style={{ fontStyle: 'italic', opacity: 0.5, fontWeight: 500 }}>{t('speechLab.tapMic')}</span>}
                                </div>
                                {isRecording && (
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '20px' }}>
                                        {[1,2,3,4,5].map(i => <div key={i} className="voice-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {accuracyResult && (
                            <div className="reveal" style={{ background: 'var(--surface-elevated)', borderRadius: '32px', padding: '40px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', marginBottom: '60px' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '40px' }}>
                                    {accuracyResult.wordFeedback.map((f, i) => (
                                        <div key={i} className="reveal-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animationDelay: `${i * 0.05}s` }}>
                                            <span style={{ color: f.isCorrect ? 'var(--primary-green)' : 'var(--primary-orange)', fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.02em' }}>
                                                {f.spokenWord || '___'}
                                            </span>
                                            {!f.isCorrect && (
                                                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', background: 'rgba(0,0,0,0.03)', padding: '2px 10px', borderRadius: '6px' }}>
                                                        {f.targetWord}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', background: 'rgba(0,0,0,0.02)', padding: '30px', borderRadius: '24px' }}>
                                    <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                                        <svg width="100" height="100" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border-color)" strokeWidth="8" />
                                            <circle cx="50" cy="50" r="45" fill="none" stroke={accuracyResult.accuracy > 80 ? 'var(--primary-green)' : 'var(--primary-orange)'} strokeWidth="8" strokeDasharray={`${accuracyResult.accuracy * 2.82} 282`} strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: 'stroke-dasharray 1.5s ease-out' }} />
                                        </svg>
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                                            {accuracyResult.accuracy}%
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '5px' }}>{t('speechLab.accuracyScore')}</div>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 500 }}>{accuracyResult.accuracy === 100 ? 'Perfect pronunciation! Incredible job!' : accuracyResult.accuracy > 80 ? 'Great job! You are almost there.' : 'Keep practicing! You are doing well.'}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '40px' }}>
                                    <button className="btn button-hover-effect" onClick={() => setCurrentSentence(null)} style={{ padding: '14px 28px', borderRadius: '14px', background: 'var(--surface-color)', color: 'var(--text-dark)', border: '2px solid var(--border-color)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} /> {t('speechLab.chooseAnother')}
                                    </button>
                                    <button className="btn button-hover-effect" onClick={() => { setAccuracyResult(null); setTranscription(''); setInterim(''); }} style={{ padding: '14px 28px', borderRadius: '14px', background: 'var(--primary-cyan)', color: 'black', border: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <RefreshCw size={18} /> {t('speechLab.tryAgain')}
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {!accuracyResult && (
                            <div style={{ textAlign: 'center' }}>
                                <button className="btn" onClick={() => setCurrentSentence(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>{t('speechLab.backBtn')}</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
                .reveal-up { opacity: 0; transform: translateY(20px); transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
                .reveal.active, .reveal-up.active { opacity: 1; transform: translate(0); }
                .hover-3d:hover { transform: translateY(-8px) scale(1.01); box-shadow: 0 20px 40px rgba(0,0,0,0.06) !important; border-color: var(--primary-cyan); }
                .mic-pulse { animation: pulse-ring 1.5s infinite; }
                @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.4); } 70% { box-shadow: 0 0 0 30px rgba(251, 146, 60, 0); } 100% { box-shadow: 0 0 0 0 rgba(251, 146, 60, 0); } }
                .voice-bar { width: 4px; height: 15px; background: var(--primary-orange); border-radius: 4px; animation: voice-wave 0.6s infinite alternate; }
                @keyframes voice-wave { from { height: 5px; opacity: 0.5; } to { height: 25px; opacity: 1; } }
                .button-hover-effect:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
                .button-hover-effect:active { transform: translateY(0); }
            `}} />
        </DashboardLayout>
    );
};

export default SpeechPractice;
