import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

import { api } from '../services/api';

const Landing = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [error, setError] = useState('');
    const [loginStep, setLoginStep] = useState('credentials'); // 'credentials' or 'otp'
    const [tempUserId, setTempUserId] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await api.login(username, password);

            if (result.requiresMfa) {
                setTempUserId(result.userId);
                setLoginStep('otp');
                setError('');
                return;
            }

            // Redirect based on role (using result.user.role)
            if (result.user.role === 'admin') {
                window.location.href = '/admin';
            } else if (result.user.role === 'parent') {
                window.location.href = '/guardian-dashboard';
            } else {
                window.location.href = '/dashboard';
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleOtpVerify = async (e) => {
        e.preventDefault();
        try {
            const result = await api.verifyMfaLogin(tempUserId, otpCode);

            if (result.token) {
                // Success - redirect based on role
                if (result.user.role === 'admin') {
                    window.location.href = '/admin';
                } else if (result.user.role === 'parent') {
                    window.location.href = '/guardian-dashboard';
                } else {
                    window.location.href = '/dashboard';
                }
            } else {
                setError("Verification failed");
            }
        } catch (err) {
            setError(err.message || "Invalid OTP code");
        }
    };

    return (
        <Layout>
            {/* Hero Section */}
            <section style={{ position: 'relative', overflow: 'hidden', padding: '60px 0 80px', marginBottom: '60px' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'var(--primary-gradient)', opacity: 0.05, zIndex: -1 }}></div>

                <div className="container">
                    <div className="landing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>

                        {/* Left: Welcome Message */}
                        <div className="animate-slide-in-left">
                            <span className="badge badge-purple" style={{ marginBottom: '25px', padding: '10px 25px', fontSize: '1.1rem' }}>🎓 AI-Powered Adventure</span>
                            <h2 style={{ fontSize: '4.5rem', marginBottom: '25px', lineHeight: 1, fontFamily: 'var(--font-display)', color: 'var(--text-dark)' }}>
                                Your Learning<br />
                                <span className="text-gradient" style={{ fontSize: '5rem' }}>Adventure</span><br />
                                <span style={{ color: 'var(--primary-orange)' }}>Starts Here!</span>
                            </h2>
                            <p style={{ fontSize: '1.4rem', marginBottom: '40px', color: 'var(--text-medium)', lineHeight: 1.6, fontWeight: 500 }}>
                                Discover a world of personalized learning with fun games, AI magic, and tools made just for YOU!
                            </p>

                            {/* Feature Highlights */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '25px', marginTop: '50px' }}>
                                <div className="animate-bounce delay-1">
                                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎮</div>
                                    <h4 style={{ marginBottom: '5px', fontSize: '1.2rem', color: 'var(--primary-purple)' }}>Fun Games</h4>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>Earn XP & Badges</p>
                                </div>
                                <div className="animate-bounce delay-2">
                                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🪄</div>
                                    <h4 style={{ marginBottom: '5px', fontSize: '1.2rem', color: 'var(--primary-pink)' }}>AI Magic</h4>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>Quizzes for You</p>
                                </div>
                                <div className="animate-bounce delay-3">
                                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🌈</div>
                                    <h4 style={{ marginBottom: '5px', fontSize: '1.2rem', color: 'var(--primary-cyan)' }}>For Everyone</h4>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>Super Accessible</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Login Card */}
                        <div className="card animate-scale-in delay-2" style={{ background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', padding: '50px', borderRadius: 'var(--radius-2xl)' }}>
                            <h3 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: 'var(--primary-purple)' }}>Welcome Back!</h3>

                            {loginStep === 'credentials' ? (
                                <form onSubmit={handleLogin}>
                                    <div className="input-group">
                                        <label htmlFor="username">Your Username</label>
                                        <input type="text" id="username" placeholder="Type your username here..." required value={username} onChange={(e) => setUsername(e.target.value)} />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="password">Your Password</label>
                                        <input type="password" id="password" placeholder="Type your password here..." required value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>

                                    {error && <p style={{ color: 'var(--error-color)', textAlign: 'center', marginBottom: '20px', padding: '15px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>{error}</p>}

                                    <button type="submit" className="btn btn-primary btn-lg btn-3d" style={{ width: '100%', marginTop: '10px' }}>Let's Go! 🚀</button>

                                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                                        <p style={{ fontSize: '1.1rem', color: 'var(--text-medium)', margin: 0 }}>New here? <Link to="/register" style={{ color: 'var(--primary-orange)', fontWeight: 800, textDecoration: 'none' }}>Join the Fun!</Link></p>
                                        <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(0,0,0,0.05)', borderRadius: 'var(--radius-md)' }}>
                                            <p style={{ fontSize: '1rem', color: 'var(--text-light)', margin: 0, fontWeight: 700 }}>Quick Start:</p>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: '5px 0 0' }}>student / password123</p>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: '2px 0 0' }}>admin / admin123</p>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleOtpVerify} className="animate-fade-in">
                                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                        <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🔐</div>
                                        <h4 style={{ color: 'var(--text-dark)', marginBottom: '10px' }}>Authenticator Code</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Enter the 6-digit code from your app.</p>
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="otpCode">6-Digit Code</label>
                                        <input
                                            type="text"
                                            id="otpCode"
                                            placeholder="123456"
                                            maxLength="6"
                                            required
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value)}
                                            style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '1.5rem', fontWeight: 'bold' }}
                                            autoFocus
                                        />
                                    </div>

                                    {error && <p style={{ color: 'var(--error-color)', textAlign: 'center', marginBottom: '20px', padding: '15px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>{error}</p>}

                                    <button type="submit" className="btn btn-primary btn-lg btn-3d" style={{ width: '100%', marginTop: '10px' }}>Verify & Log In 🛡️</button>

                                    <button
                                        type="button"
                                        onClick={() => setLoginStep('credentials')}
                                        className="btn btn-ghost"
                                        style={{ width: '100%', marginTop: '20px', color: 'var(--text-muted)' }}
                                    >
                                        ← Back to Login
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container" style={{ margin: '80px auto', padding: '0 20px' }}>
                <h3 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '50px' }}>Why Choose AccessLearn?</h3>
                <div className="grid-3">
                    <div className="card card-glass hover-lift animate-fade-in">
                        <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '15px' }}>🔥</div>
                        <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Stay Motivated</h4>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 0 }}>Build learning streaks, earn badges, and level up as you progress</p>
                    </div>
                    <div className="card card-glass hover-lift animate-fade-in delay-1">
                        <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '15px' }}>📊</div>
                        <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Track Progress</h4>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 0 }}>Visual dashboards show your learning journey and achievements</p>
                    </div>
                    <div className="card card-glass hover-lift animate-fade-in delay-2">
                        <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '15px' }}>👥</div>
                        <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Parent Dashboard</h4>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 0 }}>Parents can monitor their child's progress and engagement</p>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Landing;
