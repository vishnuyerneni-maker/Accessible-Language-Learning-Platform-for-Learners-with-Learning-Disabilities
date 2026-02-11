import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUser = await api.getCurrentUser();
                setUser(currentUser);

                // Fetch courses
                const allCourses = await api.getCourses();

                // Merge progress from user object into courses
                const enrichedCourses = allCourses.map(course => {
                    const userProgress = currentUser.progress ? currentUser.progress[course.id] : 0;
                    return {
                        ...course,
                        progress: userProgress || 0,
                        // If parent locked logic exists, it would be here too
                        // For now assuming simple student view
                        locked: course.locked
                    };
                });

                setCourses(enrichedCourses);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
                // Optionally redirect to login if 401
            }
        };

        fetchData();
    }, []);

    if (!user) return <div className="container" style={{ padding: '50px', textAlign: 'center' }}>Loading Dashboard... <Link to="/">Log in</Link></div>;

    // Helper for gamification display
    const xp = user.gamification?.xp || 0;
    const level = user.gamification?.level || 1;
    const streak = user.gamification?.currentStreak || 0;
    const badges = user.gamification?.badges || [];

    return (
        <Layout>
            <div className="container" style={{ margin: '0 auto', maxWidth: '1400px', padding: '20px' }}>
                {/* Hero Welcome Section */}
                <section className="card card-gradient animate-fade-in" style={{ padding: '40px', marginBottom: '40px', borderRadius: 'var(--radius-xl)', position: 'relative', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-3d-lg)', background: 'var(--gradient-aurora)' }}>
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '250px', height: '250px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', filter: 'blur(60px)', animation: 'float 10s infinite alternate' }}></div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '10px', color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Welcome Back! 👋</h1>
                        <p style={{ fontSize: '1.6rem', margin: 0, opacity: 1, fontWeight: 600, color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>Ready for another amazing learning adventure?</p>
                    </div>
                </section>

                {/* Gamification Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <div className="stat-card animate-scale-in" style={{ background: 'var(--gradient-galaxy)', border: 'none' }}>
                        <div className="stat-icon">⚡</div>
                        <div className="stat-value" style={{ textShadow: 'var(--text-shadow-sm)' }}>{xp}</div>
                        <div className="stat-label" style={{ fontWeight: 600 }}>Total XP</div>
                    </div>
                    <div className="stat-card animate-scale-in delay-1" style={{ background: 'var(--gradient-candy)', border: 'none' }}>
                        <div className="stat-icon">🎯</div>
                        <div className="stat-value" style={{ textShadow: 'var(--text-shadow-sm)' }}>{level}</div>
                        <div className="stat-label" style={{ fontWeight: 600 }}>Level</div>
                    </div>
                    <div className="stat-card animate-scale-in delay-2" style={{ background: 'var(--gradient-sunrise)', border: 'none' }}>
                        <div className="stat-icon streak-fire">🔥</div>
                        <div className="stat-value" style={{ textShadow: 'var(--text-shadow-sm)' }}>{streak}</div>
                        <div className="stat-label" style={{ fontWeight: 600 }}>Day Streak</div>
                    </div>
                    <div className="stat-card animate-scale-in delay-3" style={{ background: 'var(--gradient-ocean)', border: 'none' }}>
                        <div className="stat-icon">🏆</div>
                        <div className="stat-value" style={{ textShadow: 'var(--text-shadow-sm)' }}>{badges.length}</div>
                        <div className="stat-label" style={{ fontWeight: 600 }}>Badges Earned</div>
                    </div>
                </div>

                {/* Visual Divider */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '50px 0', opacity: 0.8 }}>
                    <div style={{ flex: 1, height: '3px', background: 'var(--gradient-aurora)', borderRadius: '10px' }}></div>
                    <div style={{ margin: '0 20px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>Learning Centers</div>
                    <div style={{ flex: 1, height: '3px', background: 'var(--gradient-aurora)', borderRadius: '10px' }}></div>
                </div>

                {/* Specialized Centers using CSS Grid directly for alignment */}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    <div className="card" style={{ background: 'var(--surface-color)', color: 'var(--text-color)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '2px solid var(--border-color)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🧠</div>
                        <h3>Dyslexia Center</h3>
                        <p style={{ margin: '10px 0', color: 'var(--text-muted)' }}>Specialized tools including phonics, tracing, and reading assistance.</p>
                        <Link to="/dyslexia-center" className="btn btn-secondary" style={{ marginTop: '10px', display: 'inline-block' }}><strong>Open Center</strong></Link>
                    </div>

                    <div className="card" style={{ background: 'var(--surface-color)', color: 'var(--text-color)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '2px solid var(--border-color)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎤</div>
                        <h3>Speech Lab</h3>
                        <p style={{ margin: '10px 0', color: 'var(--text-muted)' }}>Practice pronunciation with real-time feedback.</p>
                        <Link to="/speech-practice" className="btn btn-primary" style={{ marginTop: '10px', display: 'inline-block' }}><strong>Start Speaking</strong></Link>
                    </div>
                </div>

                {/* Courses Section */}
                <section style={{ marginBottom: '50px' }}>
                    <div className="course-section-header">
                        <h2 className="course-section-title"><span className="icon-bounce">📖</span> Your Learning Adventures</h2>
                    </div>
                    <div className="course-cards-grid">
                        {courses.map((course, index) => (
                            <article key={course.id} className="course-card-modern animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className={`course-card-illustration ${course.gradient || 'gradient-blue'}`}>
                                    <span className="illustration-icon">{course.image || '📚'}</span>
                                    {course.badge && <span className={`course-badge ${course.badge}`}>{course.badge.toUpperCase()}</span>}
                                </div>
                                <div className="course-card-body">
                                    <h3 className="course-card-title">{course.title}</h3>
                                    <p className="course-card-description">{course.description}</p>
                                    <div className="course-progress-wrapper">
                                        <div className="course-progress-header">
                                            <span className="course-progress-label">Progress</span>
                                            <span className="course-progress-percent">{course.progress}%</span>
                                        </div>
                                        <div className="course-progress-bar">
                                            <div className="course-progress-fill" style={{ width: `${course.progress}%` }}></div>
                                        </div>
                                    </div>
                                    <button
                                        className={`course-action-btn ${course.locked ? 'btn-locked' : 'btn-start'}`}
                                        onClick={() => !course.locked && (window.location.href = `/lesson/${course.id}`)}
                                        disabled={course.locked}
                                        style={{
                                            opacity: course.locked ? 0.6 : 1,
                                            cursor: course.locked ? 'not-allowed' : 'pointer',
                                            filter: course.locked ? 'grayscale(0.5)' : 'none'
                                        }}
                                    >
                                        {course.locked ? '🔒 Locked by Parent' : '🚀 Start Learning'}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </Layout >
    );
};

export default Dashboard;
