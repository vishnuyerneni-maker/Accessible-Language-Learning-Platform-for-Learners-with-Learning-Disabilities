import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAccessibility } from '../context/AccessibilityContext';
import { api } from '../services/api';

const Profile = () => {
    const { theme, toggleTheme, dyslexicFont, toggleDyslexicFont, fontSize } = useAccessibility();
    const [user, setUser] = useState(null);
    const [mfaSecret, setMfaSecret] = useState('');
    const [otpInput, setOtpInput] = useState('');
    const [mfaStep, setMfaStep] = useState('none');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await api.getCurrentUser();
                setUser(currentUser);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, []);

    if (!user) return <Layout><div className="container">Loading...</div></Layout>;

    return (
        <Layout>
            <div className="container" style={{ margin: '40px auto', maxWidth: '1000px' }}>
                <header style={{ marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                    <h2>👤 My Profile</h2>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>

                    {/* Personal Details */}
                    <div className="card">
                        <h3>Personal Details</h3>
                        <form onSubmit={(e) => { e.preventDefault(); alert('Profile Updated!'); }}>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Display Name</label>
                                <input type="text" defaultValue={user.username} readOnly style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Email</label>
                                <input type="email" defaultValue={user.email} readOnly style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Role</label>
                                <input type="text" value={user.role} disabled style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--background-color)' }} />
                            </div>
                            <button className="btn btn-primary" disabled>Update via Support</button>
                        </form>
                    </div>

                    {/* Accessibility Settings */}
                    <div className="card">
                        <h3>Learning Preferences</h3>
                        <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>Customize your learning experience.</p>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Color Theme</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={toggleTheme} className="btn btn-outline" style={{ flex: 1 }}>
                                    {theme === 'light' ? '🌞 Light' : theme === 'dark' ? '🌙 Dark' : '🌗 High Contrast'}
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Font Style</label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input type="checkbox" id="pref-dyslexic" checked={dyslexicFont} onChange={toggleDyslexicFont} style={{ width: '20px', height: '20px' }} />
                                <label htmlFor="pref-dyslexic" style={{ cursor: 'pointer' }}>Use Dyslexia-Friendly Font (OpenDyslexic)</label>
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Current Font Size: {fontSize}px</label>
                            <div style={{ background: 'var(--surface-hover)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                                Using global toolbar to adjust size.
                            </div>
                        </div>
                    </div>

                    {/* Account Security (MFA) */}
                    <div className="card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>🔐 Account Security</h3>
                        <p style={{ marginBottom: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Protect your account with Microsoft Authenticator OTP.</p>

                        {!user.mfaEnabled ? (
                            <div className="animate-fade-in">
                                <button
                                    onClick={async () => {
                                        try {
                                            const { secret } = await api.generateMfaSecret();
                                            setMfaSecret(secret);
                                            setMfaStep('setup');
                                        } catch (err) {
                                            alert('Failed to generate secret');
                                        }
                                    }}
                                    className="btn btn-secondary"
                                    style={{ width: '100%' }}
                                >
                                    Enable MFA Authentication
                                </button>

                                {mfaStep === 'setup' && (
                                    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid var(--primary-purple)', borderRadius: '12px', background: 'var(--surface-color)' }}>
                                        <p style={{ fontSize: '0.85rem', margin: '0 0 5px', color: 'var(--text-color)' }}>1. Open <strong>Microsoft Authenticator</strong>.</p>
                                        <p style={{ fontSize: '0.85rem', margin: '0 0 10px', color: 'var(--text-color)' }}>2. Add an account and scan this QR code:</p>

                                        <div style={{ textAlign: 'center', background: 'white', padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`otpauth://totp/AccessLearn:${user.username}?secret=${mfaSecret}&issuer=AccessLearn`)}`}
                                                alt="MFA QR Code"
                                                style={{ width: '150px', height: '150px' }}
                                            />
                                            <div style={{ marginTop: '10px' }}>
                                                <code style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary-purple)' }}>{mfaSecret}</code>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '5px' }}>3. Enter 6-digit code to verify:</label>
                                            <input
                                                type="text"
                                                maxLength="6"
                                                placeholder="123456"
                                                value={otpInput}
                                                onChange={(e) => setOtpInput(e.target.value)}
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)' }}
                                            />
                                        </div>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await api.enableMfa(user.id, mfaSecret, otpInput);
                                                    alert('MFA Enabled Successfully!');
                                                    setUser({ ...user, mfaEnabled: true, mfaSecret });
                                                    setMfaStep('none');
                                                    setOtpInput('');
                                                } catch (err) {
                                                    alert('Invalid code or error enabling MFA.');
                                                }
                                            }}
                                            className="btn btn-primary btn-sm"
                                            style={{ width: '100%', marginTop: '5px' }}
                                        >
                                            Verify & Activate
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="animate-fade-in" style={{ padding: '20px', textAlign: 'center', border: '1px solid var(--primary-green)', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🛡️</div>
                                <h4 style={{ margin: 0, color: 'var(--primary-green)' }}>MFA is Active</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '15px' }}>Your account is protected by an extra layer of security.</p>
                                <button
                                    onClick={async () => {
                                        if (window.confirm('Disable MFA? This will reduce your account security.')) {
                                            try {
                                                await api.disableMfa(user.id);
                                                setUser({ ...user, mfaEnabled: false, mfaSecret: null });
                                                alert('MFA Disabled.');
                                            } catch (err) {
                                                alert('Failed to disable MFA');
                                            }
                                        }
                                    }}
                                    className="btn btn-outline btn-sm"
                                    style={{ color: 'var(--error-color)', fontSize: '0.8rem' }}
                                >
                                    Disable MFA
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Stats Summary */}
                    <div className="card" style={{ gridColumn: '1 / -1' }}>
                        <h3>📊 Activity Summary</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginTop: '15px', textAlign: 'center' }}>
                            <div style={{ background: 'var(--surface-hover)', padding: '15px', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ fontSize: '2rem' }}>⚡</div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{user.gamification?.xp || 0}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total XP</div>
                            </div>
                            <div style={{ background: 'var(--surface-hover)', padding: '15px', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ fontSize: '2rem' }}>🎯</div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{user.gamification?.level || 1}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Level</div>
                            </div>
                            <div style={{ background: 'var(--surface-hover)', padding: '15px', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ fontSize: '2rem' }}>🔥</div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{user.gamification?.currentStreak || 0}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Day Streak</div>
                            </div>
                            <div style={{ background: 'var(--surface-hover)', padding: '15px', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ fontSize: '2rem' }}>🏆</div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{user.gamification?.badges?.length || 0}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Badges</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default Profile;
