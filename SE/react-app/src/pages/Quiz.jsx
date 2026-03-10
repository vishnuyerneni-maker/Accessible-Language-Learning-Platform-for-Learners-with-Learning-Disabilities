import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { userAPI } from '../utils/api';
import { GeminiService } from '../utils/GeminiService';
import { VoiceFeatures, VoiceInput } from '../utils/voice';
import { COURSE_DATA } from '../data/course_data';
import { useAuth } from '../context/AuthContext';
import { PartyPopper, Trophy, Sparkles, Square, Mic, ArrowRight, Brain, Target, MessageSquare, ChevronRight, X, RotateCcw, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Quiz = () => {
    const { t, i18n } = useTranslation();
    const { updateUser } = useAuth();
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionData, setQuestionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [feedback, setFeedback] = useState(null);
    const [quizFinished, setQuizFinished] = useState(false);
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [writtenAnswer, setWrittenAnswer] = useState('');
    const [evaluatingAI, setEvaluatingAI] = useState(false);
    const observer = useRef(null);

    const courseData = COURSE_DATA[courseId];
    const TOTAL_QUESTIONS = courseData?.quiz?.length || 3;
    const course = courseData || { title: 'General Knowledge' };

    useEffect(() => {
        loadQuestion();
        
        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => observer.current.observe(el));

        return () => {
            if (VoiceFeatures && VoiceFeatures.stopSpeaking) VoiceFeatures.stopSpeaking();
            if (VoiceInput && VoiceInput.stopListening) VoiceInput.stopListening();
            observer.current?.disconnect();
        };
    }, [currentQuestionIndex]);

    const loadQuestion = async () => {
        setLoading(true);
        setFeedback(null);
        setTranscript('');
        setWrittenAnswer('');
        setQuestionData(null);

        try {
            const courseData = COURSE_DATA[courseId];
            if (courseData && courseData.quiz && courseData.quiz[currentQuestionIndex]) {
                const q = courseData.quiz[currentQuestionIndex];
                // Map course_data types to UI types if needed
                if (q.type === 'speak_sentence') q.type = 'voice_practice';
                setQuestionData(q);
                setLoading(false);
                return;
            }

            const data = await GeminiService.generateQuizQuestion(course.title);
            setQuestionData(data);
        } catch (error) {
            console.error("Quiz load error", error);
            setQuestionData({
                type: 'multiple_choice',
                question: 'Are you ready to learn?',
                options: ['Yes', 'No', 'Maybe', 'Always'],
                correctIndex: 0,
                explanation: 'Positive attitude is key!'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOptionClick = (index) => {
        if (feedback) return;

        const isCorrect = index === questionData.correctIndex;
        if (isCorrect) {
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
            VoiceFeatures.readText(i18n.language === 'hi' ? "सही है!" : "Correct!", { lang: i18n.language === 'hi' ? 'hi-IN' : 'en-US' });
        } else {
            VoiceFeatures.readText(i18n.language === 'hi' ? "गलत है।" : "Incorrect.", { lang: i18n.language === 'hi' ? 'hi-IN' : 'en-US' });
        }

        setFeedback({
            isCorrect,
            message: isCorrect ? t('quiz.greatJob') : t('quiz.keepTrying'),
            explanation: questionData.explanation
        });
    };

    const handleVoiceCheck = () => {
        if (listening) {
            VoiceInput.stopListening();
            setListening(false);
            // If we have a transcript when manually stopped, evaluate it
            if (transcript) {
                checkVoiceAnswer(transcript);
            }
            return;
        }

        setListening(true);
        setTranscript('');

        // Auto-stop after 8 seconds to prevent getting stuck
        const autoStopTimer = setTimeout(() => {
            VoiceInput.stopListening();
            setListening(false);
        }, 8000);

        VoiceInput.startListening(
            (finalTranscript, interimTranscript) => {
                // Show interim text as user speaks
                setTranscript(interimTranscript || finalTranscript);
                // When we get a final transcript, evaluate it
                if (finalTranscript) {
                    clearTimeout(autoStopTimer);
                    setListening(false);
                    setTranscript(finalTranscript);
                    checkVoiceAnswer(finalTranscript);
                }
            },
            (error) => {
                clearTimeout(autoStopTimer);
                console.error('Voice recognition error:', error);
                setListening(false);
            },
            () => {
                clearTimeout(autoStopTimer);
                setListening(false);
            }
        );
    };

    const checkVoiceAnswer = (spokenText) => {
        const target = (questionData.targetSentence || "").toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
        const spoken = spokenText.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();

        const isCorrect = spoken.includes(target) || target.includes(spoken);

        if (isCorrect) {
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
            VoiceFeatures.readText(i18n.language === 'hi' ? "शाबाश!" : "Great job!", { lang: i18n.language === 'hi' ? 'hi-IN' : 'en-US' });
        } else {
            VoiceFeatures.readText(i18n.language === 'hi' ? "अच्छा प्रयास।" : "Nice try.", { lang: i18n.language === 'hi' ? 'hi-IN' : 'en-US' });
        }

        setFeedback({
            isCorrect,
            message: isCorrect ? (i18n.language === 'hi' ? "शानदार उच्चारण!" : "Great pronunciation!") : (i18n.language === 'hi' ? "लगभग सही। फिर से प्रयास करें।" : "Not quite. Try again."),
            explanation: questionData.explanation
        });
    };

    const submitWrittenAnswer = async () => {
        if (!writtenAnswer.trim()) return;
        setEvaluatingAI(true);
        
        await new Promise(resolve => setTimeout(resolve, 1500));

        let isCorrect = false;
        let aiMessage = "";
        
        const rubricText = (questionData.rubric || "").toLowerCase();
        const answerText = writtenAnswer.toLowerCase();
        const keywords = rubricText.split(',').map(k => k.trim()).filter(k => k.length > 0);
        let matchCount = 0;
        
        if (keywords.length > 0) {
            keywords.forEach(keyword => {
                if (answerText.includes(keyword)) matchCount++;
            });
            isCorrect = matchCount >= keywords.length / 2;
            aiMessage = isCorrect ? t('quiz.greatJob') : `You missed some key concepts. Think about: ${keywords.join(', ')}`;
        } else {
            isCorrect = answerText.length > 15;
            aiMessage = isCorrect ? "Good effort and detail!" : "Please provide a more detailed answer.";
        }

        if (isCorrect) {
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
            VoiceFeatures.readText(i18n.language === 'hi' ? "बहुत अच्छा उत्तर!" : "Great answer!", { lang: i18n.language === 'hi' ? 'hi-IN' : 'en-US' });
        } else {
            VoiceFeatures.readText(i18n.language === 'hi' ? "आइए उस विषय की समीक्षा करें।" : "Let's review that topic.", { lang: i18n.language === 'hi' ? 'hi-IN' : 'en-US' });
        }

        setFeedback({
            isCorrect,
            message: isCorrect ? "AI says: Great Answer!" : "AI says: Needs Review.",
            explanation: aiMessage
        });
        setEvaluatingAI(false);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex + 1 >= TOTAL_QUESTIONS) {
            finishQuiz();
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const finishQuiz = async () => {
        setQuizFinished(true);
        const finalScorePercent = Math.round((score.correct / TOTAL_QUESTIONS) * 100);

        if (finalScorePercent >= 50) {
            try {
                const res = await userAPI.updateProgress(courseId, 100);
                if (res.data) {
                    updateUser({
                        gamification: res.data.gamification,
                        progress: res.data.progress,
                        recentActivity: res.data.recentActivity
                    });
                }
            } catch (error) {
                console.error("Failed to update progress", error);
            }
        }
    };

    if (quizFinished) {
        const finalPercent = Math.round((score.correct / TOTAL_QUESTIONS) * 100);
        const isMastered = finalPercent >= 50;
        return (
            <DashboardLayout>
                <div className="reveal active" style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center' }}>
                    <div style={{ background: 'var(--surface-elevated)', padding: '60px', borderRadius: '40px', border: '1px solid var(--border-color)', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'inline-flex', width: '100px', height: '100px', borderRadius: '30px', background: isMastered ? 'rgba(234,179,8,0.1)' : 'rgba(6,182,212,0.1)', color: isMastered ? '#eab308' : 'var(--primary-cyan)', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
                            {isMastered ? <PartyPopper size={60} /> : <Trophy size={60} />}
                        </div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '10px' }}>{t('quiz.finish')}</h1>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '40px' }}>{t('quiz.score')}: <span style={{ color: 'var(--primary-cyan)' }}>{finalPercent}%</span></p>
                        
                        <div style={{ background: 'rgba(0,0,0,0.02)', padding: '30px', borderRadius: '24px', marginBottom: '40px' }}>
                            <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
                                {isMastered ? t('quiz.greatJob') : t('quiz.keepTrying')}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <button onClick={() => window.location.reload()} className="btn button-hover-effect" style={{ background: 'var(--surface-color)', color: 'var(--text-dark)', border: '2px solid var(--border-color)', padding: '16px 36px', borderRadius: '18px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <RotateCcw size={20}/> {t('quiz.retry')}
                            </button>
                            <Link to="/courses" className="btn button-hover-effect" style={{ background: 'var(--primary-cyan)', color: 'black', border: 'none', padding: '16px 36px', borderRadius: '18px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                                <Home size={20}/> {t('quiz.backToCourses')}
                            </Link>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const progressPercent = Math.round(((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100);

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
                <header className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <Link to="/courses" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <X size={18}/> {t('common.cancel', 'Quit Quiz')}
                    </Link>
                    <div style={{ background: 'var(--surface-elevated)', padding: '10px 24px', borderRadius: '100px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 800 }}>
                        <Target size={18} color="var(--primary-cyan)"/>
                        <span>{t('quiz.score')}: {score.correct}/{currentQuestionIndex}</span>
                    </div>
                </header>

                <div className="reveal hover-3d" style={{ background: 'var(--surface-elevated)', borderRadius: '40px', border: '1px solid var(--border-color)', padding: '60px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                    {/* Progress Bar Top */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'rgba(0,0,0,0.05)' }}>
                        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-cyan), var(--primary-purple))', transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}></div>
                    </div>

                    <div style={{ color: 'var(--primary-purple)', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Brain size={18}/> {t('quiz.question')} {currentQuestionIndex + 1} {t('quiz.of')} {TOTAL_QUESTIONS}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px' }}>
                            <div style={{ display: 'inline-flex', animation: 'spin 2s linear infinite' }}><Sparkles size={60} color="var(--primary-cyan)" /></div>
                            <h3 style={{ marginTop: '24px', color: 'var(--text-muted)' }}>AI {t('nlpLab.evaluating', 'is evaluating...')}</h3>
                        </div>
                    ) : (
                        <div>
                            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '40px', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                                {questionData.question}
                            </h2>

                            {questionData.type === 'multiple_choice' ? (
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    {questionData.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionClick(idx)}
                                            disabled={feedback !== null}
                                            className="button-hover-effect"
                                            style={{
                                                padding: '24px 30px', textAlign: 'left', fontSize: '1.2rem', fontWeight: 600,
                                                border: '2px solid var(--border-color)', borderRadius: '20px',
                                                background: feedback && idx === questionData.correctIndex ? 'rgba(34,197,94,0.1)' :
                                                    feedback && !feedback.isCorrect && idx === questionData.options.indexOf(feedback.selected) ? 'rgba(239,68,68,0.1)' : 'var(--surface-color)',
                                                borderColor: feedback && idx === questionData.correctIndex ? 'var(--primary-green)' :
                                                    feedback && !feedback.isCorrect && idx === questionData.options.indexOf(feedback.selected) ? 'var(--primary-orange)' : 'var(--border-color)',
                                                color: 'var(--text-dark)', cursor: feedback ? 'default' : 'pointer', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                display: 'flex', alignItems: 'center', gap: '15px'
                                            }}
                                        >
                                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800 }}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            ) : questionData.type === 'voice_practice' ? (
                                <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(6,182,212,0.03)', borderRadius: '32px', border: '2px dashed var(--border-color)' }}>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-cyan)', marginBottom: '30px' }}>"{questionData.targetSentence}"</h3>

                                    <button
                                        onClick={handleVoiceCheck}
                                        disabled={feedback !== null}
                                        className={`button-hover-effect ${listening ? 'mic-pulse' : ''}`}
                                        style={{
                                            width: '100px', height: '100px', borderRadius: '50%',
                                            background: listening ? 'var(--primary-orange)' : 'var(--primary-cyan)',
                                            color: 'black', border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(6,182,212,0.3)'
                                        }}
                                    >
                                        {listening ? <Square size={40} /> : <Mic size={40} />}
                                    </button>
                                    <p style={{ marginTop: '24px', fontWeight: 700, color: 'var(--text-muted)' }}>
                                        {listening ? t('speechLab.recording') : t('quiz.speakInstruction')}
                                    </p>
                                    {transcript && <div style={{ marginTop: '20px', padding: '12px 24px', background: 'white', borderRadius: '100px', display: 'inline-block', fontStyle: 'italic', fontWeight: 600 }}>"{transcript}"</div>}
                                </div>
                            ) : (
                                <div style={{ padding: '30px', background: 'rgba(0,0,0,0.02)', borderRadius: '32px' }}>
                                    <textarea 
                                        value={writtenAnswer}
                                        onChange={e => setWrittenAnswer(e.target.value)}
                                        disabled={feedback !== null || evaluatingAI}
                                        style={{ width: '100%', minHeight: '180px', padding: '24px', borderRadius: '20px', border: '2px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 500, resize: 'none', background: 'white', outline: 'none', transition: 'border-color 0.2s' }}
                                        placeholder={t('nlpLab.typePlaceholder', 'Type your answer here...')}
                                        onFocus={e => e.target.style.borderColor = 'var(--primary-cyan)'}
                                        onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                                    />
                                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button 
                                            onClick={submitWrittenAnswer} 
                                            disabled={!writtenAnswer.trim() || feedback !== null || evaluatingAI}
                                            className="btn button-hover-effect"
                                            style={{ background: 'var(--primary-cyan)', color: 'black', border: 'none', padding: '14px 32px', borderRadius: '14px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                                        >
                                            {evaluatingAI ? <><Sparkles size={18}/> {t('nlpLab.evaluating')}</> : <>{t('nlpLab.submitBtn')} <ChevronRight size={18}/></>}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {feedback && (
                                <div className="reveal-up active" style={{ marginTop: '40px', padding: '40px', background: feedback.isCorrect ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)', borderRadius: '32px', border: `2px solid ${feedback.isCorrect ? 'var(--primary-green)' : 'var(--primary-orange)'}` }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: feedback.isCorrect ? 'var(--primary-green)' : 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                            {feedback.isCorrect ? <Sparkles size={18}/> : <X size={18}/>}
                                        </div>
                                        <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>{feedback.message}</h4>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500 }}>
                                        <span style={{ fontWeight: 800, color: 'var(--text-dark)' }}>{t('quiz.explanation')}:</span> {feedback.explanation}
                                    </p>

                                    <button onClick={nextQuestion} className="btn button-hover-effect" style={{ marginTop: '30px', background: 'var(--text-dark)', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '14px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                                        {currentQuestionIndex + 1 < TOTAL_QUESTIONS ? <>{t('lessonPlayer.nextConcept')} <ArrowRight size={20}/></> : <>{t('quiz.finish')} <ArrowRight size={20}/></>}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
                .reveal-up { opacity: 0; transform: translateY(20px); transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
                .reveal.active, .reveal-up.active { opacity: 1; transform: translate(0); }
                .hover-3d:hover { transform: translateY(-5px); box-shadow: 0 40px 80px rgba(0,0,0,0.08) !important; }
                .mic-pulse { animation: pulse-ring 1.5s infinite; }
                @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.4); } 70% { box-shadow: 0 0 0 20px rgba(251, 146, 60, 0); } 100% { box-shadow: 0 0 0 0 rgba(251, 146, 60, 0); } }
                .button-hover-effect:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
                .button-hover-effect:active { transform: translateY(0); }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}} />
        </DashboardLayout>
    );
};

export default Quiz;
