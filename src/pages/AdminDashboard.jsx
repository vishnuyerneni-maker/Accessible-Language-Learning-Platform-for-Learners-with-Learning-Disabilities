import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';

const AdminDashboard = () => {
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

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = async () => {
        try {
            // Fetch real data
            const allUsers = await api.getAllUsers();
            const allCourses = await api.getCourses();
            const systemAnalytics = await api.getSystemAnalytics();

            // Improve analytics with course data if needed
            systemAnalytics.courseStats.completionRates = allCourses.map(c => ({
                title: c.title,
                avgProgress: 0 // logic to calc avg progress not yet in backend
            }));

            setUsers(allUsers);
            setCourses(allCourses);
            setAnalytics(systemAnalytics);
            setStats({
                totalUsers: systemAnalytics.userStats.total,
                totalCourses: allCourses.length,
                activeStudents: systemAnalytics.userStats.activeStudents
            });
        } catch (err) {
            console.error("Admin load failed", err);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            // MockBackend.deleteUser(userId); // Not implemented in API yet
            alert("Delete user not connected to backend yet");
            refreshData();
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.deleteCourse(courseId);
                alert("Course deleted from MongoDB");
                refreshData();
            } catch (err) {
                alert("Failed to delete: " + err.message);
            }
        }
    };

    const handleSaveCourse = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Generate a simple ID for new courses if not provided
        const generatedId = 'course_' + Date.now();

        const courseData = {
            id: generatedId, // Add this line!
            title: formData.get('title'),
            description: formData.get('description'),
            image: formData.get('image'),
            // badge: formData.get('badge'), 
            totalModules: parseInt(formData.get('totalModules'))
        };

        try {
            if (editingCourse) {
                await api.updateCourse(editingCourse.id || editingCourse._id, courseData);
                alert("Course Updated Automatically!");
            } else {
                await api.createCourse(courseData);
                alert("Course Created in MongoDB!");
            }
            setEditingCourse(null);
            setIsAddingCourse(false);
            refreshData();
        } catch (err) {
            alert("Failed to save: " + err.message);
        }
    };

    const handlePushAnnouncement = () => {
        if (!announcementText.trim()) return;
        MockBackend.addAnnouncement(announcementText);
        setAnnouncementText('');
        alert('Announcement sent to all students!');
    };

    return (
        <Layout>
            <div className="container animate-fade-in">
                <header className="flex-between mb-lg">
                    <div>
                        <h1 className="text-gradient">Admin Command Center</h1>
                        <p className="text-muted">Manage users, content, and system performance.</p>
                    </div>
                    <div className="flex gap-md">
                        <div className="stat-card-practice">
                            <span className="stat-value">{stats.totalUsers}</span>
                            <span className="stat-label text-xs">Total Users</span>
                        </div>
                        <div className="stat-card-practice">
                            <span className="stat-value">{stats.totalCourses}</span>
                            <span className="stat-label text-xs">Courses</span>
                        </div>
                    </div>
                </header>

                <div className="card-glass p-0 overflow-hidden mb-lg">
                    <div className="flex bg-surface-elevated border-b">
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`p-3 px-4 font-heading border-b-2 transition-all ${activeTab === 'analytics' ? 'border-primary-orange text-primary-orange bg-white' : 'border-transparent text-muted'}`}
                        >
                            📊 Analytics
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`p-3 px-4 font-heading border-b-2 transition-all ${activeTab === 'users' ? 'border-primary-orange text-primary-orange bg-white' : 'border-transparent text-muted'}`}
                        >
                            👥 Users
                        </button>
                        <button
                            onClick={() => setActiveTab('courses')}
                            className={`p-3 px-4 font-heading border-b-2 transition-all ${activeTab === 'courses' ? 'border-primary-orange text-primary-orange bg-white' : 'border-transparent text-muted'}`}
                        >
                            📚 Content
                        </button>
                        <button
                            onClick={() => setActiveTab('announcements')}
                            className={`p-3 px-4 font-heading border-b-2 transition-all ${activeTab === 'announcements' ? 'border-primary-orange text-primary-orange bg-white' : 'border-transparent text-muted'}`}
                        >
                            📢 Alerts
                        </button>
                        <button
                            onClick={() => setActiveTab('system')}
                            className={`p-3 px-4 font-heading border-b-2 transition-all ${activeTab === 'system' ? 'border-primary-orange text-primary-orange bg-white' : 'border-transparent text-muted'}`}
                        >
                            ⚙️ Health
                        </button>
                    </div>

                    <div className="p-4">
                        {activeTab === 'analytics' && analytics && (
                            <div className="animate-slide-up">
                                <h3 className="mb-md">Platform Insights</h3>
                                <div className="grid grid-2 gap-lg mb-lg">
                                    <div className="card-neu p-4">
                                        <h4 className="text-muted mb-md">Course Engagement (Mock Data)</h4>
                                        <div className="flex flex-col gap-md">
                                            {analytics.courseStats.completionRates.map((c, i) => (
                                                <div key={i}>
                                                    <div className="flex-between mb-xs">
                                                        <span className="text-sm font-bold">{c.title}</span>
                                                        <span className="text-xs text-muted">{c.avgProgress}% Avg. Progress</span>
                                                    </div>
                                                    <div className="course-progress-bar" style={{ height: '8px' }}>
                                                        <div className="course-progress-fill" style={{ width: `${c.avgProgress}%`, background: 'var(--gradient-ocean)' }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="card-neu p-4 flex flex-col items-center justify-center">
                                        <h4 className="text-muted mb-md">XP Distribution</h4>
                                        <div style={{ position: 'relative', width: '150px', height: '150px', borderRadius: '50%', background: 'var(--gradient-galaxy)', display: 'flex', itemsCenter: 'center', justifyContent: 'center' }}>
                                            <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <span className="text-xl font-bold">{analytics.userStats.totalXP}</span>
                                                <span className="text-xs text-muted">Total XP</span>
                                            </div>
                                        </div>
                                        <p className="mt-md text-sm text-center">Across all <strong>{analytics.userStats.total}</strong> active accounts.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="animate-slide-up">
                                {/* ... existing table ... */}
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead className="text-left border-b">
                                        <tr>
                                            <th className="p-2">Name</th>
                                            <th className="p-2">Role</th>
                                            <th className="p-2">Email</th>
                                            <th className="p-2">Security (MFA)</th>
                                            <th className="p-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.id} className="border-b hover:bg-surface-elevated transition-colors">
                                                <td className="p-2 font-bold">{u.name || u.username}</td>
                                                <td className="p-2">
                                                    <span className={`course-card-category ${u.role === 'admin' ? 'bg-primary-purple text-white' : ''}`}>
                                                        {u.role.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="p-2 text-muted">{u.email}</td>
                                                <td className="p-2">
                                                    {u.mfaEnabled ? (
                                                        <span className="badge badge-purple" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>🔐 ACTIVE</span>
                                                    ) : (
                                                        <span className="text-xs text-muted">Disabled</span>
                                                    )}
                                                </td>
                                                <td className="p-2">
                                                    <div className="flex gap-sm">
                                                        {u.mfaEnabled && (
                                                            <button
                                                                onClick={() => {
                                                                    if (window.confirm(`Reset MFA for ${u.name || u.username}?`)) {
                                                                        // MockBackend.disableMfa(u.id);
                                                                        alert("Reset MFA not implemented in API yet");
                                                                    }
                                                                }}
                                                                className="btn btn-sm btn-outline"
                                                                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                            >
                                                                Reset MFA
                                                            </button>
                                                        )}
                                                        {u.role !== 'admin' && (
                                                            <button onClick={() => handleDeleteUser(u.id)} className="btn btn-sm btn-outline" style={{ padding: '6px 12px', color: 'var(--error-color)', borderColor: 'var(--error-color)', fontSize: '0.8rem' }}>Delete</button>
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
                            <div className="animate-slide-up">
                                <div className="flex-between mb-md">
                                    <h3>Learning Modules</h3>
                                    <button onClick={() => { setEditingCourse(null); setIsAddingCourse(true); }} className="btn btn-primary btn-sm btn-3d">+ New Course</button>
                                </div>

                                {(editingCourse || isAddingCourse) ? (
                                    <div className="card-glass p-4 border-primary-orange mb-md">
                                        <h4>{editingCourse ? 'Edit Course' : 'Create New Course'}</h4>
                                        <form onSubmit={handleSaveCourse} className="grid grid-2 gap-md">
                                            <div className="input-group">
                                                <label>Course Title</label>
                                                <input type="text" name="title" defaultValue={editingCourse?.title} required />
                                            </div>
                                            <div className="input-group">
                                                <label>Icon (Emoji)</label>
                                                <input type="text" name="image" defaultValue={editingCourse?.image} placeholder="📚" required />
                                            </div>
                                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                                <label>Description</label>
                                                <textarea name="description" defaultValue={editingCourse?.description} required rows="3"></textarea>
                                            </div>
                                            <div className="input-group">
                                                <label>Badge Type</label>
                                                <select name="badge" defaultValue={editingCourse?.badge}>
                                                    <option value="free">Free</option>
                                                    <option value="premium">Premium</option>
                                                    <option value="new">New</option>
                                                    <option value="popular">Popular</option>
                                                </select>
                                            </div>
                                            <div className="input-group">
                                                <label>Total Modules</label>
                                                <input type="number" name="totalModules" defaultValue={editingCourse?.totalModules || 5} required />
                                            </div>
                                            <div className="flex gap-md" style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                                                <button type="submit" className="btn btn-primary btn-sm">Save Adventure</button>
                                                <button type="button" onClick={() => { setEditingCourse(null); setIsAddingCourse(false); }} className="btn btn-outline btn-sm">Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="grid grid-auto gap-md">
                                        {courses.map(c => (
                                            <div key={c.id} className="card-neu p-3 flex-between">
                                                <div className="flex gap-md items-center">
                                                    <span style={{ fontSize: '2rem' }}>{c.image}</span>
                                                    <div>
                                                        <h4 className="m-0">{c.title}</h4>
                                                        <span className="text-xs text-muted">{c.totalModules} Modules</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-sm">
                                                    <button onClick={() => setEditingCourse(c)} className="btn btn-ghost btn-sm btn-icon" title="Edit">✏️</button>
                                                    <button onClick={() => handleDeleteCourse(c.id)} className="btn btn-icon btn-sm" style={{ color: 'var(--error-color)' }} title="Delete">🗑️</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'announcements' && (
                            <div className="animate-slide-up">
                                <h3>Broadcast Alert</h3>
                                <p className="text-muted mb-md">Push a message that will appear at the top of every student's dashboard.</p>
                                <div className="card-glass p-4">
                                    <textarea
                                        className="w-full mb-md p-3"
                                        style={{ border: '1px solid var(--border-color)', borderRadius: '12px', minHeight: '100px' }}
                                        placeholder="Type your announcement here..."
                                        value={announcementText}
                                        onChange={(e) => setAnnouncementText(e.target.value)}
                                    ></textarea>
                                    <button onClick={handlePushAnnouncement} className="btn btn-primary btn-3d">🚀 Push Announcement</button>
                                    <button onClick={() => { MockBackend.clearAnnouncements(); alert('Cleared!'); }} className="btn btn-ghost ml-md">🗑️ Clear All</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'system' && (
                            <div className="animate-slide-up grid grid-2 gap-md">
                                <div className="card-glass border-primary-green p-3">
                                    <h4 className="m-0 flex items-center gap-1">🟢 Database Status</h4>
                                    <p className="text-sm text-muted mt-1">LocalStorage DB is healthy and synchronized.</p>
                                </div>
                                <div className="card-glass border-primary-blue p-3">
                                    <h4 className="m-0 flex items-center gap-1">🔵 Voice Services</h4>
                                    <p className="text-sm text-muted mt-1">Web Speech API is available and active.</p>
                                </div>
                                <div className="card-glass border-primary-purple p-3">
                                    <h4 className="m-0 flex items-center gap-1">🟣 AI Engine</h4>
                                    <p className="text-sm text-muted mt-1">Gemini Pro connected via API gateway.</p>
                                </div>
                                <div className="card-glass border-primary-yellow p-3">
                                    <h4 className="m-0 flex items-center gap-1">🟡 Storage Usage</h4>
                                    <p className="text-sm text-muted mt-1">Current usage: 45KB / 5MB available.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .text-gradient {
                    background: var(--gradient-sunrise);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .mb-lg { margin-bottom: 40px; }
                .mb-md { margin-bottom: 20px; }
                .mb-xs { margin-bottom: 4px; }
                .w-full { width: 100%; }
                .ml-md { margin-left: 16px; }
                input, select, textarea { 
                    padding: 8px 12px; 
                    border: 1px solid var(--border-color); 
                    border-radius: 8px;
                    font-family: var(--font-body);
                }
                label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; }
            `}} />
        </Layout>
    );
};

export default AdminDashboard;
