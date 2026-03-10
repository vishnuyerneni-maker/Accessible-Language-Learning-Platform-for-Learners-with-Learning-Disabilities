import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { courseAPI, userAPI, adminAPI } from '../utils/api';
import IconMapping from '../components/IconMapping';
import { Pencil, Trash2, Plus, Users, BookOpen, Presentation, Award, TrendingUp, ChevronRight, Star, Zap, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TeacherDashboard = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [activeTab, setActiveTab] = useState('courses');
    const [stats, setStats] = useState({ totalStudents: 0, totalCourses: 0, avgProgress: 0, totalXP: 0 });

    useEffect(() => {
        if (user && user.role !== 'teacher') {
            navigate('/');
        } else {
            loadDashboardData();
        }
    }, [user, navigate]);

    // Intersection Observer for reveal animations
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const handleIntersect = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);
        const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [activeTab]);

    const loadDashboardData = async () => {
        try {
            const [coursesRes, usersRes, statsRes] = await Promise.all([
                courseAPI.getAll(),
                userAPI.getAll(),
                adminAPI.getStats()
            ]);

            const teacherCourses = coursesRes.data || [];
            const allUsers = usersRes.data || [];
            const statsData = statsRes.data || {};

            const studentUsers = allUsers.filter(u => u.role === 'student');

            setCourses(teacherCourses);
            setStudents(studentUsers);
            setStats({
                totalStudents: statsData.activeStudents || studentUsers.length,
                totalCourses: statsData.totalCourses || teacherCourses.length,
                avgProgress: statsData.avgProgress || 0,
                totalXP: statsData.totalXP || 0
            });
        } catch (error) {
            console.error("Failed to load teacher data", error);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Delete this course?')) {
            try {
                await courseAPI.delete(courseId);
                loadDashboardData();
            } catch (e) { alert("Failed to delete course"); }
        }
    };

    const getLevelColor = (xp) => {
        if (xp >= 2000) return 'var(--primary-yellow)';
        if (xp >= 1000) return 'var(--primary-purple)';
        if (xp >= 500) return 'var(--primary-cyan)';
        return 'var(--primary-green)';
    };

    const getLevel = (xp) => Math.floor(xp / 1000) + 1;

    return (
        <DashboardLayout>
            <div className="container" style={{ padding: '40px 20px' }}>
                <header className="reveal" style={{ marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '30px' }}>
                        <div>
                            <h1 className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: '10px' }}>
                                {t('teacher.hubTitle')} <GraduationCap size={40} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--primary-purple)' }} />
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>
                                {t('teacher.welcome', { name: user?.name })}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            {[
                                { value: stats.totalStudents, label: t('teacher.stats.students'), color: 'var(--primary-purple)', bg: 'rgba(124,58,237,0.05)', border: 'rgba(124,58,237,0.1)' },
                                { value: stats.totalCourses, label: t('teacher.stats.courses'), color: 'var(--primary-blue)', bg: 'rgba(37,99,235,0.05)', border: 'rgba(37,99,235,0.1)' },
                                { value: `${stats.avgProgress}%`, label: t('teacher.stats.avgProgress'), color: 'var(--primary-green)', bg: 'rgba(16,185,129,0.05)', border: 'rgba(16,185,129,0.1)' },
                                { value: stats.totalXP, label: t('teacher.stats.xpEarned'), color: 'var(--primary-yellow)', bg: 'rgba(255,193,7,0.05)', border: 'rgba(255,193,7,0.1)' },
                            ].map(s => (
                                <div key={s.label} className="hover-lift" style={{
                                    padding: '15px 25px', borderRadius: '18px', background: 'var(--surface-color)',
                                    border: `1px solid ${s.border}`, textAlign: 'center', minWidth: '110px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                                }}>
                                    <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: 900, color: s.color }}>{s.value}</span>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, marginTop: '4px' }}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </header>

                <div className="reveal card-glass p-0 overflow-hidden shadow-2xl" style={{ borderRadius: '24px', border: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
                    <div style={{ display: 'flex', background: 'rgba(124, 58, 237, 0.05)', borderBottom: '1px solid var(--border-color)' }}>
                        {[
                            { key: 'courses', icon: <BookOpen size={18}/>, label: t('teacher.tabs.myCourses') },
                            { key: 'students', icon: <Users size={18}/>, label: t('teacher.tabs.studentInsights') },
                        ].map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                                padding: '20px 30px', fontWeight: 800, border: 'none',
                                borderBottom: activeTab === tab.key ? '4px solid var(--primary-cyan)' : '4px solid transparent',
                                background: activeTab === tab.key ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
                                color: activeTab === tab.key ? 'var(--primary-cyan)' : 'var(--text-muted)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontSize: '0.95rem'
                            }}>
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ padding: '40px' }}>
                        {activeTab === 'courses' && (
                            <div className="tab-content-container reveal">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>{t('teacher.courses.library')}</h3>
                                    <button onClick={() => navigate('/teacher/course-builder/new')} className="btn btn-primary btn-3d" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '12px', fontWeight: 800 }}>
                                        <Plus size={20}/> {t('teacher.courses.newCourse')}
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
                                    {courses.map((c, i) => (
                                        <div key={c.id} className="reveal card-neu hover-lift" style={{
                                            padding: '25px', borderRadius: '20px',
                                            display: 'flex', flexDirection: 'column',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: '1px solid rgba(0,0,0,0.03)'
                                        }}>
                                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' }}>
                                                <div style={{ display: 'flex', padding: '14px', background: 'rgba(124, 58, 237, 0.05)', borderRadius: '16px', border: '1px solid rgba(124, 58, 237, 0.1)' }}>
                                                    <IconMapping iconName={c.image} size={32} color="var(--primary-purple)" />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>{c.title}</h4>
                                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.description}</p>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '18px', borderTop: '1px solid var(--border-color)' }}>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                                                    <Presentation size={16} /> {c.totalModules} {t('teacher.courses.lessons')}
                                                </span>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => navigate(`/teacher/course-builder/${c.id}`)} style={{ padding: '10px', borderRadius: '12px', background: 'none', border: '1px solid var(--border-color)', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s' }} className="hover-lift"><Pencil size={18} /></button>
                                                    <button onClick={() => handleDeleteCourse(c.id)} style={{ padding: '10px', borderRadius: '12px', background: 'none', border: '1px solid rgba(239, 68, 68, 0.1)', cursor: 'pointer', color: 'var(--error-color)', transition: 'all 0.2s' }} className="hover-lift"><Trash2 size={18} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {courses.length === 0 && (
                                        <div style={{ gridColumn: '1 / -1', padding: '80px', textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: '24px', border: '2px dashed var(--border-color)' }}>
                                            <BookOpen size={60} color="var(--text-muted)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                                            <h4 style={{ color: 'var(--text-muted)', fontSize: '1.3rem', fontWeight: 800 }}>{t('teacher.courses.noCourses')}</h4>
                                            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('teacher.courses.getStarted')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'students' && (
                            <div className="tab-content-container reveal">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>{t('teacher.students.progressInsights')}</h3>
                                    <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 700 }}>{students.length} {t('teacher.students.enrolled')}</span>
                                </div>

                                {students.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '80px', background: 'rgba(0,0,0,0.02)', borderRadius: '24px', border: '2px dashed var(--border-color)' }}>
                                        <Users size={60} color="var(--text-muted)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                                        <h4 style={{ color: 'var(--text-muted)', fontSize: '1.3rem', fontWeight: 800 }}>{t('teacher.students.noStudents')}</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600 }}>{t('teacher.students.noStudentsDesc')}</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        {students.map((s, i) => {
                                            const xp = s.gamification?.xp || 0;
                                            const level = getLevel(xp);
                                            const streak = s.gamification?.currentStreak || 0;
                                            const badges = s.gamification?.badges || [];
                                            const progressEntries = Object.entries(s.progress || {});
                                            const completedCourses = progressEntries.filter(([, v]) => v >= 100).length;
                                            const avgProg = progressEntries.length > 0
                                                ? Math.round(progressEntries.reduce((a, [, v]) => a + Number(v || 0), 0) / progressEntries.length)
                                                : 0;

                                            return (
                                                <div key={s.id} className="reveal card-neu hover-lift" style={{
                                                    padding: '25px 35px', borderRadius: '24px',
                                                    background: 'var(--surface-color)',
                                                    border: '1px solid rgba(0,0,0,0.03)',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px', flexWrap: 'wrap' }}>
                                                        <div style={{
                                                            width: '60px', height: '60px', borderRadius: '20px', flexShrink: 0,
                                                            background: `linear-gradient(135deg, ${getLevelColor(xp)}, var(--primary-cyan))`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: 'white', fontWeight: 900, fontSize: '1.4rem',
                                                            boxShadow: `0 8px 20px ${getLevelColor(xp)}40`
                                                        }}>
                                                            {(s.name || s.username || 'U')[0].toUpperCase()}
                                                        </div>

                                                        <div style={{ flex: 1, minWidth: '150px' }}>
                                                            <div style={{ fontWeight: 900, color: 'var(--text-dark)', fontSize: '1.2rem' }}>{s.name || s.username}</div>
                                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.email}</div>
                                                        </div>

                                                        <div style={{ textAlign: 'center', minWidth: '80px', padding: '10px 20px', background: 'rgba(0,0,0,0.02)', borderRadius: '15px' }}>
                                                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: getLevelColor(xp) }}>Lv.{level}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>{xp} XP</div>
                                                        </div>

                                                        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-orange)' }}>🔥 {streak}</div>
                                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>{t('teacher.students.streak')}</div>
                                                            </div>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-green)' }}>{completedCourses}</div>
                                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>{t('teacher.students.done')}</div>
                                                            </div>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-pink)' }}>{badges.length}</div>
                                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>{t('teacher.students.badges')}</div>
                                                            </div>
                                                        </div>

                                                        <div style={{ minWidth: '180px', flex: 1 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800 }}>{t('teacher.students.avgProgress')}</span>
                                                                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--primary-cyan)' }}>{avgProg}%</span>
                                                            </div>
                                                            <div style={{ height: '10px', background: 'var(--surface-elevated)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.03)' }}>
                                                                <div style={{
                                                                    width: `${avgProg}%`, height: '100%', borderRadius: '10px',
                                                                    background: 'linear-gradient(90deg, var(--primary-purple), var(--primary-cyan))',
                                                                    transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                                                                }} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {progressEntries.length > 0 && (
                                                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed var(--border-color)' }}>
                                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                                {progressEntries.map(([courseId, pct]) => {
                                                                    const course = courses.find(c => c.id === courseId);
                                                                    return (
                                                                        <div key={courseId} className="hover-3d" style={{
                                                                            display: 'flex', alignItems: 'center', gap: '8px',
                                                                            padding: '6px 15px', borderRadius: '30px', fontSize: '0.8rem',
                                                                            background: Number(pct) >= 100 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(124, 58, 237, 0.05)',
                                                                            border: `1px solid ${Number(pct) >= 100 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(124, 58, 237, 0.1)'}`,
                                                                            color: Number(pct) >= 100 ? 'var(--primary-green)' : 'var(--text-muted)',
                                                                            fontWeight: 800
                                                                        }}>
                                                                            {Number(pct) >= 100 ? '⭐' : '📖'}
                                                                            <span style={{ color: 'var(--text-dark)' }}>
                                                                                {course?.title || courseId}
                                                                            </span>
                                                                            <span style={{ color: 'var(--primary-cyan)' }}>{Math.round(Number(pct))}%</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .text-gradient {
                    background: linear-gradient(135deg, var(--primary-purple), var(--primary-pink), var(--primary-cyan));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .tab-content-container {
                    animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .reveal, .reveal-left, .reveal-right {
                    opacity: 0;
                    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .reveal { transform: translateY(30px); }
                .reveal-left { transform: translateX(-30px); }
                .reveal-right { transform: translateX(30px); }
                .reveal.active, .reveal-left.active, .reveal-right.active {
                    opacity: 1;
                    transform: translate(0, 0);
                }
                .hover-3d {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .hover-3d:hover {
                    transform: perspective(1000px) rotateX(2deg) rotateY(2deg) translateY(-2px);
                }
                .hover-lift {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .hover-lift:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(124, 58, 237, 0.1);
                }
            `}} />
        </DashboardLayout>
    );
};

export default TeacherDashboard;
