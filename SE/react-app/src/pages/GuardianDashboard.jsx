import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { userAPI, courseAPI } from '../utils/api';
import IconMapping from '../components/IconMapping';
import { Shield, Home, FileText, BarChart3, Settings, Zap, Flame, Printer, Lock, Unlock, Trophy, BookOpen, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GuardianDashboard = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('hub');
    const [childrenData, setChildrenData] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        refreshData();
    }, [user]);

    // Intersection Observer for reveal animations
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
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
    }, [activeTab, loading]);

    const refreshData = async () => {
        if (user && user.role === 'parent') {
            try {
                const dataResponse = await userAPI.getChildProgress(user._id || user.id);
                if (dataResponse.data && Array.isArray(dataResponse.data) && dataResponse.data.length > 0) {
                    const children = dataResponse.data.map(c => ({ ...c, _id: c._id || c.id }));
                    setChildrenData(children);
                    setSelectedChildId(children[0]._id);
                } else if (dataResponse.data && !Array.isArray(dataResponse.data)) {
                    const child = { ...dataResponse.data, _id: dataResponse.data._id || dataResponse.data.id };
                    setChildrenData([child]);
                    setSelectedChildId(child._id);
                }
            } catch (e) {
                console.error('Failed to load child data:', e.message);
            }

            try {
                const coursesRes = await courseAPI.getAll();
                setAllCourses(coursesRes.data);
            } catch (e) {
                console.error('Failed to load courses:', e.message);
            }
        }
        setLoading(false);
    };

    const handleToggleCourse = async (courseId) => {
        try {
            await userAPI.toggleChildLock(selectedChildId, courseId);
            await refreshData();
        } catch (e) {
            alert('Failed to toggle course lock: ' + (e.response?.data?.message || e.message));
        }
    };

    const handleResetProgress = async (courseId) => {
        if (window.confirm(`Are you sure you want to reset progress for ${courseId.replace('_', ' ')}? This cannot be undone.`)) {
            try {
                // Reset progress to 0 for this course via the progress endpoint
                await userAPI.updateProgress(courseId, 0);
                await refreshData();
            } catch (e) {
                alert('Reset progress failed: ' + (e.response?.data?.message || e.message));
            }
        }
    };

    if (loading) return <DashboardLayout><div className="container" style={{ padding: '40px', textAlign: 'center' }}>{t('guardian.loading')}</div></DashboardLayout>;

    const childData = childrenData.find(c => c._id === selectedChildId);

    if (!childData) {
        return (
            <DashboardLayout>
                <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
                    <div className="reveal card shadow-lg" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <Shield size={64} color="var(--primary-purple)" />
                        </div>
                        <h2 style={{ marginTop: '20px', color: 'var(--primary-purple)' }}>{t('guardian.controlCenter')}</h2>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-medium)', margin: '20px 0' }}>
                            {t('guardian.pending')}
                        </p>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/profile'}>
                            {t('guardian.linkChild')}
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="container" style={{ padding: '40px 20px' }}>
                {/* Dashboard Header */}
                <div className="reveal" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--primary-purple)', marginBottom: '10px', fontWeight: 900 }}>
                            {t('guardian.controlCenter')}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                            <p style={{ color: 'var(--text-medium)', fontSize: '1.1rem', margin: 0 }}>
                                {t('guardian.managing')}
                            </p>
                            <select 
                                value={selectedChildId} 
                                onChange={(e) => setSelectedChildId(e.target.value)}
                                style={{ padding: '8px 15px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 600, background: 'var(--surface-color)', minWidth: '200px', cursor: 'pointer' }}
                            >
                                {childrenData.map(child => (
                                    <option key={child._id} value={child._id}>{child.name || child.username}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{ background: 'var(--surface-color)', padding: '12px 24px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '24px', fontWeight: 700, fontSize: '0.95rem' }}>
                        <span>{t('guardian.table.status')}: <span style={{ color: 'var(--success-color)' }}>● {t('guardian.active')}</span></span>
                        <span>{t('guardian.level')}: {childData.gamification?.level || 1}</span>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="reveal" style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '40px',
                    borderBottom: '2px solid rgba(124, 58, 237, 0.1)',
                    paddingBottom: '2px',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap'
                }}>
                    {[
                        { id: 'hub', label: t('guardian.overview'), icon: <Home size={18} />, color: 'var(--primary-purple)' },
                        { id: 'curriculum', label: t('guardian.curriculum'), icon: <FileText size={18} />, color: 'var(--primary-orange)' },
                        { id: 'insights', label: t('guardian.insights'), icon: <BarChart3 size={18} />, color: '#10b981' },
                        { id: 'settings', label: t('guardian.safety'), icon: <Settings size={18} />, color: '#6b7280' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '16px 28px',
                                border: 'none',
                                background: activeTab === tab.id ? `${tab.color}08` : 'none',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 800,
                                color: activeTab === tab.id ? tab.color : 'var(--text-muted)',
                                borderBottom: activeTab === tab.id ? `4px solid ${tab.color}` : '4px solid transparent',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                borderRadius: '12px 12px 0 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="tab-content-container">
                    {activeTab === 'hub' && (
                        <div className="grid grid-3" style={{ gap: '30px' }}>
                            <div className="reveal-left card shadow-lg hover-3d" style={{ gridColumn: 'span 2', padding: '35px', background: 'var(--surface-color)', borderRadius: '24px' }}>
                                <h3 style={{ marginBottom: '25px', fontSize: '1.5rem', fontWeight: 800 }}>{t('guardian.pulse')}</h3>
                                <div className="grid grid-2" style={{ gap: '24px' }}>
                                    <div style={{ background: 'rgba(111, 66, 193, 0.05)', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(111, 66, 193, 0.1)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}><Zap size={44} color="#eab308" /></div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-dark)' }}>{childData.gamification?.xp || 0}</div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, fontWeight: 600 }}>{t('guardian.totalXP')}</p>
                                    </div>
                                    <div style={{ background: 'rgba(249, 115, 22, 0.05)', padding: '25px', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(249, 115, 22, 0.1)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}><Flame size={44} color="#f97316" /></div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-dark)' }}>{childData.gamification?.currentStreak || 0}</div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, fontWeight: 600 }}>{t('guardian.streak')}</p>
                                    </div>
                                </div>
                                <div style={{ marginTop: '35px' }}>
                                    <h4 style={{ marginBottom: '18px', fontSize: '1.1rem', fontWeight: 700 }}>{t('guardian.progressed')}</h4>
                                    {childData.progress && Object.keys(childData.progress).length > 0 ? (
                                        (() => {
                                            const [bestId, bestPercent] = Object.entries(childData.progress).sort((a, b) => b[1] - a[1])[0];
                                            return (
                                                <div style={{ background: 'var(--surface-elevated)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                        <strong style={{ fontSize: '1.2rem', color: 'var(--text-dark)' }}>{bestId.replace('_', ' ').toUpperCase()}</strong>
                                                        <span style={{ color: 'var(--primary-purple)', fontWeight: 900, fontSize: '1.2rem' }}>{bestPercent}%</span>
                                                    </div>
                                                    <div style={{ height: '14px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${bestPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-purple), var(--primary-pink))', borderRadius: '10px' }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        <div style={{ padding: '30px', textAlign: 'center', background: 'var(--surface-elevated)', borderRadius: '20px', color: 'var(--text-muted)' }}>
                                            {t('guardian.noProgress')}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="reveal-right card shadow-lg hover-3d" style={{ padding: '35px', background: 'var(--surface-color)', borderRadius: '24px' }}>
                                <h3 style={{ marginBottom: '25px', fontSize: '1.5rem', fontWeight: 800 }}>{t('guardian.quickActions')}</h3>
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    <button className="btn btn-outline" style={{ width: '100%', padding: '14px', borderRadius: '14px' }} onClick={() => setActiveTab('curriculum')}>{t('guardian.manageCurriculum')}</button>
                                    <button className="btn btn-outline" style={{ width: '100%', padding: '14px', borderRadius: '14px' }} onClick={() => setActiveTab('insights')}>{t('guardian.viewReport')}</button>
                                    <button className="btn btn-ghost" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: 0.7 }} onClick={() => window.print()}><Printer size={18}/> {t('guardian.printReport')}</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'curriculum' && (
                        <div className="reveal card shadow-lg" style={{ padding: '35px', background: 'var(--surface-color)', borderRadius: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', flexWrap: 'wrap', gap: '20px' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>{t('guardian.curriculumControl')}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{t('guardian.curriculumDesc')}</p>
                                </div>
                                <span style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--primary-cyan)', padding: '8px 20px', borderRadius: '30px', fontWeight: 800, fontSize: '0.95rem', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
                                    {t('guardian.lockedCount', { count: (childData.parentSettings?.lockedCourses || []).length })}
                                </span>
                            </div>

                            <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: 'var(--surface-elevated)', borderBottom: '2px solid var(--border-color)' }}>
                                        <tr>
                                            <th style={{ padding: '20px', textAlign: 'left', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('guardian.table.module')}</th>
                                            <th style={{ padding: '20px', textAlign: 'center', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('guardian.table.progress')}</th>
                                            <th style={{ padding: '20px', textAlign: 'center', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('guardian.table.status')}</th>
                                            <th style={{ padding: '20px', textAlign: 'right', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('guardian.table.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allCourses.map(course => {
                                            const settings = childData.parentSettings || { lockedCourses: [] };
                                            const lockedList = settings.lockedCourses || [];
                                            const isLocked = lockedList.includes(course.id);
                                            const progress = (childData.progress && childData.progress[course.id]) ? childData.progress[course.id] : 0;
                                            return (
                                                <tr key={course.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                                                    <td style={{ padding: '24px 20px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                                                            <div style={{ padding: '10px', background: 'var(--surface-elevated)', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                                <IconMapping iconName={course.image} size={30} color="var(--primary-purple)" />
                                                            </div>
                                                            <div>
                                                                <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--text-dark)' }}>{course.title}</strong>
                                                                <small style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{course.totalModules} Units</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '20px', textAlign: 'center' }}>
                                                        <span style={{
                                                            padding: '6px 14px',
                                                            borderRadius: '30px',
                                                            background: progress === 100 ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface-elevated)',
                                                            color: progress === 100 ? '#10b981' : 'var(--text-medium)',
                                                            fontWeight: 800,
                                                            fontSize: '0.9rem',
                                                            border: '1px solid rgba(0,0,0,0.03)'
                                                        }}>
                                                            {progress}%
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '20px', textAlign: 'center' }}>
                                                        <span style={{
                                                            color: isLocked ? 'var(--error-color)' : 'var(--success-color)',
                                                            fontWeight: 900,
                                                            fontSize: '0.85rem',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            padding: '6px 12px',
                                                            borderRadius: '8px',
                                                            background: isLocked ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)'
                                                        }}>
                                                            {isLocked ? <><Lock size={15}/> {t('guardian.table.locked')}</> : <><Unlock size={15}/> {t('guardian.table.open')}</>}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '20px', textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                            <button
                                                                className={`btn btn-sm ${isLocked ? 'btn-primary' : 'btn-outline'}`}
                                                                style={{ borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, padding: '8px 16px' }}
                                                                onClick={() => handleToggleCourse(course.id)}
                                                            >
                                                                {isLocked ? t('guardian.table.unlock') : t('guardian.table.lock')}
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-ghost"
                                                                disabled={progress === 0}
                                                                style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}
                                                                onClick={() => handleResetProgress(course.id)}
                                                            >
                                                                {t('guardian.table.reset')}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'insights' && (
                        <div className="reveal card shadow-lg" style={{ padding: '35px', background: 'var(--surface-color)', borderRadius: '24px' }}>
                            <h3 style={{ marginBottom: '35px', fontSize: '1.6rem', fontWeight: 800 }}>{t('guardian.activityReport')}</h3>
                            <div style={{ borderLeft: '3px solid var(--primary-purple)', paddingLeft: '30px', display: 'grid', gap: '18px' }}>
                                {childData.recentActivity && childData.recentActivity.length > 0 ? (
                                    childData.recentActivity.map((activity, index) => (
                                        <div key={index} className="hover-lift" style={{
                                            padding: '24px',
                                            background: 'var(--surface-elevated)',
                                            borderRadius: '20px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            border: '1px solid var(--border-color)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-dark)', marginBottom: '6px' }}>{activity.text}</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{activity.time}</div>
                                            </div>
                                            <div style={{
                                                width: '52px',
                                                height: '52px',
                                                borderRadius: '16px',
                                                background: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: 'var(--shadow-sm)',
                                                color: 'var(--primary-purple)'
                                            }}>
                                                {activity.text.includes('100%') ? <Trophy size={26} color="#eab308" /> : <BookOpen size={26} />}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                                        <p style={{ fontSize: '1.1rem' }}>{t('guardian.noActivity')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="reveal card shadow-lg" style={{ padding: '35px', background: 'var(--surface-color)', borderRadius: '24px' }}>
                            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '35px' }}>{t('guardian.safety')}</h3>
                            <div style={{ maxWidth: '600px' }}>
                                <div className="input-group" style={{ marginBottom: '35px' }}>
                                    <label style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', fontWeight: 800 }}>{t('guardian.connectedProfile')}</label>
                                    <div style={{ padding: '20px 24px', border: '1px solid var(--border-color)', borderRadius: '18px', background: 'var(--surface-elevated)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ display: 'flex', background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-pink))', padding: '12px', borderRadius: '50%', color: 'white' }}>
                                            <User size={28} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-dark)' }}>{childData.name}</div>
                                            <div style={{ color: 'var(--primary-purple)', fontWeight: 700, fontSize: '0.9rem' }}>@{childData.username}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group" style={{ marginBottom: '35px' }}>
                                    <label style={{ fontSize: '0.95rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', fontWeight: 800 }}>{t('guardian.parentalPin')}</label>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
                                        {t('guardian.pinDesc')}
                                    </p>
                                    <button className="btn btn-outline" style={{ borderRadius: '12px', padding: '12px 24px', opacity: 0.7 }} disabled>{t('guardian.updatePin')}</button>
                                </div>
                                <div className="input-group" style={{ marginTop: '50px', padding: '30px', background: 'rgba(239, 68, 68, 0.03)', borderRadius: '24px', border: '1px dashed rgba(239, 68, 68, 0.2)' }}>
                                    <label style={{ color: 'var(--error-color)', fontWeight: 900, marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('guardian.dangerZone')}</label>
                                    <button className="btn btn-link" style={{ color: 'var(--error-color)', padding: 0, fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid currentColor' }} onClick={() => alert('Feature coming soon: Please contact admin to unlink accounts.')}>
                                        {t('guardian.unlink')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default GuardianDashboard;
