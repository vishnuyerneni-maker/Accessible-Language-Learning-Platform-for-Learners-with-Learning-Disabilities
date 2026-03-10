import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { COURSE_DATA } from '../data/course_data';
import { VoiceFeatures, VoiceInput } from '../utils/voice';
import { GamificationEngine } from '../utils/gamification';
import { MiniGames } from '../components/MiniGames';

const LessonPlayer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [lessonSlides, setLessonSlides] = useState([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [courseTitle, setCourseTitle] = useState('');
    const [practiceStatus, setPracticeStatus] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [activeGame, setActiveGame] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const course = COURSE_DATA[courseId || 'course_101'];
        if (course) {
            setLessonSlides(course.lessons);
            setCourseTitle(course.title);
            setError(null);
        } else {
            setError("Course not found or coming soon!");
        }
    }, [courseId]);

    const currentSlide = lessonSlides[currentSlideIndex];

    const handleNext = () => {
        if (currentSlideIndex < lessonSlides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
        } else {
            navigate(`/quiz/${courseId}`);
        }
    };

    const handlePrev = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
        }
    };

    const speakText = () => {
        const text = document.getElementById('lesson-text')?.innerText;
        if (text) VoiceFeatures.readText(text);
    };

    const startPractice = () => {
        setPracticeStatus("Listening...");
        setIsListening(true);
        VoiceInput.startListening(
            (final, interim) => {
                if (final) {
                    setPracticeStatus(`You said: "${final}"`);
                    // Logic to check correctness could go here
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
        <Layout>
            <div className="container" style={{ padding: '50px', textAlign: 'center' }}>
                <h2>⚠️ {error}</h2>
                <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ marginTop: '20px' }}>
                    Return to Dashboard
                </button>
            </div>
        </Layout>
    );

    if (!currentSlide) return <Layout><div className="container">Loading...</div></Layout>;

    return (
        <Layout>
            {activeGame === 'matching' && (
                <MiniGames.PictureMatching
                    onClose={() => setActiveGame(null)}
                    onComplete={() => { alert("Awesome Job! +50 XP"); setActiveGame(null); }}
                />
            )}
            {activeGame === 'memory' && (
                <MiniGames.MemoryAndFocus
                    onClose={() => setActiveGame(null)}
                    onComplete={() => { alert("Memory Master! +50 XP"); setActiveGame(null); }}
                />
            )}

            <div className="container" style={{ marginTop: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <Link to="/dashboard" className="btn btn-outline">&larr; Back</Link>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setActiveGame('matching')}>🎮 Match Game</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setActiveGame('memory')}>🧠 Memory Game</button>
                    </div>
                </div>

                <div className="card lesson-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
                    {/* Visual Aid */}
                    <div>
                        <div dangerouslySetInnerHTML={{ __html: currentSlide.visual }} />
                        <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            Fig {currentSlide.id}
                        </p>
                    </div>

                    {/* Content */}
                    <div>
                        <h1 style={{ marginBottom: '20px', color: 'var(--primary-purple)' }}>{currentSlide.title}</h1>
                        <div id="lesson-text" className="text-content" style={{ fontSize: '1.3rem', lineHeight: 1.8, color: 'var(--text-dark)' }} dangerouslySetInnerHTML={{ __html: currentSlide.content }} />

                        {/* Assistive Actions */}
                        <div style={{ marginTop: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <button className="btn btn-primary btn-pulse" onClick={speakText}>
                                🔊 Read Aloud
                            </button>
                            <button className={`btn btn-outline ${isListening ? 'listening' : ''}`} onClick={startPractice}>
                                🎙️ Practice Speaking
                            </button>
                        </div>
                        {practiceStatus && (
                            <div className="animate-fade-in" style={{ marginTop: '15px', padding: '15px', background: 'var(--surface-elevated)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary-cyan)' }}>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>{practiceStatus}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="controls" style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                    <button className="btn btn-ghost" onClick={handlePrev} disabled={currentSlideIndex === 0}>Previous Concept</button>
                    <button className="btn btn-primary btn-lg btn-3d" onClick={handleNext}>
                        {currentSlideIndex < lessonSlides.length - 1 ? 'Next Concept →' : 'Take Quiz 📝'}
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default LessonPlayer;
