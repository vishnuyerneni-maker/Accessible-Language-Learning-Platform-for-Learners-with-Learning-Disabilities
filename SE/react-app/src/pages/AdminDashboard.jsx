import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { adminAPI, courseAPI, userAPI, announcementAPI } from '../utils/api';
import IconMapping from '../components/IconMapping';
import { RefreshCw, BarChart3, Users, BookOpen, Megaphone, Settings, Shield, Pencil, Trash2, Rocket, CheckCircle2, Mic, Sparkles, HardDrive } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        activeStudents: 0
    });
    const [activeTab, setActiveTab] = useState('analytics');
    const [analytics, setAnalytics] = useState(null);
    const [editingCourse, setEditingCourse] = useState(null);
    const [announcementText, setAnnouncementText] = useState('');
    const [isAddingCourse, setIsAddingCourse] = useState(false);
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => {
        refreshData();
    }, []);

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

    const refreshData = async () => {
        try {
            const [usersRes, coursesRes, statsRes] = await Promise.all([
                adminAPI.getAllUsers(),
                courseAPI.getAll(),
                adminAPI.getStats()
            ]);

            const allUsers = usersRes.data || [];
            const allCourses = coursesRes.data || [];
            const statsData = statsRes.data || {};

            const systemAnalytics = {
                userStats: {
                    total: statsData.totalUsers || allUsers.length,
                    totalXP: statsData.totalXP || 0
                },
                courseStats: {
                    completionRates: statsData.completionRates || []
                }
            };

            setUsers(allUsers);
            setCourses(allCourses);
            setAnalytics(systemAnalytics);
            setStats({
                totalUsers: statsData.totalUsers || allUsers.length,
                totalCourses: statsData.totalCourses || allCourses.length,
                activeStudents: statsData.activeStudents || allUsers.filter(u => u.role === 'student').length
            });
        } catch (error) {
            console.error("Failed to load admin data", error);
        }
    };

    const handleDeleteUser = async (mongoId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await adminAPI.deleteUser(mongoId);
                refreshData();
            } catch (e) { alert("Failed to delete user: " + (e.response?.data?.message || e.message)); }
        }
    };

    const handleApproveUser = async (mongoId) => {
        if (window.confirm('Approve this user account?')) {
            try {
                // For now, approval is a placeholder — can be implemented as a PUT /api/users/:id/approve
                alert('User approval will be implemented via a dedicated API endpoint.');
                refreshData();
            } catch (e) { alert('Approval failed'); }
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await courseAPI.delete(courseId);
                refreshData();
            } catch (e) { alert("Failed to delete course"); }
        }
    };

    const handleSaveCourse = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const courseData = {
            title: formData.get('title'),
            description: formData.get('description'),
            image: formData.get('image'),
            badge: formData.get('badge'),
            category: formData.get('category'),
            totalModules: parseInt(formData.get('totalModules'))
        };

        try {
            if (editingCourse) {
                await courseAPI.update(editingCourse.id, courseData);
            } else {
                await courseAPI.create({ ...courseData, id: 'course_' + Date.now() });
            }
            setEditingCourse(null);
            setIsAddingCourse(false);
            refreshData();
        } catch (e) { alert("Failed to save course"); }
    };

    const handlePushAnnouncement = async () => {
        if (!announcementText.trim()) return;
        try {
            await announcementAPI.create(announcementText.trim());
            alert('✅ Announcement pushed to all student dashboards!');
            setAnnouncementText('');
            refreshData();
        } catch (e) {
            alert('Failed to push announcement: ' + (e.response?.data?.message || e.message));
        }
    };

    return (
        <DashboardLayout>
            <div className="container" style={{ padding: '40px 20px' }}>
                <header className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '30px' }}>
                    <div>
                        <h1 className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: '10px' }}>
                            {t('admin.commandCenter')}
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>
                            {t('admin.manageDesc')}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button onClick={refreshData} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', borderRadius: '12px' }}>
                            <RefreshCw size={18} /> {t('admin.refresh')}
                        </button>
                        <div className="hover-lift" style={{ background: 'var(--surface-color)', padding: '12px 24px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', minWidth: '140px' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-purple)' }}>{stats.totalUsers}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{t('admin.totalUsers')}</div>
                        </div>
                        <div className="hover-lift" style={{ background: 'var(--surface-color)', padding: '12px 24px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', minWidth: '140px' }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-cyan)' }}>{stats.totalCourses}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{t('admin.courses')}</div>
                        </div>
                    </div>
                </header>

                <div className="reveal card-glass p-0 overflow-hidden shadow-2xl" style={{ borderRadius: '24px', border: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
                    <div style={{ display: 'flex', background: 'rgba(124, 58, 237, 0.05)', borderBottom: '1px solid var(--border-color)', overflowX: 'auto' }}>
                        {[
                            { key: 'analytics', icon: <BarChart3 size={18}/>, label: t('admin.tabs.analytics') },
                            { key: 'users', icon: <Users size={18}/>, label: t('admin.tabs.users') },
                            { key: 'courses', icon: <BookOpen size={18}/>, label: t('admin.tabs.content') },
                            { key: 'announcements', icon: <Megaphone size={18}/>, label: t('admin.tabs.alerts') },
                            { key: 'system', icon: <Settings size={18}/>, label: t('admin.tabs.health') },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    padding: '20px 30px',
                                    fontWeight: 800,
                                    border: 'none',
                                    borderBottom: activeTab === tab.key ? '4px solid var(--primary-cyan)' : '4px solid transparent',
                                    background: activeTab === tab.key ? 'rgba(0, 229, 255, 0.08)' : 'transparent',
                                    color: activeTab === tab.key ? 'var(--primary-cyan)' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    whiteSpace: 'nowrap',
                                    fontSize: '0.95rem'
                                }}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ padding: '40px' }}>
                        {activeTab === 'analytics' && analytics && (
                            <div className="tab-content-container">
                                <h3 style={{ marginBottom: '30px', fontSize: '1.6rem', fontWeight: 800 }}>{t('admin.insights')}</h3>
                                <div className="grid grid-2" style={{ gap: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
                                    <div className="reveal-left card-neu p-5 hover-3d" style={{ padding: '30px', borderRadius: '24px' }}>
                                        <h4 style={{ color: 'var(--text-muted)', marginBottom: '25px', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('admin.engagement')}</h4>
                                        <div style={{ display: 'grid', gap: '20px' }}>
                                            {analytics.courseStats.completionRates.map((c, i) => (
                                                <div key={i}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                        <span style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '0.95rem' }}>{c.title}</span>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-cyan)' }}>{c.avgProgress}%</span>
                                                    </div>
                                                    <div style={{ height: '10px', background: 'var(--surface-elevated)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.03)' }}>
                                                        <div style={{ width: `${c.avgProgress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-cyan), var(--primary-blue))', borderRadius: '10px', transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="reveal-right card-neu p-5 flex flex-col items-center justify-center hover-3d" style={{ padding: '30px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <h4 style={{ color: 'var(--text-muted)', marginBottom: '25px', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('admin.xpDist')}</h4>
                                        <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg width="180" height="180" viewBox="0 0 150 150" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
                                                <circle cx="75" cy="75" r="62" fill="none" stroke="var(--surface-elevated)" strokeWidth="14" />
                                                <circle cx="75" cy="75" r="62" fill="none" stroke="var(--primary-cyan)" strokeWidth="14" strokeDasharray="390" strokeDashoffset={390 - (390 * 0.75)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                                            </svg>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1, background: 'var(--surface-color)', width: '120px', height: '120px', borderRadius: '50%', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)' }}>
                                                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-cyan)' }}>{analytics.userStats.totalXP}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total XP</span>
                                            </div>
                                        </div>
                                        <p style={{ marginTop: '25px', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600 }}>
                                            {t('landing.stats.userRoles')} <strong style={{ color: 'var(--text-dark)' }}>{analytics.userStats.total}</strong>
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="reveal card-neu p-5 mt-lg hover-3d" style={{ marginTop: '40px', padding: '35px', borderRadius: '24px' }}>
                                    <h4 style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('admin.trend')}</h4>
                                    <div style={{ display: 'flex', gap: '25px', marginBottom: '30px', flexWrap: 'wrap' }}>
                                        {[
                                            { label: t('admin.peak'), value: `${stats.activeStudents}`, color: 'var(--primary-cyan)' },
                                            { label: t('admin.totalUsers'), value: stats.totalUsers, color: 'var(--primary-orange)' },
                                            { label: t('admin.activeCourses'), value: stats.totalCourses, color: '#10b981' },
                                        ].map(s => (
                                            <div key={s.label} style={{ background: 'rgba(0,0,0,0.02)', borderRadius: '18px', padding: '20px', textAlign: 'center', flex: '1', border: '1px solid rgba(0,0,0,0.03)' }}>
                                                <div style={{ fontSize: '2rem', fontWeight: 900, color: s.color, marginBottom: '5px' }}>{s.value}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ position: 'relative', width: '100%', height: '240px', background: 'var(--surface-elevated)', borderRadius: '20px', padding: '20px 20px 40px 60px', border: '1px solid var(--border-color)' }}>
                                        {[0, 50, 100, 150].map((val, i) => (
                                            <span key={i} style={{ position: 'absolute', left: '10px', bottom: `${38 + (i / 3) * 160}px`, fontSize: '11px', color: 'var(--text-muted)', width: '40px', textAlign: 'right', fontWeight: 700 }}>{val}</span>
                                        ))}
                                        <svg width="100%" height="100%" viewBox="0 0 500 150" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                            <defs>
                                                <linearGradient id="adminChartGrad" x1="0" x2="0" y1="0" y2="1">
                                                    <stop offset="0%" stopColor="var(--primary-cyan)" stopOpacity="0.4"/>
                                                    <stop offset="100%" stopColor="var(--primary-cyan)" stopOpacity="0"/>
                                                </linearGradient>
                                            </defs>
                                            <line x1="0" y1="37.5" x2="500" y2="37.5" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                                            <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                                            <line x1="0" y1="112.5" x2="500" y2="112.5" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                                            <path d="M0,130 Q50,110 100,120 T200,80 T300,50 T400,60 T500,20 L500,150 L0,150 Z" fill="url(#adminChartGrad)"/>
                                            <path d="M0,130 Q50,110 100,120 T200,80 T300,50 T400,60 T500,20" fill="none" stroke="var(--primary-cyan)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 4px 10px rgba(0, 229, 255, 0.3))' }}/>
                                            {[[0,130,'12'],[100,120,'18'],[200,80,'45'],[300,50,'78'],[400,60,'62'],[500,20,'134']].map(([x,y,label], i) => (
                                                <g key={i}>
                                                    <circle cx={x} cy={y} r="6" fill="white" stroke="var(--primary-cyan)" strokeWidth="3"/>
                                                    <text x={x} y={y - 15} textAnchor="middle" fontSize="12" fill="var(--primary-cyan)" fontWeight="900">{label}</text>
                                                </g>
                                            ))}
                                        </svg>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: '10px', left: '60px', right: '20px' }}>
                                            {['W1','W2','W3','W4','W5','W6'].map(w => <span key={w} style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800 }}>{w}</span>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="tab-content-container reveal" style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                    <thead style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '2px solid var(--border-color)' }}>
                                        <tr>
                                            <th style={{ padding: '20px', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>{t('admin.users.name')}</th>
                                            <th style={{ padding: '20px', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>{t('admin.users.role')}</th>
                                            <th style={{ padding: '20px', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>{t('admin.users.email')}</th>
                                            <th style={{ padding: '20px', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>{t('admin.users.mfa')}</th>
                                            <th style={{ padding: '20px', textAlign: 'right', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' }}>{t('admin.users.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u._id} className="hover-lift" style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', transition: 'background 0.2s' }}>
                                                <td style={{ padding: '20px' }}><strong style={{ color: 'var(--text-dark)', fontSize: '1.05rem' }}>{u.name}</strong></td>
                                                <td style={{ padding: '20px' }}>
                                                    <span style={{ 
                                                        padding: '4px 12px', 
                                                        borderRadius: '30px', 
                                                        fontSize: '0.75rem', 
                                                        fontWeight: 800, 
                                                        background: u.role === 'admin' ? 'var(--primary-purple)' : u.role === 'teacher' ? 'var(--primary-cyan)' : 'var(--surface-elevated)',
                                                        color: u.role === 'admin' || u.role === 'teacher' ? 'white' : 'var(--text-medium)',
                                                        border: '1px solid rgba(0,0,0,0.05)'
                                                    }}>
                                                        {u.role.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{u.email}</td>
                                                <td style={{ padding: '20px' }}>
                                                    {u.mfaEnabled ? (
                                                        <span style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '8px', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--primary-purple)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Shield size={14}/> ACTIVE</span>
                                                    ) : (
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Disabled</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '20px', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                        {u.isApproved === false && (
                                                            <button onClick={() => handleApproveUser(u._id)} className="btn btn-sm btn-outline" style={{ color: '#10b981', borderColor: '#10b981', fontWeight: 800, fontSize: '0.8rem' }}>{t('admin.users.approve')}</button>
                                                        )}
                                                        {u.mfaEnabled && (
                                                            <button onClick={() => alert("MFA Reset from Admin not yet linked to API")} className="btn btn-sm btn-outline" style={{ fontWeight: 800, fontSize: '0.8rem' }}>{t('admin.users.resetMfa')}</button>
                                                        )}
                                                        {u.role !== 'admin' && (
                                                            <button onClick={() => handleDeleteUser(u._id)} className="btn btn-sm btn-outline" style={{ color: 'var(--error-color)', borderColor: 'var(--error-color)', fontWeight: 800, fontSize: '0.8rem' }}>{t('admin.users.delete')}</button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'courses' && (
                            <div className="tab-content-container reveal">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t('admin.content.modules')}</h3>
                                    <button onClick={() => { setEditingCourse(null); setIsAddingCourse(true); }} className="btn btn-primary btn-3d" style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: 800 }}>+ {t('admin.content.new')}</button>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
                                    {[
                                        { id: 'all', label: t('admin.content.all') },
                                        { id: 'general', label: t('admin.content.general') },
                                        { id: 'dyslexia', label: t('admin.content.dyslexia') },
                                        { id: 'speech', label: t('admin.content.speech') }
                                    ].map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setFilterCategory(cat.id)}
                                            style={{
                                                padding: '8px 20px',
                                                borderRadius: '30px',
                                                border: '1px solid',
                                                borderColor: filterCategory === cat.id ? 'var(--primary-purple)' : 'var(--border-color)',
                                                background: filterCategory === cat.id ? 'var(--primary-purple)' : 'transparent',
                                                color: filterCategory === cat.id ? 'white' : 'var(--text-muted)',
                                                fontWeight: 800,
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>

                                {(editingCourse || isAddingCourse) ? (
                                    <div className="card-neu p-4 reveal" style={{ padding: '35px', borderRadius: '24px', border: '2px solid var(--primary-orange)' }}>
                                        <h4 style={{ marginBottom: '25px', fontSize: '1.3rem', fontWeight: 800 }}>{editingCourse ? t('teacher.courses.edit') : t('admin.content.new')}</h4>
                                        <form onSubmit={handleSaveCourse} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Course Title</label>
                                                <input type="text" name="title" defaultValue={editingCourse?.title} required style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--surface-color)' }} />
                                            </div>
                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Icon Name (Lucide string)</label>
                                                <input type="text" name="image" defaultValue={editingCourse?.image} placeholder="BookOpen" required style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--surface-color)' }} />
                                            </div>
                                            <div style={{ display: 'grid', gap: '8px', gridColumn: 'span 2' }}>
                                                <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Description</label>
                                                <textarea name="description" defaultValue={editingCourse?.description} required rows="3" style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', resize: 'vertical' }}></textarea>
                                            </div>
                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Badge Type</label>
                                                <select name="badge" defaultValue={editingCourse?.badge} style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
                                                    <option value="free">Free</option>
                                                    <option value="premium">Premium</option>
                                                    <option value="new">New</option>
                                                    <option value="popular">Popular</option>
                                                </select>
                                            </div>
                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Category</label>
                                                <select name="category" defaultValue={editingCourse?.category || 'general'} style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
                                                    <option value="general">General Learning</option>
                                                    <option value="dyslexia">Dyslexia Center</option>
                                                    <option value="speech">Speech Lab</option>
                                                </select>
                                            </div>
                                            <div style={{ display: 'grid', gap: '8px' }}>
                                                <label style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Modules</label>
                                                <input type="number" name="totalModules" defaultValue={editingCourse?.totalModules || 5} required style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--surface-color)' }} />
                                            </div>
                                            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '15px', marginTop: '10px' }}>
                                                <button type="submit" className="btn btn-primary btn-3d" style={{ padding: '12px 30px', borderRadius: '12px', fontWeight: 800 }}>{t('admin.content.save')}</button>
                                                <button type="button" onClick={() => { setEditingCourse(null); setIsAddingCourse(false); }} className="btn btn-outline" style={{ padding: '12px 30px', borderRadius: '12px', fontWeight: 800 }}>{t('admin.content.cancel')}</button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
                                        {courses
                                            .filter(c => filterCategory === 'all' || (c.category || 'general') === filterCategory)
                                            .map(c => (
                                                <div key={c.id} className="reveal card-neu hover-lift" style={{ padding: '25px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(0,0,0,0.03)' }}>
                                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                                        <div style={{ padding: '12px', background: 'var(--surface-elevated)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                            <IconMapping iconName={c.image} size={36} color="var(--primary-purple)" />
                                                        </div>
                                                        <div>
                                                            <h4 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>{c.title}</h4>
                                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '20px', background: c.category === 'dyslexia' ? 'rgba(255, 64, 129, 0.1)' : c.category === 'speech' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(0,0,0,0.05)', color: c.category === 'dyslexia' ? 'var(--primary-pink)' : c.category === 'speech' ? '#ca8a04' : 'var(--text-muted)', fontWeight: 800 }}>
                                                                    {c.category?.toUpperCase() || 'GENERAL'}
                                                                </span>
                                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{c.totalModules} Units</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button onClick={() => setEditingCourse(c)} style={{ padding: '10px', borderRadius: '12px', background: 'none', border: '1px solid var(--border-color)', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s' }} className="hover-lift"><Pencil size={18} /></button>
                                                        <button onClick={() => handleDeleteCourse(c.id)} style={{ padding: '10px', borderRadius: '12px', background: 'none', border: '1px solid rgba(239, 68, 68, 0.1)', cursor: 'pointer', color: 'var(--error-color)', transition: 'all 0.2s' }} className="hover-lift"><Trash2 size={18} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        {courses.filter(c => filterCategory === 'all' || (c.category || 'general') === filterCategory).length === 0 && (
                                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No courses found in this category.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'announcements' && <AnnouncementsTab announcementText={announcementText} setAnnouncementText={setAnnouncementText} handlePushAnnouncement={handlePushAnnouncement} refreshData={refreshData} t={t} />}


                        {activeTab === 'system' && (
                            <div className="tab-content-container reveal grid grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                                <div className="card-neu p-5 hover-3d" style={{ padding: '30px', borderRadius: '24px', borderLeft: '6px solid var(--primary-green)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                                        <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', color: 'var(--primary-green)' }}><CheckCircle2 size={32} /></div>
                                        <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>{t('admin.health.db')}</h4>
                                    </div>
                                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 600 }}>{t('admin.health.dbDesc')}</p>
                                </div>
                                <div className="card-neu p-5 hover-3d" style={{ padding: '30px', borderRadius: '24px', borderLeft: '6px solid var(--primary-blue)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                                        <div style={{ padding: '12px', background: 'rgba(0, 229, 255, 0.1)', borderRadius: '16px', color: 'var(--primary-blue)' }}><Mic size={32} /></div>
                                        <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>{t('admin.health.voice')}</h4>
                                    </div>
                                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 600 }}>{t('admin.health.voiceDesc')}</p>
                                </div>
                                <div className="card-neu p-5 hover-3d" style={{ padding: '30px', borderRadius: '24px', borderLeft: '6px solid var(--primary-purple)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                                        <div style={{ padding: '12px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '16px', color: 'var(--primary-purple)' }}><Sparkles size={32} /></div>
                                        <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>{t('admin.health.ai')}</h4>
                                    </div>
                                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 600 }}>{t('admin.health.aiDesc')}</p>
                                </div>
                                <div className="card-neu p-5 hover-3d" style={{ padding: '30px', borderRadius: '24px', borderLeft: '6px solid var(--primary-yellow)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                                        <div style={{ padding: '12px', background: 'rgba(255, 193, 7, 0.1)', borderRadius: '16px', color: '#ca8a04' }}><HardDrive size={32} /></div>
                                        <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>{t('admin.health.storage')}</h4>
                                    </div>
                                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 600 }}>{t('admin.health.storageDesc')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
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
                    transform: perspective(1000px) rotateX(2deg) rotateY(2deg) translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                }
                .hover-lift:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(124, 58, 237, 0.1);
                }
            `}} />
        </DashboardLayout>
    );
};

// Announcements Tab Component — fully backed by MongoDB
const AnnouncementsTab = ({ announcementText, setAnnouncementText, handlePushAnnouncement, refreshData, t }) => {
    const [announcements, setAnnouncements] = React.useState([]);

    React.useEffect(() => {
        const loadAnnouncements = async () => {
            try {
                const res = await announcementAPI.getAll();
                setAnnouncements(res.data || []);
            } catch (e) {
                console.error('Failed to load announcements', e);
            }
        };
        loadAnnouncements();
    }, [announcementText]); // Re-fetch when text clears (after push)

    const handleDelete = async (id) => {
        try {
            await announcementAPI.delete(id);
            setAnnouncements(prev => prev.filter(a => a._id !== id));
        } catch (e) {
            alert('Failed to delete announcement');
        }
    };

    const handleClearAll = async () => {
        try {
            await announcementAPI.clearAll();
            setAnnouncements([]);
            alert('All announcements cleared.');
        } catch (e) {
            alert('Failed to clear announcements');
        }
    };

    return (
        <div className="tab-content-container reveal">
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '10px' }}>{t('admin.alerts.broadcast')}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '35px', fontSize: '1.05rem' }}>{t('admin.alerts.broadcastDesc')}</p>
            <div className="card-glass p-4" style={{ marginBottom: '40px', padding: '30px', borderRadius: '24px', background: 'rgba(124, 58, 237, 0.03)', border: '1px dashed var(--primary-purple)' }}>
                <textarea
                    style={{ width: '100%', marginBottom: '20px', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', minHeight: '130px', background: 'var(--surface-color)', color: 'var(--text-dark)', fontSize: '1.1rem', resize: 'vertical' }}
                    placeholder={t('admin.alerts.placeholder')}
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                ></textarea>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <button onClick={handlePushAnnouncement} className="btn btn-primary btn-3d" style={{ padding: '14px 30px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}><Rocket size={20}/> {t('admin.alerts.push')}</button>
                    <button onClick={handleClearAll} className="btn btn-outline" style={{ padding: '14px 30px', borderRadius: '12px', color: 'var(--error-color)', borderColor: 'var(--error-color)', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800 }}><Trash2 size={20}/> {t('admin.alerts.clear')}</button>
                </div>
            </div>
            {announcements.length > 0 && (
                <div className="reveal">
                    <h4 style={{ color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', fontWeight: 900 }}>{t('admin.alerts.posted')} ({announcements.length})</h4>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {announcements.map(a => (
                            <div key={a._id} className="hover-lift" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 25px', background: 'var(--surface-elevated)', borderRadius: '20px', border: '1px solid var(--border-color)', borderLeft: '6px solid var(--primary-orange)', transition: 'all 0.3s' }}>
                                <div>
                                    <p style={{ margin: '0 0 8px 0', color: 'var(--text-dark)', fontSize: '1.1rem', fontWeight: 600 }}>{a.text}</p>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>📅 {new Date(a.createdAt).toLocaleString()}</span>
                                </div>
                                <button onClick={() => handleDelete(a._id)} style={{ background: 'rgba(0,0,0,0.03)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '10px', borderRadius: '10px' }} className="hover-3d"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {announcements.length === 0 && <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 600 }}>No announcements sent yet. Push your first alert above!</div>}
        </div>
    );
};

export default AdminDashboard;
