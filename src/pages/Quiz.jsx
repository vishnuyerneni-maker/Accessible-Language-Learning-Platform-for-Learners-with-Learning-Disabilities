import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { MockBackend } from '../utils/MockBackend';
import { GeminiService } from '../utils/GeminiService';
import { VoiceFeatures, VoiceInput } from '../utils/voice';
import { COURSE_DATA } from '../data/course_data';

const Quiz = () => {
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

    // Config
    const courseData = COURSE_DATA[courseId];
    const TOTAL_QUESTIONS = courseData?.quiz?.length || 3;
    const course = MockBackend.getCourses().find(c => c.id === courseId) || { title: 'General Knowledge' };

    useEffect(() => {
        loadQuestion();
        return () => {
            if (VoiceFeatures && VoiceFeatures.stopSpeaking) {
                VoiceFeatures.stopSpeaking();
            }
            if (VoiceInput && VoiceInput.stopListening) {
                VoiceInput.stopListening();
            }
        };
    }, [currentQuestionIndex]);

    const loadQuestion = async () => {
        setLoading(true);
        setFeedback(null);
        setTranscript('');
        setQuestionData(null);

        try {
            // 1. Try to get curated question from Course Data
            const courseData = COURSE_DATA[courseId];
            if (courseData && courseData.quiz && courseData.quiz[currentQuestionIndex]) {
                setQuestionData(courseData.quiz[currentQuestionIndex]);
                setLoading(false);
                return;
            }

            // 2. Use Gemini AI (Fallback)
            const data = await GeminiService.generateQuizQuestion(course.title);
            setQuestionData(data);
        } catch (error) {
            console.error("Quiz load error", error);
            setQuestionData({
                type: 'multiple_choice',
                question: 'Basic Check: Are you ready to learn?',
                options: ['Yes', 'No', 'Maybe', 'Always'],
                correctIndex: 0,
                explanation: 'Positive attitude is key!'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOptionClick = (index) => {
        if (feedback) return; // Already answered

        const isCorrect = index === questionData.correctIndex;
        if (isCorrect) {
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
            VoiceFeatures.readText("Correct!");
        } else {
            VoiceFeatures.readText("Incorrect.");
        }

        setFeedback({
            isCorrect,
            message: isCorrect ? "Correct! Well done." : "Incorrect.",
            explanation: questionData.explanation
        });
    };

    const handleVoiceCheck = () => {
        if (listening) {
            VoiceInput.stopListening();
            setListening(false);
            return;
        }

        setListening(true);
        setTranscript('');

        VoiceInput.startListening((text, isFinal) => {
            setTranscript(text);
            if (isFinal) {
                setListening(false);
                checkVoiceAnswer(text);
            }
        });
    };

    const checkVoiceAnswer = (spokenText) => {
        const target = questionData.targetSentence.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
        const spoken = spokenText.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();

        // Simple fuzzy match or exact inclusion
        const isCorrect = spoken.includes(target) || target.includes(spoken); // Very lenient for kids

        if (isCorrect) {
            setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
            VoiceFeatures.readText("Great job!");
        } else {
            VoiceFeatures.readText("Nice try.");
        }

        setFeedback({
            isCorrect,
            message: isCorrect ? "Great pronunciation!" : "Not quite. Try saying: \"" + questionData.targetSentence + "\"",
            explanation: questionData.explanation
        });
    };

    const nextQuestion = () => {
        if (currentQuestionIndex + 1 >= TOTAL_QUESTIONS) {
            finishQuiz();
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const finishQuiz = () => {
        setQuizFinished(true);
        const finalScorePercent = Math.round(((score.correct + (feedback?.isCorrect ? 1 : 0)) / TOTAL_QUESTIONS) * 100); // Add last one if correct

        // Save result
        MockBackend.submitQuiz(course.title, finalScorePercent);
        if (finalScorePercent >= 50) {
            MockBackend.updateProgress(courseId, 100);
        }
    };

    if (quizFinished) {
        const finalPercent = Math.round((score.correct / TOTAL_QUESTIONS) * 100);
        return (
            <Layout>
                <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
                    <div className="card animate-scale-in">
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{finalPercent >= 50 ? '🎉' : '💪'}</div>
                        <h2>Quiz Complete!</h2>
                        <p style={{ fontSize: '1.5rem', margin: '20px 0' }}>You scored {finalPercent}%</p>
                        <p style={{ color: 'var(--text-muted)' }}>{finalPercent >= 50 ? "You've mastered this lesson!" : "Keep practicing, you'll get it!"}</p>

                        <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <button onClick={() => window.location.reload()} className="btn btn-outline">Try Again</button>
                            <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container" style={{ maxWidth: '800px', marginTop: '40px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <Link to="/dashboard" className="btn btn-outline">Quit Quiz</Link>
                    <div className="card" style={{ padding: '10px 20px', margin: 0 }}>
                        Score: {score.correct}/{currentQuestionIndex + 1}
                    </div>
                </header>

                <div className="card animate-fade-in">
                    <div style={{ marginBottom: '20px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                        Question {currentQuestionIndex + 1} of {TOTAL_QUESTIONS}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '15px' }} className="spin">✨</div>
                            <p>AI is generating your question...</p>
                        </div>
                    ) : (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '30px' }}>{questionData.question}</h2>

                            {questionData.type === 'multiple_choice' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {questionData.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionClick(idx)}
                                            disabled={feedback !== null}
                                            className="option-btn" // Needs CSS or style
                                            style={{
                                                padding: '20px',
                                                textAlign: 'left',
                                                fontSize: '1.1rem',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: 'var(--radius-md)',
                                                background: feedback && idx === questionData.correctIndex ? '#d4edda' :
                                                    feedback && !feedback.isCorrect && idx === questionData.options.indexOf(feedback.selected) ? '#f8d7da' : 'var(--surface-color)',
                                                cursor: feedback ? 'default' : 'pointer'
                                            }}
                                        >
                                            <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{String.fromCharCode(65 + idx)})</span> {option}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '30px', background: 'var(--surface-hover)', borderRadius: 'var(--radius-lg)' }}>
                                    <h3 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>"{questionData.targetSentence}"</h3>

                                    <button
                                        onClick={handleVoiceCheck}
                                        disabled={feedback !== null}
                                        className="btn"
                                        style={{
                                            width: '80px', height: '80px', borderRadius: '50%', fontSize: '2rem',
                                            background: listening ? '#dc3545' : 'var(--secondary-color)',
                                            color: 'white', border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                                        }}
                                    >
                                        {listening ? '⏹️' : '🎤'}
                                    </button>
                                    <p style={{ marginTop: '15px', color: 'var(--text-muted)' }}>
                                        {listening ? "Listening..." : "Click microphone and speak"}
                                    </p>
                                    {transcript && <p style={{ marginTop: '10px', fontStyle: 'italic' }}>"{transcript}"</p>}
                                </div>
                            )}

                            {feedback && (
                                <div className="animate-scale-in" style={{ marginTop: '30px', padding: '20px', background: feedback.isCorrect ? '#d4edda' : '#f8d7da', borderRadius: 'var(--radius-md)', border: `1px solid ${feedback.isCorrect ? '#c3e6cb' : '#f5c6cb'}` }}>
                                    <h4 style={{ color: feedback.isCorrect ? '#155724' : '#721c24', marginBottom: '5px' }}>{feedback.message}</h4>
                                    <p style={{ margin: 0, color: '#555' }}>{feedback.explanation}</p>

                                    <button onClick={nextQuestion} className="btn btn-primary" style={{ marginTop: '15px' }}>
                                        {currentQuestionIndex + 1 < TOTAL_QUESTIONS ? 'Next Question →' : 'Finish Quiz →'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Quiz;
