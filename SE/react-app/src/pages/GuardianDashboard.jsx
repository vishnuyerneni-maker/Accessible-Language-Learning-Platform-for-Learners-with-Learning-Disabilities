import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { MockBackend } from '../utils/MockBackend';

const GuardianDashboard = () => {
    const [activeTab, setActiveTab] = useState('hub');
    const [childData, setChildData] = useState(null);
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = MockBackend.getCurrentUser();

    useEffect(() => {
        refreshData();
    }, [currentUser]);

    const refreshData = () => {
        if (currentUser && currentUser.role === 'parent') {
            const data = MockBackend.getChildProgress(currentUser.id);
            setChildData(data);
            setAllCourses(MockBackend.seedData.courses);
        }
        setLoading(false);
    };

    const handleToggleCourse = (courseId) => {
        if (MockBackend.toggleChildCourse(currentUser.id, courseId)) {
            refreshData();
        }
    };

    const handleResetProgress = (courseId) => {
        if (window.confirm(`Are you sure you want to reset progress for ${courseId.replace('_', ' ')}? This cannot be undone.`)) {
            if (MockBackend.resetChildProgress(currentUser.id, courseId)) {
                refreshData();
            }
        }
    };

    if (loading) return <Layout><div className="container">Loading Guardian Hub...</div></Layout>;

    if (!childData) {
        return (
            <Layout>
                <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
                    <div className="card shadow-lg" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
                        <span style={{ fontSize: '4rem' }}>🛡️</span>
                        <h2 style={{ marginTop: '20px', color: 'var(--primary-purple)' }}>Guardian Hub</h2>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-medium)', margin: '20px 0' }}>
                            Account pending child connection.
                        </p>
                        <button className="btn btn-primary" onClick={() => window.location.href = '/profile'}>
                            Link Child Account
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container" style={{ padding: '40px 20px' }}>
                {/* Dashboard Header */}
                <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', color: 'var(--primary-purple)', marginBottom: '10px' }}>
                            Guardian Control Center
                        </h1>
                        <p style={{ color: 'var(--text-medium)', fontSize: '1.2rem' }}>
                            Managing <strong>{childData.name}</strong>'s learning path.
                        </p>
                    </div>
                    <div style={{ background: 'var(--surface-color)', padding: '10px 20px', borderRadius: '50px', border: '1px solid var(--border-color)', display: 'flex', gap: '20px', fontWeight: 600 }}>
                        <span>Status: <span style={{ color: 'var(--success-color)' }}>● Active</span></span>
                        <span>Level: {childData.gamification?.level || 1}</span>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '30px',
                    borderBottom: '2px solid rgba(0,0,0,0.05)',
                    paddingBottom: '2px'
                }}>
                    {[
                        { id: 'hub', label: '🏠 Overview Hub', color: 'var(--primary-purple)' },
                        { id: 'curriculum', label: '📑 Curriculum Path', color: 'var(--primary-orange)' },
                        { id: 'insights', label: '📊 Learning Insights', color: '#10b981' },
                        { id: 'settings', label: '⚙️ Safety Settings', color: '#6b7280' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '15px 25px',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                color: activeTab === tab.id ? tab.color : 'var(--text-muted)',
                                borderBottom: activeTab === tab.id ? `4px solid ${tab.color}` : '4px solid transparent',
                                transition: 'all 0.2s',
                                borderRadius: '12px 12px 0 0'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="animate-fade-in">
                    {activeTab === 'hub' && (
                        <div className="grid grid-3" style={{ gap: '30px' }}>
                            <div className="card shadow-md" style={{ gridColumn: 'span 2', padding: '30px' }}>
                                <h3 style={{ marginBottom: '20px' }}>Learning Pulse</h3>
                                <div className="grid grid-2" style={{ gap: '20px' }}>
                                    <div style={{ background: 'rgba(111, 66, 193, 0.05)', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '2.5rem', marginBottom: '5px' }}>⚡</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{childData.gamification?.xp || 0}</div>
                                        <small style={{ color: 'var(--text-muted)' }}>Total Experience Points</small>
                                    </div>
                                    <div style={{ background: 'rgba(255, 193, 7, 0.05)', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '2.5rem', marginBottom: '5px' }}>🔥</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{childData.gamification?.currentStreak || 0} Days</div>
                                        <small style={{ color: 'var(--text-muted)' }}>Current Learning Streak</small>
                                    </div>
                                </div>
                                <div style={{ marginTop: '30px' }}>
                                    <h4 style={{ marginBottom: '15px' }}>Most Progressed Course</h4>
                                    {Object.entries(childData.progress).length > 0 ? (
                                        (() => {
                                            const [bestId, bestPercent] = Object.entries(childData.progress).sort((a, b) => b[1] - a[1])[0];
                                            return (
                                                <div style={{ background: 'var(--surface-color)', padding: '20px', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                        <strong style={{ fontSize: '1.1rem' }}>{bestId.replace('_', ' ').toUpperCase()}</strong>
                                                        <span style={{ color: 'var(--primary-purple)', fontWeight: 800 }}>{bestPercent}%</span>
                                                    </div>
                                                    <div style={{ height: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                                        <div style={{ width: `${bestPercent}%`, height: '100%', background: 'var(--primary-purple)' }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        <p style={{ color: 'var(--text-muted)' }}>No courses started yet. house</p>
                                    )}
                                </div>
                            </div>
                            <div className="card shadow-md" style={{ padding: '30px' }}>
                                <h3 style={{ marginBottom: '20px' }}>Quick Actions</h3>
                                <div style={{ display: 'grid', gap: '15px' }}>
                                    <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setActiveTab('curriculum')}>Manage Curriculum</button>
                                    <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setActiveTab('insights')}>View Full Report</button>
                                    <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => window.print()}>🖨️ Print Report</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'curriculum' && (
                        <div className="card shadow-md" style={{ padding: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <div>
                                    <h3>Curriculum Control</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>Lock or unlock specific modules to guide your child's learning pace.</p>
                                </div>
                                <span style={{ background: 'rgba(255, 193, 7, 0.1)', color: 'var(--primary-orange)', padding: '5px 15px', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem' }}>
                                    {childData.settings.lockedCourses.length} Courses Locked
                                </span>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: 'var(--surface-color)', borderBottom: '2px solid var(--border-color)' }}>
                                        <tr>
                                            <th style={{ padding: '15px', textAlign: 'left' }}>Course Module</th>
                                            <th style={{ padding: '15px', textAlign: 'center' }}>Child Progress</th>
                                            <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                                            <th style={{ padding: '15px', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allCourses.map(course => {
                                            const isLocked = childData.settings.lockedCourses.includes(course.id);
                                            const progress = childData.progress[course.id] || 0;
                                            return (
                                                <tr key={course.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                                    <td style={{ padding: '20px 15px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                            <span style={{ fontSize: '1.5rem' }}>{course.image}</span>
                                                            <div>
                                                                <strong style={{ display: 'block' }}>{course.title}</strong>
                                                                <small style={{ color: 'var(--text-muted)' }}>{course.totalModules} Units</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                                        <span style={{
                                                            padding: '4px 12px',
                                                            borderRadius: '20px',
                                                            background: progress === 100 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.05)',
                                                            color: progress === 100 ? '#10b981' : 'var(--text-medium)',
                                                            fontWeight: 700
                                                        }}>
                                                            {progress}%
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                                        <span style={{
                                                            color: isLocked ? 'var(--error-color)' : 'var(--success-color)',
                                                            fontWeight: 800
                                                        }}>
                                                            {isLocked ? '🔒 LOCKED' : '🔓 OPEN'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '15px', textAlign: 'right' }}>
                                                        <button
                                                            className={`btn btn-sm ${isLocked ? 'btn-primary' : 'btn-outline'}`}
                                                            style={{ marginRight: '10px' }}
                                                            onClick={() => handleToggleCourse(course.id)}
                                                        >
                                                            {isLocked ? 'Unlock' : 'Lock Access'}
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-ghost"
                                                            disabled={progress === 0}
                                                            onClick={() => handleResetProgress(course.id)}
                                                        >
                                                            Reset
                                                        </button>
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
                        <div className="card shadow-md" style={{ padding: '30px' }}>
                            <h3 style={{ marginBottom: '30px' }}>Learning Insights Report</h3>
                            <div style={{ borderLeft: '4px solid var(--primary-purple)', paddingLeft: '20px' }}>
                                {childData.recentActivity.length > 0 ? (
                                    childData.recentActivity.map((activity, index) => (
                                        <div key={index} style={{
                                            marginBottom: '20px',
                                            padding: '15px',
                                            background: 'var(--surface-color)',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{activity.text}</div>
                                                <small style={{ color: 'var(--text-muted)' }}>Timestamp: {activity.time}</small>
                                            </div>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: 'var(--shadow-sm)'
                                            }}>
                                                {activity.text.includes('100%') ? '🏆' : '📚'}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--text-muted)' }}>No activities logged yet. house</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="card shadow-md" style={{ padding: '30px' }}>
                            <h3>Safety & Settings</h3>
                            <div style={{ marginTop: '30px', maxWidth: '500px' }}>
                                <div className="input-group">
                                    <label>Connected Child Profile</label>
                                    <div style={{ padding: '15px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--surface-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '1.5rem' }}>🧒</span>
                                        <strong>{childData.name} (@{childData.username})</strong>
                                    </div>
                                </div>
                                <div className="input-group" style={{ marginTop: '30px' }}>
                                    <label>Parental PIN Access</label>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                                        Require a PIN to enter this dashboard from the child's device.
                                    </p>
                                    <button className="btn btn-outline" disabled>Update PIN (Coming Soon)</button>
                                </div>
                                <div className="input-group" style={{ marginTop: '30px', padding: '20px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '15px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                    <label style={{ color: 'var(--error-color)' }}>Danger Zone</label>
                                    <button className="btn btn-link" style={{ color: 'var(--error-color)', padding: 0 }} onClick={() => alert('Feature coming soon: Please contact admin to unlink accounts.')}>
                                        Unlink Child Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default GuardianDashboard;
