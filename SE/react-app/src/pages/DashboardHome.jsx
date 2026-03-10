import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import IconMapping from '../components/IconMapping';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Trophy, Flame, Target, Zap, BookOpen, BrainCircuit, Bell, X, CheckCircle2, Star, Rocket } from 'lucide-react';
import { courseAPI, announcementAPI } from '../utils/api';

const DashboardHome = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [dismissedAlerts, setDismissedAlerts] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const observer = useRef(null);

    useEffect(() => {
        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        elements.forEach(el => observer.current.observe(el));

        return () => observer.current?.disconnect();
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [coursesRes, announcementsRes] = await Promise.all([
                    courseAPI.getAll(),
                    announcementAPI.getAll()
                ]);
                setAllCourses(coursesRes.data || []);
                setAnnouncements((announcementsRes.data || []).filter(a => !dismissedAlerts.includes(a._id)));
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            }
        };
        loadData();
    }, [dismissedAlerts]);

    if (!user) return <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>Initializing...</div>;

    const xp = user.gamification?.xp || 0;
    const level = user.gamification?.level || 1;
    const streak = user.gamification?.currentStreak || 0;
    const badges = user.gamification?.badges || [];
    
    // Calculate progress for next level (mock logic: 1000xp per level)
    const xpForNextLevel = level * 1000;
    const currentLevelProgress = (xp % 1000) / 1000;
    const progressCircumference = 2 * Math.PI * 38; // Radius 38
    const progressOffset = progressCircumference - (currentLevelProgress * progressCircumference);

    // ── Dynamic: find the user's next uncompleted course ──
    const userProgress = user.progress || {};
    const nextUnfinished = allCourses.find(c => (userProgress[c.id] || 0) < 100);
    const completedCount = allCourses.filter(c => (userProgress[c.id] || 0) >= 100).length;
    const overallPct = allCourses.length
        ? Math.round(allCourses.reduce((s, c) => s + (userProgress[c.id] || 0), 0) / allCourses.length)
        : 0;

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                {/* Announcement Banners from Admin */}
                {announcements.length > 0 && (
                    <div className="reveal" style={{ marginBottom: '30px' }}>
                        {announcements.map(a => (
                            <div key={a._id} className="hover-3d" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', marginBottom: '12px', background: 'rgba(251, 146, 60, 0.08)', border: '1px solid rgba(251, 146, 60, 0.2)', borderLeft: '5px solid var(--primary-orange)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(251, 146, 60, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Bell size={18} color="var(--primary-orange)" className="animate-pulse" />
                                    </div>
                                    <span style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: '1rem' }}>{a.text}</span>
                                </div>
                                <button onClick={() => setDismissedAlerts(d => [...d, a._id])} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '5px', borderRadius: '50%', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'none'}><X size={18}/></button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Main Hero Section */}
                <section className="reveal" style={{ marginBottom: '40px' }}>
                    <div style={{ padding: '48px', background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.06) 100%)', borderRadius: '28px', border: '1px solid rgba(124,58,237,0.2)', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent)', borderRadius: '50%' }}></div>
                        <div style={{ position: 'absolute', bottom: '-20px', left: '10%', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(124,58,237,0.1), transparent)', borderRadius: '50%' }}></div>
                        
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <span style={{ padding: '6px 12px', background: 'rgba(124,58,237,0.1)', color: 'var(--primary-purple)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>STUDENT PORTAL</span>
                                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(124,58,237,0.2), transparent)' }}></div>
                            </div>
                            <h1 style={{ fontSize: '2.8rem', marginBottom: '12px', color: 'var(--text-dark)', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <BrainCircuit size={48} color="var(--primary-cyan)" /> {t('studentDashboard.welcome', { name: user?.name?.split(' ')[0] || user?.username })}
                            </h1>
                            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
                                {t('studentDashboard.readyToContinue')} <Rocket size={20} style={{ verticalAlign: 'middle', marginLeft: '5px' }} />
                            </p>
                        </div>
                    </div>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px', alignItems: 'start' }}>
                    
                    {/* LEFT COLUMN: Course Progress */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        
                        <section className="reveal-left">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, fontWeight: 700 }}>{t('studentDashboard.currentPath')}</h3>
                                <Link to="/courses" style={{ color: 'var(--primary-cyan)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {t('studentDashboard.browseLibrary')} <ArrowRight size={14} />
                                </Link>
                            </div>
                            
                            {nextUnfinished ? (
                                <Link
                                    to={`/lesson/${nextUnfinished.id}`}
                                    className="hover-3d"
                                    style={{ display: 'block', textDecoration: 'none', background: 'var(--surface-elevated)', borderRadius: '24px', padding: '32px', border: '2px solid rgba(6,182,212,0.3)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', color: 'inherit', boxShadow: '0 10px 30px rgba(6,182,212,0.1)', position: 'relative' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(124,58,237,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--primary-cyan)', fontSize: '2rem', flexShrink: 0, boxShadow: '0 8px 16px rgba(6,182,212,0.2)' }}>
                                            {typeof nextUnfinished.image === 'string' && nextUnfinished.image.length <= 4
                                                ? nextUnfinished.image
                                                : <BookOpen size={36} color="var(--primary-cyan)" />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-cyan)', textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(6,182,212,0.1)', padding: '4px 12px', borderRadius: '30px' }}>{t('studentDashboard.continueBtn')}</span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('studentDashboard.completePct', { pct: userProgress[nextUnfinished.id] || 0 })}</span>
                                            </div>
                                            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.6rem', color: 'var(--text-dark)', fontWeight: 800, letterSpacing: '-0.01em' }}>{nextUnfinished.title}</h4>
                                            <p style={{ margin: '0 0 20px 0', color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.5' }}>{nextUnfinished.description}</p>
                                            
                                            <div style={{ height: '10px', background: 'rgba(6,182,212,0.1)', borderRadius: '10px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                                                <div style={{ width: `${userProgress[nextUnfinished.id] || 0}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-cyan), var(--primary-purple))', borderRadius: '10px', transition: 'width 1s cubic-bezier(0.65, 0, 0.35, 1)' }} />
                                            </div>
                                        </div>
                                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-cyan)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(6,182,212,0.4)', transition: 'transform 0.2s' }}>
                                            <ArrowRight size={28} />
                                        </div>
                                    </div>
                                </Link>
                            ) : (
                                <div className="reveal hover-3d" style={{ padding: '60px 40px', textAlign: 'center', background: 'rgba(6,182,212,0.05)', border: '2px dashed rgba(6,182,212,0.3)', borderRadius: '24px' }}>
                                    <div style={{ width: '80px', height: '80px', background: 'rgba(6,182,212,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                        <CheckCircle2 size={48} color="var(--primary-cyan)" className="animate-pulse" />
                                    </div>
                                    <h4 style={{ color: 'var(--text-dark)', fontSize: '1.5rem', marginBottom: '12px' }}>{t('studentDashboard.allComplete')}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto 24px' }}>{t('studentDashboard.masteredAll')}</p>
                                    <Link to="/courses" className="btn btn-primary" style={{ padding: '12px 32px', borderRadius: '16px', fontSize: '1rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                                        <BookOpen size={20}/> {t('studentDashboard.browseLibrary')}
                                    </Link>
                                </div>
                            )}
                        </section>

                        <section className="reveal-left" style={{ padding: '24px 32px', background: 'var(--surface-elevated)', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 10px 20px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Target size={20} color="var(--primary-green)" />
                                    <span style={{ fontSize: '1rem', color: 'var(--text-dark)', fontWeight: 700 }}>{t('studentDashboard.overallProgress')}</span>
                                </div>
                                <span style={{ fontSize: '1rem', color: 'var(--primary-green)', fontWeight: 800 }}>{completedCount} / {allCourses.length} {t('studentDashboard.courses')} · {overallPct}%</span>
                            </div>
                            <div style={{ height: '12px', background: 'rgba(34,197,94,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                                <div style={{ width: `${overallPct}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-green), #4ADE80)', borderRadius: '12px', transition: 'width 1.2s cubic-bezier(0.65, 0, 0.35, 1)' }} />
                            </div>
                        </section>

                        <section className="reveal-left">
                            <Link to="/nlp-lab" className="hover-3d" style={{ display: 'block', textDecoration: 'none', background: 'var(--surface-elevated)', borderRadius: '24px', padding: '28px', border: '1px solid transparent', transition: 'all 0.3s', color: 'inherit', boxShadow: '0 10px 20px rgba(0,0,0,0.03)' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary-purple)'; e.currentTarget.style.background = 'rgba(124,58,237,0.03)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'var(--surface-elevated)'; }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(124,58,237,0.2)' }}>
                                        <IconMapping iconName="Brain" size={32} color="var(--primary-purple)" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: 'var(--text-dark)', fontWeight: 700 }}>{t('studentDashboard.practiceLab')}</h4>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('studentDashboard.nlpAssistantDesc')}</p>
                                    </div>
                                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(124,58,237,0.1)', color: 'var(--primary-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </Link>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Gamification Stats */}
                    <div className="reveal-right" style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        {/* Level Ring */}
                        <div className="hover-3d" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.05) 100%)', borderRadius: '28px', padding: '32px', border: '1px solid rgba(124,58,237,0.2)', textAlign: 'center', boxShadow: '0 15px 30px rgba(0,0,0,0.04)' }}>
                            <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 20px' }}>
                                <svg width="140" height="140" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="10" />
                                    <circle cx="50" cy="50" r="38" fill="none" stroke="url(#levelGradient)" strokeWidth="10" strokeDasharray={progressCircumference} strokeDashoffset={progressOffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
                                    <defs>
                                        <linearGradient id="levelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="var(--primary-purple)" />
                                            <stop offset="100%" stopColor="var(--primary-cyan)" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-dark)', lineHeight: 1 }}>{level}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>{t('studentDashboard.level')}</span>
                                </div>
                            </div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', color: 'var(--text-dark)', fontWeight: 800 }}>{xp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP</h4>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t('studentDashboard.xpToNextLevel', { xp: (xpForNextLevel - xp).toLocaleString(), level: level + 1 })}</p>
                        </div >

                        {/* Streak */}
                        <div className="hover-3d" style={{ background: 'linear-gradient(135deg, rgba(234,88,12,0.1) 0%, rgba(251,146,60,0.05) 100%)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(234,88,12,0.2)', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 10px 20px rgba(234,88,12,0.05)' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(234,88,12,0.15)', border: '1px solid rgba(234,88,12,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Flame size={32} color="var(--primary-orange)" className="animate-pulse" />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 2px 0', fontSize: '1.25rem', color: 'var(--text-dark)', fontWeight: 800 }}>{t('studentDashboard.dayStreak', { count: streak })}</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t('studentDashboard.streakDesc')}</p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="hover-3d" style={{ background: 'var(--surface-elevated)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.02)' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(251,191,36,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                    <Zap size={24} color="var(--primary-yellow)" />
                                </div>
                                <h4 style={{ margin: '0 0 2px 0', fontSize: '1.4rem', color: 'var(--text-dark)', fontWeight: 900 }}>{xp.toLocaleString()}</h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{t('studentDashboard.totalXp')}</span>
                            </div>
                            <div className="hover-3d" style={{ background: 'var(--surface-elevated)', borderRadius: '24px', padding: '24px', border: '1px solid var(--border-color)', textAlign: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.02)' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(219,39,119,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                    <Trophy size={24} color="var(--primary-pink)" />
                                </div>
                                <h4 style={{ margin: '0 0 2px 0', fontSize: '1.4rem', color: 'var(--text-dark)', fontWeight: 900 }}>{badges.length}</h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>{t('studentDashboard.badges')}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @media (max-width: 1000px) {
                    div[style*="grid-template-columns: 1fr 320px"] {
                        grid-template-columns: 1fr !important;
                    }
                    div[style*="position: sticky"] {
                        position: relative !important;
                        top: 0 !important;
                    }
                }
                .hover-3d:hover {
                    transform: translateY(-5px) scale(1.01);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
                }
                .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
                .reveal-left { opacity: 0; transform: translateX(-30px); transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
                .reveal-right { opacity: 0; transform: translateX(30px); transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
                .reveal.active, .reveal-left.active, .reveal-right.active { opacity: 1; transform: translate(0); }
            `}} />
        </DashboardLayout>
    );
};

export default DashboardHome;
