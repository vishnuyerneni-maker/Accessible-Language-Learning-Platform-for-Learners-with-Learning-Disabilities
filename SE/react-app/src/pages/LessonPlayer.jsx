import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { COURSE_DATA } from '../data/course_data';
import { VoiceFeatures, VoiceInput } from '../utils/voice';
import { userAPI } from '../utils/api';
import { MiniGames } from '../components/MiniGames';

import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { AlertTriangle, Gamepad2, Brain, Volume2, Mic, FileSignature, ArrowLeft, ArrowRight, Sparkles, ChevronRight, Headphones, PlayCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LessonPlayer = () => {
    const { t, i18n } = useTranslation();
    const { isFocusMode } = useAccessibility();
    const { updateUser } = useAuth();
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [lessonSlides, setLessonSlides] = useState([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [courseTitle, setCourseTitle] = useState('');
    const [practiceStatus, setPracticeStatus] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [activeGame, setActiveGame] = useState(null);
    const [error, setError] = useState(null);
    const observer = useRef(null);

    useEffect(() => {
        const course = COURSE_DATA[courseId || 'course_101'];
        if (course) {
            setLessonSlides(course.lessons);
            setCourseTitle(course.title);
            setError(null);
        } else {
            setError(t('lessonPlayer.errorNotFound'));
        }

        // Force all reveal elements active after a short delay (fallback for IntersectionObserver)
        const forceReveal = setTimeout(() => {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
        }, 300);

        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.05 });

        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => observer.current.observe(el));

        return () => {
            clearTimeout(forceReveal);
            observer.current?.disconnect();
        };
    }, [courseId]);

    const currentSlide = lessonSlides[currentSlideIndex];

    const handleNext = () => {
        if (currentSlideIndex < lessonSlides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
            setPracticeStatus('');
        } else {
            navigate(`/quiz/${courseId}`);
        }
    };

    const handlePrev = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
            setPracticeStatus('');
        }
    };

    const speakText = () => {
        const text = document.getElementById('lesson-text')?.innerText;
        if (text) VoiceFeatures.readText(text, { rate: 0.9, lang: i18n.language === 'hi' ? 'hi-IN' : 'en-US' });
    };

    const startPractice = () => {
        setPracticeStatus(t('speechLab.tapMic'));
        setIsListening(true);
        VoiceInput.startListening(
            (final, interim) => {
                if (final) {
                    setPracticeStatus(`${t('speechLab.transcriptionLabel')} "${final}"`);
                }
            },
            (error) => {
                setPracticeStatus(`Error: ${error}`);
                setIsListening(false);
            },
            () => {
                setIsListening(false);
            }
        );
    };

    if (error) return (
        <DashboardLayout>
            <div className="reveal" style={{ padding: '80px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <AlertTriangle size={40} color="var(--primary-orange)" />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '16px' }}>{error}</h2>
                <button className="btn button-hover-effect" onClick={() => navigate('/dashboard')} style={{ background: 'var(--primary-cyan)', color: 'black', padding: '14px 32px', borderRadius: '14px', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
                    {t('lessonPlayer.returnDashboard')}
                </button>
            </div>
        </DashboardLayout>
    );

    if (!currentSlide) return <DashboardLayout><div className="reveal" style={{ textAlign: 'center', padding: '100px' }}>Loading...</div></DashboardLayout>;

    const progressPercent = Math.round(((currentSlideIndex + 1) / lessonSlides.length) * 100);

    return (
        <DashboardLayout hideNavigation={isFocusMode}>
            {activeGame === 'matching' && (
                <MiniGames.PictureMatching
                    onClose={() => setActiveGame(null)}
                    onComplete={() => { alert(t('lessonPlayer.matchComplete')); setActiveGame(null); }}
                />
            )}
            {activeGame === 'memory' && (
                <MiniGames.MemoryAndFocus
                    onClose={() => setActiveGame(null)}
                    onComplete={() => { alert(t('lessonPlayer.memoryComplete')); setActiveGame(null); }}
                />
            )}

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                {/* Header Section */}
                <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--primary-cyan)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                        <ArrowLeft size={16}/> {t('common.back')}
                    </Link>
                    {!isFocusMode && (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn button-hover-effect" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', background: 'var(--surface-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-dark)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => setActiveGame('matching')}>
                                <Gamepad2 size={18} color="var(--primary-cyan)"/> {t('lessonPlayer.matchGame')}
                            </button>
                            <button className="btn button-hover-effect" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', background: 'var(--surface-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-dark)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => setActiveGame('memory')}>
                                <Brain size={18} color="var(--primary-purple)"/> {t('lessonPlayer.memoryGame')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Lesson Card */}
                <div className="reveal hover-3d" style={{ background: 'var(--surface-elevated)', borderRadius: '32px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', minHeight: '600px' }}>
                    {/* Visual Side */}
                    <div style={{ background: 'rgba(0,0,0,0.02)', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border-color)' }}>
                        <div style={{ width: '100%', transition: 'all 0.5s ease-in-out' }}>
                            {typeof currentSlide.visual === 'string' ? (
                                <div dangerouslySetInnerHTML={{ __html: currentSlide.visual }} />
                            ) : (
                                <div>{currentSlide.visual}</div>
                            )}
                        </div>
                        <div style={{ marginTop: '30px', padding: '8px 16px', borderRadius: '100px', background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {t('common.preview', 'Figure')} {currentSlide.id}
                        </div>
                    </div>

                    {/* Content Side */}
                    <div style={{ padding: '60px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ marginBottom: '40px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-purple)', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                                <Sparkles size={16}/> {courseTitle}
                            </div>
                            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                                {currentSlide.title}
                            </h1>
                        </div>

                        <div id="lesson-text" style={{ flex: 1, fontSize: '1.25rem', lineHeight: 1.7, color: 'var(--text-dark)', fontWeight: 500 }}>
                            {typeof currentSlide.content === 'string' ? (
                                <div className="text-content" dangerouslySetInnerHTML={{ __html: currentSlide.content }} />
                            ) : (
                                <div className="text-content">{currentSlide.content}</div>
                            )}
                        </div>

                        {/* Assistive Toolbar */}
                        <div style={{ marginTop: '50px', display: 'flex', gap: '20px', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '40px' }}>
                            <button className="btn button-hover-effect" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', borderRadius: '14px', background: 'var(--primary-cyan)', color: 'black', border: 'none', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onClick={speakText}>
                                <Volume2 size={20}/> {t('lessonPlayer.readAloud')}
                            </button>
                            <button className={`btn button-hover-effect ${isListening ? 'mic-pulse' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', borderRadius: '14px', background: isListening ? 'var(--primary-orange)' : 'var(--surface-color)', color: isListening ? 'white' : 'var(--text-dark)', border: '2px solid var(--border-color)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onClick={startPractice}>
                                <Mic size={20}/> {t('lessonPlayer.practiceSpeaking')}
                            </button>
                        </div>

                        {practiceStatus && (
                            <div className="reveal-up active" style={{ marginTop: '20px', padding: '20px', background: 'rgba(6,182,212,0.05)', borderRadius: '18px', borderLeft: '4px solid var(--primary-cyan)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Headphones size={20} color="var(--primary-cyan)"/>
                                <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.95rem' }}>{practiceStatus}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress & Controls */}
                <div className="reveal" style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) auto minmax(200px, 1fr)', alignItems: 'center', gap: '40px' }}>
                    <button className="btn button-hover-effect" onClick={handlePrev} disabled={currentSlideIndex === 0} style={{ justifySelf: 'start', padding: '12px 24px', borderRadius: '12px', background: 'none', border: 'none', color: currentSlideIndex === 0 ? 'var(--text-muted)' : 'var(--text-dark)', fontWeight: 700, fontSize: '1rem', cursor: currentSlideIndex === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: currentSlideIndex === 0 ? 0.3 : 1 }}>
                        <ArrowLeft size={18}/> {t('lessonPlayer.prevConcept')}
                    </button>

                    <div style={{ width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            <span>{t('quiz.question')} {currentSlideIndex + 1} {t('quiz.of')} {lessonSlides.length}</span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                            <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-cyan), var(--primary-purple))', borderRadius: '100px', transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}></div>
                        </div>
                    </div>

                    <button className="btn button-hover-effect" onClick={async () => {
                        const percent = Math.round(((currentSlideIndex + 1) / lessonSlides.length) * 100);
                        try {
                            const res = await userAPI.updateProgress(courseId, percent);
                            if (res.data) {
                                updateUser({
                                    gamification: res.data.gamification,
                                    progress: res.data.progress,
                                    recentActivity: res.data.recentActivity
                                });
                            }
                        } catch (e) {
                            console.error("Failed to save progress", e);
                        }
                        handleNext();
                    }} style={{ justifySelf: 'end', padding: '16px 36px', borderRadius: '16px', background: 'var(--text-dark)', color: 'white', border: 'none', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        {currentSlideIndex < lessonSlides.length - 1 ? (
                            <>{t('lessonPlayer.nextConcept')} <ArrowRight size={20}/></>
                        ) : (
                            <>{t('lessonPlayer.takeQuiz')} <FileSignature size={20}/></>
                        )}
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
                .reveal-up { opacity: 0; transform: translateY(20px); transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
                .reveal.active, .reveal-up.active { opacity: 1; transform: translate(0); }
                .hover-3d:hover { transform: translateY(-8px) scale(1.005); box-shadow: 0 40px 80px rgba(0,0,0,0.1) !important; border-color: var(--primary-purple); }
                .mic-pulse { animation: pulse-ring 1.5s infinite; }
                @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.4); } 70% { box-shadow: 0 0 0 20px rgba(251, 146, 60, 0); } 100% { box-shadow: 0 0 0 0 rgba(251, 146, 60, 0); } }
                .button-hover-effect:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
                .button-hover-effect:active { transform: translateY(0); }
                .text-content p { margin-bottom: 1.5rem; }
                .text-content ul { padding-left: 1.5rem; margin-bottom: 1.5rem; }
                .text-content li { margin-bottom: 0.8rem; }
            `}} />
        </DashboardLayout>
    );
};

export default LessonPlayer;
