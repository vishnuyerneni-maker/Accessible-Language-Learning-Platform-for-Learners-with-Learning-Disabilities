import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { Volume2, Contrast, ShieldCheck, Users, User, ArrowRight, Menu, X, BrainCircuit, Activity, LockKeyhole, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../context/AccessibilityContext';

const Landing = () => {
    const navigate = useNavigate();
    const { login, verifyMfa } = useAuth();
    const { theme, toggleTheme, screenReaderActive, toggleScreenReader, enableScreenReader, disableScreenReader } = useAccessibility();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [error, setError] = useState('');
    const [loginStep, setLoginStep] = useState('credentials'); 
    const [tempUserId, setTempUserId] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    
    // Mobile Navigation State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Cognitive Load State (100 = full details, 0 = simplify/icon only)
    const [cognitiveLoad, setCognitiveLoad] = useState(100);
    const isSimplified = cognitiveLoad < 50;

    // Mouse Follower State
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        
        // Intersection Observer for Legendary Reveal Animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        revealElements.forEach(el => observer.observe(el));

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            revealElements.forEach(el => observer.unobserve(el));
        };
    }, []);

    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
    };

    const performLogin = async (usr, pwd) => {
        const result = await login(usr, pwd);

        if (result?.success || result?.requiresMfa) {
            if (result.requiresMfa) {
                setTempUserId(result.userId);
                setLoginStep('otp');
                setError('');
                return;
            }

            const user = result.user;
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'parent') navigate('/guardian-dashboard');
            else if (user.role === 'teacher') navigate('/teacher-dashboard');
            else navigate('/dashboard');
        } else {
            setError(result?.message || 'Login failed');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        await performLogin(username, password);
    };

    const handleQuickLogin = (u, p) => {
        setUsername(u);
        setPassword(p);
        performLogin(u, p);
    };

    const handleOtpVerify = async (e) => {
        e.preventDefault();
        const result = await verifyMfa(tempUserId, otpCode.trim());

        if (result.success) {
            const user = result.user;
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'parent') navigate('/guardian-dashboard');
            else navigate('/dashboard');
        } else {
            setError(result.message || "Invalid Code");
        }
    };

    // Close mobile menu on resize if screen becomes large
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Custom Antigravity Button Style
    const antigravityBtnStyle = {
        background: 'transparent',
        border: '1px solid var(--primary-cyan)',
        color: 'var(--primary-cyan)',
        padding: '12px 24px',
        borderRadius: '4px',
        fontWeight: 'bold',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
    };
    return (
        <Layout hideNavigation={true}>
            {/* Mouse follower glow */}
            {!isSimplified && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0, left: 0,
                        width: '500px', height: '500px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, rgba(0,229,255,0) 70%)',
                        transform: `translate(${mousePos.x - 250}px, ${mousePos.y - 250}px)`,
                        pointerEvents: 'none',
                        zIndex: 9998,
                        transition: 'transform 0.08s linear',
                    }}
                />
            )}

            {/* ─── TOP NAVBAR ─── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                background: theme === 'light'
                    ? 'rgba(255, 248, 242, 0.92)'
                    : 'rgba(5,5,10,0.92)',
                backdropFilter: 'blur(20px)',
                borderBottom: theme === 'light'
                    ? '1px solid rgba(124,58,237,0.15)'
                    : '1px solid rgba(0,229,255,0.15)',
                padding: '0 30px',
                height: '64px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                boxShadow: theme === 'light'
                    ? '0 4px 24px rgba(124,58,237,0.08)'
                    : '0 4px 30px rgba(0,0,0,0.4)',
                transition: 'background 0.35s ease, box-shadow 0.35s ease'
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BrainCircuit size={26} color="var(--primary-cyan)" />
                    <span style={{ fontWeight: 900, fontSize: '1.15rem', letterSpacing: '0.1em', color: theme === 'light' ? '#1E1B4B' : '#fff', fontFamily: 'var(--font-heading)' }}>MINDFLOW</span>
                </div>
                
                {/* Desktop Nav + Controls */}
                <div className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '25px' }}>
                    <a href="#about" style={{ color: theme === 'light' ? 'rgba(30,27,75,0.55)' : 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color= theme === 'light' ? '#1E1B4B' : '#fff'} onMouseOut={e => e.target.style.color= theme === 'light' ? 'rgba(30,27,75,0.55)' : 'rgba(255,255,255,0.5)'}>{t('nav.platform')}</a>
                    <a href="#developers" style={{ color: theme === 'light' ? 'rgba(30,27,75,0.55)' : 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color= theme === 'light' ? '#1E1B4B' : '#fff'} onMouseOut={e => e.target.style.color= theme === 'light' ? 'rgba(30,27,75,0.55)' : 'rgba(255,255,255,0.5)'}>{t('nav.team')}</a>
                    
                    {/* Divider */}
                    <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

                    {/* Accessibility Controls — inline in navbar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* Language */}
                        <button onClick={toggleLanguage} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                            {i18n.language === 'en' ? 'EN | HI' : 'HI | EN'}
                        </button>
                        {/* Theme */}
                        <button onClick={toggleTheme} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '5px 7px', borderRadius: '4px', display: 'flex', alignItems: 'center' }} title="Toggle Theme">
                            <Contrast size={16}/>
                        </button>
                        {/* Read Aloud — compact pill */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 6px 3px 8px', borderRadius: '20px' }}>
                            <Volume2 size={14} color={screenReaderActive ? 'var(--primary-cyan)' : 'rgba(255,255,255,0.4)'} />
                            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginRight: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('nav.aloud')}</span>
                            <button onClick={disableScreenReader} style={{ border: 'none', background: !screenReaderActive ? '#6366f1' : 'rgba(255,255,255,0.06)', color: 'white', cursor: 'pointer', fontSize: '0.65rem', padding: '2px 7px', borderRadius: '10px', fontWeight: 'bold' }}>OFF</button>
                            <button onClick={enableScreenReader} style={{ border: 'none', background: screenReaderActive ? 'var(--primary-cyan)' : 'rgba(255,255,255,0.06)', color: screenReaderActive ? '#000' : 'white', cursor: 'pointer', fontSize: '0.65rem', padding: '2px 7px', borderRadius: '10px', fontWeight: 'bold' }}>ON</button>
                        </div>
                        {/* Focus slider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('nav.focus')}</span>
                            <input type="range" min="0" max="100" value={cognitiveLoad}
                                onChange={(e) => setCognitiveLoad(e.target.value)}
                                style={{ width: '70px', accentColor: 'var(--primary-cyan)', cursor: 'pointer' }}
                            />
                        </div>
                    </div>

                    {/* Login CTA */}
                    <button onClick={() => setShowLoginModal(true)} style={{ background: 'var(--primary-cyan)', color: '#000', border: 'none', padding: '8px 18px', borderRadius: '6px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', letterSpacing: '0.05em' }}>{t('nav.login')} →</button>
                </div>

                {/* Mobile Hamburger */}
                <div className="mobile-menu-btn" style={{ display: 'block' }}>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Responsive CSS */}
            <style dangerouslySetInnerHTML={{__html: `
                @media (min-width: 768px) {
                    .desktop-nav { display: flex !important; }
                    .mobile-menu-btn { display: none !important; }
                }
            `}} />

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div style={{ position: 'fixed', top: '64px', left: 0, right: 0, background: 'rgba(5,5,10,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,229,255,0.1)', padding: '24px', zIndex: 999, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <a href="#about" style={{ color: '#fff', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Platform</a>
                    <a href="#developers" style={{ color: '#fff', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Team</a>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '8px' }}>
                        <button onClick={toggleTheme} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Contrast size={14}/> Theme</button>
                        <button onClick={toggleLanguage} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{i18n.language === 'en' ? 'HI' : 'EN'}</button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '20px' }}>
                            <Volume2 size={14} color={screenReaderActive ? 'var(--primary-cyan)' : '#888'} />
                            <button onClick={disableScreenReader} style={{ border: 'none', background: !screenReaderActive ? '#6366f1' : 'transparent', color: 'white', padding: '2px 8px', borderRadius: '8px', fontSize: '0.7rem', cursor: 'pointer' }}>OFF</button>
                            <button onClick={enableScreenReader} style={{ border: 'none', background: screenReaderActive ? 'var(--primary-cyan)' : 'transparent', color: screenReaderActive ? '#000' : 'white', padding: '2px 8px', borderRadius: '8px', fontSize: '0.7rem', cursor: 'pointer' }}>ON</button>
                        </div>
                    </div>
                    <button onClick={() => { setShowLoginModal(true); setIsMobileMenuOpen(false); }} style={{ background: 'var(--primary-cyan)', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>LOGIN →</button>
                </div>
            )}

            {/* Login Modal Overlay */}
            {showLoginModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                    <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '450px', padding: '40px', background: 'var(--surface-color)', border: '1px solid var(--primary-cyan)', borderRadius: '8px', position: 'relative', boxShadow: '0 0 40px rgba(0,229,255,0.1)' }}>
                        <button onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24}/></button>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                            <BrainCircuit size={48} color="var(--primary-cyan)" />
                        </div>
                        
                        <h3 style={{ textAlign: 'center', marginBottom: '30px', fontFamily: 'monospace', letterSpacing: '0.1em', color: 'var(--text-dark)' }}>{t('modal.login')}</h3>

                        {loginStep === 'credentials' ? (
                            <form onSubmit={handleLogin}>
                                <div className="input-group" style={{ marginBottom: '20px' }}>
                                    <input type="text" placeholder={t('modal.username')} required value={username} onChange={(e) => setUsername(e.target.value)} style={{ background: '#000', color: 'var(--primary-cyan)', border: '1px solid rgba(255,255,255,0.1)', minHeight: '44px', width: '100%', padding: '10px 15px', fontFamily: 'monospace' }} />
                                </div>
                                <div className="input-group" style={{ marginBottom: '25px' }}>
                                    <input type="password" placeholder={t('modal.password')} required value={password} onChange={(e) => setPassword(e.target.value)} style={{ background: '#000', color: 'var(--primary-cyan)', border: '1px solid rgba(255,255,255,0.1)', minHeight: '44px', width: '100%', padding: '10px 15px', fontFamily: 'monospace' }} />
                                </div>
                                {error && <p style={{ color: 'var(--error-color)', textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem' }}>ERR: {error}</p>}
                                
                                <button type="submit" style={{ ...antigravityBtnStyle, width: '100%', justifyContent: 'center', background: 'rgba(0,229,255,0.1)' }}>{t('modal.enter')}</button>
                                
                                <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('modal.demo')}</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                                        <button type="button" onClick={() => handleQuickLogin('admin', 'admin123')} style={{ background: '#111', border: '1px solid var(--primary-cyan)', color: 'var(--primary-cyan)', padding: '5px', fontSize: '0.7rem', cursor: 'pointer' }}>Admin</button>
                                        
                                        <button type="button" onClick={() => handleQuickLogin('teacher1', 'password123')} style={{ background: '#111', border: '1px solid var(--primary-purple)', color: 'var(--primary-purple)', padding: '5px', fontSize: '0.7rem', cursor: 'pointer' }}>T1</button>
                                        <button type="button" onClick={() => handleQuickLogin('teacher2', 'password123')} style={{ background: '#111', border: '1px solid var(--primary-purple)', color: 'var(--primary-purple)', padding: '5px', fontSize: '0.7rem', cursor: 'pointer' }}>T2</button>
                                        
                                        <button type="button" onClick={() => handleQuickLogin('parent1', 'password123')} style={{ background: '#111', border: '1px solid var(--primary-green)', color: 'var(--primary-green)', padding: '5px', fontSize: '0.7rem', cursor: 'pointer' }}>P1</button>
                                        <button type="button" onClick={() => handleQuickLogin('parent2', 'password123')} style={{ background: '#111', border: '1px solid var(--primary-green)', color: 'var(--primary-green)', padding: '5px', fontSize: '0.7rem', cursor: 'pointer' }}>P2</button>
                                        <button type="button" onClick={() => handleQuickLogin('parent3', 'password123')} style={{ background: '#111', border: '1px solid var(--primary-green)', color: 'var(--primary-green)', padding: '5px', fontSize: '0.7rem', cursor: 'pointer' }}>P3</button>

                                        <button type="button" onClick={() => handleQuickLogin('student1a', 'password123')} style={{ background: '#111', border: '1px solid var(--primary-orange)', color: 'var(--primary-orange)', padding: '5px', fontSize: '0.7rem', cursor: 'pointer' }}>S1A</button>
                                        <button type="button" onClick={() => handleQuickLogin('student1b', 'password123')} style={{ background: '#111', border: '1px solid var(--primary-orange)', color: 'var(--primary-orange)', padding: '5px', fontSize: '0.7rem', cursor: 'pointer' }}>S1B</button>
                                        <button type="button" onClick={() => handleQuickLogin('student2a', 'password123')} style={{ background: '#111', border: '1px solid var(--primary-orange)', color: 'var(--primary-orange)', padding: '5px', fontSize: '0.7rem', cursor: 'pointer' }}>S2A</button>
                                        <button type="button" onClick={() => handleQuickLogin('student2b', 'password123')} style={{ background: '#111', border: '1px solid var(--primary-orange)', color: 'var(--primary-orange)', padding: '5px', fontSize: '0.7rem', cursor: 'pointer' }}>S2B</button>
                                        <button type="button" onClick={() => handleQuickLogin('student3a', 'password123')} style={{ background: '#111', border: '1px solid var(--primary-orange)', color: 'var(--primary-orange)', padding: '5px', fontSize: '0.7rem', cursor: 'pointer' }}>S3A</button>
                                        <button type="button" onClick={() => handleQuickLogin('student3b', 'password123')} style={{ background: '#111', border: '1px solid var(--primary-orange)', color: 'var(--primary-orange)', padding: '5px', fontSize: '0.7rem', cursor: 'pointer' }}>S3B</button>
                                    </div>
                                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                        <Link to="/register" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }} onClick={() => setShowLoginModal(false)}>{t('modal.register')}</Link>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleOtpVerify}>
                                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                    <LockKeyhole size={48} style={{ color: 'var(--primary-cyan)', margin: '0 auto 15px' }} />
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('modal.mfa')}</p>
                                </div>
                                <div className="input-group">
                                    <input type="text" placeholder="000000" maxLength="6" required value={otpCode} onChange={(e) => setOtpCode(e.target.value)} style={{ background: '#000', color: 'var(--primary-cyan)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', letterSpacing: '8px', fontSize: '1.5rem', fontFamily: 'monospace', minHeight: '50px', width: '100%' }} autoFocus />
                                </div>
                                {error && <p style={{ color: 'var(--error-color)', textAlign: 'center', marginTop: '15px' }}>ERR: {error}</p>}
                                <button type="submit" style={{ ...antigravityBtnStyle, width: '100%', justifyContent: 'center', background: 'rgba(0,229,255,0.1)', marginTop: '20px' }}>{t('modal.verify')}</button>
                                <button type="button" onClick={() => setLoginStep('credentials')} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', width: '100%', marginTop: '15px', cursor: 'pointer', fontSize: '0.85rem' }}>{t('modal.disconnect')}</button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* ─── HERO SECTION ─── */}
            <section className="landing-hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '120px 20px 80px', background: '#05050a' }}>

                {/* Aurora background */}
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,229,255,0.12), transparent), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(139,92,246,0.1), transparent)', zIndex: 0, pointerEvents: 'none' }} />

                {/* Animated grid */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '60px 60px', zIndex: 0, pointerEvents: 'none', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)' }} />

                {/* Ambient orbs */}
                <div style={{ position: 'absolute', top: '15%', left: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'var(--primary-cyan)', filter: 'blur(180px)', opacity: 0.07, zIndex: 0, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: '#8b5cf6', filter: 'blur(150px)', opacity: 0.08, zIndex: 0, pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '700px', borderRadius: '50%', background: 'var(--primary-cyan)', filter: 'blur(200px)', opacity: 0.04, zIndex: 0, pointerEvents: 'none' }} />

                {/* Floating emoji particles */}
                {!isSimplified && [
                    { emoji: '📚', x: '7%', y: '20%', delay: '0s', size: '2.2rem' },
                    { emoji: '🎯', x: '91%', y: '28%', delay: '1.2s', size: '2rem' },
                    { emoji: '🏆', x: '4%', y: '68%', delay: '2.1s', size: '1.8rem' },
                    { emoji: '✨', x: '87%', y: '62%', delay: '0.7s', size: '1.6rem' },
                    { emoji: '🎮', x: '14%', y: '82%', delay: '1.8s', size: '1.8rem' },
                    { emoji: '🧠', x: '78%', y: '15%', delay: '0.3s', size: '1.7rem' },
                ].map((p, i) => (
                    <span key={i} style={{ position: 'absolute', left: p.x, top: p.y, fontSize: p.size, opacity: 0.2, animation: 'floatParticle 5s ease-in-out infinite', animationDelay: p.delay, pointerEvents: 'none', zIndex: 0, filter: 'blur(0.5px)' }}>{p.emoji}</span>
                ))}

                <div className="container" style={{ zIndex: 1, maxWidth: '1000px', margin: '0 auto', width: '100%' }}>

                    {/* Tag line badge */}
                    {!isSimplified && (
                        <div className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(0,229,255,0.35)', padding: '6px 18px', borderRadius: '30px', marginBottom: '50px', background: 'rgba(0,229,255,0.05)', backdropFilter: 'blur(8px)' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-cyan)', display: 'inline-block', boxShadow: '0 0 8px var(--primary-cyan)', animation: 'pulse 2s infinite' }} />
                            <Activity size={14} color="var(--primary-cyan)" />
                            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--primary-cyan)' }}>{t('landing.heroBadge')}</span>
                        </div>
                    )}

                    {/* Main headline */}
                    <h1 className="reveal" style={{ fontSize: 'clamp(3.2rem, 9vw, 6.5rem)', marginBottom: '28px', lineHeight: 1.0, fontWeight: 900, letterSpacing: '-0.04em', color: '#fff' }}>
                        {t('landing.headline').split(',')[0]},<br />
                        <span style={{
                            background: 'linear-gradient(90deg, var(--primary-cyan), #a78bfa, var(--primary-cyan))',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            animation: 'shimmer 4s linear infinite',
                        }}>{t('landing.headline').split(',')[1]}</span>
                    </h1>

                    {/* Sub-headline */}
                    {!isSimplified && (
                        <p className="reveal delay-1" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: 'rgba(255,255,255,0.55)', maxWidth: '600px', marginBottom: '55px', lineHeight: 1.7 }}>
                            {t('landing.subHeadline')}
                        </p>
                    )}

                    {/* CTA Row */}
                    <div className="reveal delay-2" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '60px' }}>
                        <button onClick={() => setShowLoginModal(true)} style={antigravityBtnStyle}>
                            {t('landing.ctaLogin')} <ArrowRight size={18} />
                        </button>
                        <Link to="/register" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>{t('landing.ctaRegister')}</Link>
                    </div>

                    {/* Quick Access */}
                    <div className="reveal delay-3" style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: '8px' }}>{t('landing.quickAccess')}</span>
                        <button onClick={() => handleQuickLogin('admin', 'admin123')} style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.3)', color: 'var(--primary-cyan)', padding: '4px 10px', fontSize: '0.7rem', cursor: 'pointer', borderRadius: '20px' }}>Admin</button>
                        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem' }}>T:</span>
                        <button onClick={() => handleQuickLogin('teacher1', 'password123')} style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa', padding: '4px 10px', fontSize: '0.7rem', cursor: 'pointer', borderRadius: '20px' }}>T1</button>
                        <button onClick={() => handleQuickLogin('teacher2', 'password123')} style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa', padding: '4px 10px', fontSize: '0.7rem', cursor: 'pointer', borderRadius: '20px' }}>T2</button>
                        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem' }}>P:</span>
                        <button onClick={() => handleQuickLogin('parent1', 'password123')} style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', padding: '4px 10px', fontSize: '0.7rem', cursor: 'pointer', borderRadius: '20px' }}>P1</button>
                        <button onClick={() => handleQuickLogin('parent2', 'password123')} style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', padding: '4px 10px', fontSize: '0.7rem', cursor: 'pointer', borderRadius: '20px' }}>P2</button>
                        <button onClick={() => handleQuickLogin('parent3', 'password123')} style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', padding: '4px 10px', fontSize: '0.7rem', cursor: 'pointer', borderRadius: '20px' }}>P3</button>
                        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem' }}>S:</span>
                        {['1A','1B','2A','2B','3A','3B'].map(s => (
                            <button key={s} onClick={() => handleQuickLogin(`student${s.toLowerCase()}`, 'password123')} style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.3)', color: '#fb923c', padding: '4px 10px', fontSize: '0.7rem', cursor: 'pointer', borderRadius: '20px' }}>{s}</button>
                        ))}
                    </div>

                    {/* Stat badges */}
                    {!isSimplified && (
                        <div className="reveal delay-4" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '50px' }}>
                            {[
                                { val: '4', label: t('landing.stats.userRoles'), color: 'var(--primary-cyan)' },
                                { val: '6+', label: t('landing.stats.a11yTools'), color: '#a78bfa' },
                                { val: '10+', label: t('landing.stats.courses'), color: '#4ade80' },
                                { val: '5', label: t('landing.stats.team'), color: '#fb923c' },
                            ].map((s, i) => (
                                <div key={i} className="hover-lifting" style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
                                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '4px' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Keyframe styles */}
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes floatParticle {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(10deg); }
                    }
                    @keyframes shimmer {
                        0% { background-position: 0% center; }
                        100% { background-position: 200% center; }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--primary-cyan); }
                        50% { opacity: 0.5; box-shadow: 0 0 16px var(--primary-cyan); }
                    }
                `}} />
            </section>

            {!isSimplified && (
                <section id="about" style={{ padding: '80px 20px', position: 'relative', borderTop: theme === 'light' ? '1px solid rgba(124,58,237,0.1)' : '1px solid rgba(0,229,255,0.1)', overflow: 'hidden' }}>
                    {/* Ambient background glow */}
                    <div style={{ position: 'absolute', top: '30%', left: '-10%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'var(--primary-cyan)', filter: 'blur(140px)', opacity: 0.04, pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '20%', right: '-5%', width: '35vw', height: '35vw', borderRadius: '50%', background: 'var(--primary-purple)', filter: 'blur(140px)', opacity: 0.05, pointerEvents: 'none' }} />

                    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

                        {/* ── Mission (Problem / Solution) ── */}
                        <div className="reveal" style={{ marginBottom: '80px', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(0,229,255,0.3)', padding: '6px 16px', borderRadius: '4px', marginBottom: '20px', background: 'rgba(0,0,0,0.4)' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-cyan)', letterSpacing: '0.1em' }}>{t('landing.mission.badge')}</span>
                            </div>
                            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '30px', fontWeight: 800 }}>{t('landing.mission.title')}</h2>
                            <p style={{ fontSize: '1.25rem', color: 'var(--text-medium)', maxWidth: '800px', margin: '0 auto 50px', lineHeight: 1.6 }}>
                                {t('landing.mission.description')}
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                                <div className="reveal-left card shadow-lg hover-3d" style={{ padding: '40px', textAlign: 'left', border: '1px solid rgba(239, 68, 68, 0.2)', background: theme === 'light' ? '#fff' : 'rgba(239, 68, 68, 0.02)' }}>
                                    <div style={{ color: 'var(--error-color)', marginBottom: '20px', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.1em' }}>01. {t('landing.mission.problemTitle')}</div>
                                    <h3 style={{ marginBottom: '20px', fontSize: '1.6rem' }}>{t('landing.mission.problemText').split('.')[0]}.</h3>
                                    <p style={{ color: 'var(--text-medium)', lineHeight: 1.6 }}>
                                        {t('landing.mission.problemText').split('.').slice(1).join('.')}
                                    </p>
                                </div>
                                <div className="reveal-right card shadow-lg hover-3d" style={{ padding: '40px', textAlign: 'left', border: '1px solid rgba(16, 185, 129, 0.2)', background: theme === 'light' ? '#fff' : 'rgba(16, 185, 129, 0.02)' }}>
                                    <div style={{ color: '#10b981', marginBottom: '20px', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.1em' }}>02. {t('landing.mission.solutionTitle')}</div>
                                    <h3 style={{ marginBottom: '20px', fontSize: '1.6rem' }}>{t('landing.mission.solutionText').split('-')[0]}</h3>
                                    <p style={{ color: 'var(--text-medium)', lineHeight: 1.6 }}>
                                        {t('landing.mission.solutionText').split('-').slice(1).join('-')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Novelties / What Makes Us Different ── */}
                        <div style={{ marginTop: '120px' }}>
                            <div className="reveal" style={{ textAlign: 'center', marginBottom: '70px' }}>
                                <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '15px' }}>
                                    {t('landing.novelties.title1')} <span className="text-shimmer">{t('landing.novelties.title2')}</span>
                                </h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', letterSpacing: '0.05em' }}>{t('landing.novelties.subTitle')}</p>
                            </div>

                            <div className="grid grid-3" style={{ gap: '30px' }}>
                                {[
                                    { icon: <Activity />, title: t('landing.novelties.f1Title'), desc: t('landing.novelties.f1Desc'), color: 'var(--primary-purple)' },
                                    { icon: <Volume2 />, title: t('landing.novelties.f2Title'), desc: t('landing.novelties.f2Desc'), color: 'var(--primary-cyan)' },
                                    { icon: <BrainCircuit />, title: t('landing.novelties.f3Title'), desc: t('landing.novelties.f3Desc'), color: 'var(--primary-orange)' },
                                    { icon: <Sparkles />, title: t('landing.novelties.f4Title'), desc: t('landing.novelties.f4Desc'), color: 'var(--primary-pink)' },
                                    { icon: <Users />, title: t('landing.novelties.f5Title'), desc: t('landing.novelties.f5Desc'), color: '#10b981' },
                                    { icon: <ShieldCheck />, title: t('landing.novelties.f6Title'), desc: t('landing.novelties.f6Desc'), color: '#6366f1' }
                                ].map((f, i) => (
                                    <div key={i} className="reveal card shadow-md hover-3d glass-glow" style={{ padding: '30px', border: '1px solid var(--border-color)', background: theme === 'light' ? '#fff' : 'rgba(255,255,255,0.01)', transition: 'all 0.3s' }}>
                                        <div style={{ padding: '12px', background: `${f.color}15`, borderRadius: '12px', display: 'inline-flex', marginBottom: '20px', color: f.color }}>
                                            {React.cloneElement(f.icon, { size: 24 })}
                                        </div>
                                        <h4 style={{ fontSize: '1.3rem', marginBottom: '15px', fontWeight: 800 }}>{f.title}</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{f.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Feature Previews with Images ── */}
                        <div className="reveal" style={{ marginTop: '120px', marginBottom: '80px' }}>
                            <h3 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '40px', color: 'var(--text-dark)', textAlign: 'center' }}>
                                {t('landing.previews.title1')} <span style={{ color: 'var(--primary-cyan)' }}>{t('landing.previews.title2')}</span>
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
                                {[
                                    { src: `${import.meta.env.BASE_URL || '/'}feature_dashboard.png`, fallback: '🖥️', label: t('landing.previews.p1Title'), desc: t('landing.previews.p1Desc'), color: 'var(--primary-cyan)' },
                                    { src: `${import.meta.env.BASE_URL || '/'}feature_accessibility.png`, fallback: '♿', label: t('landing.previews.p2Title'), desc: t('landing.previews.p2Desc'), color: 'var(--primary-green)' },
                                    { src: `${import.meta.env.BASE_URL || '/'}feature_quiz.png`, fallback: '📝', label: t('landing.previews.p3Title'), desc: t('landing.previews.p3Desc'), color: 'var(--primary-purple)' },
                                ].map((feature, i) => (
                                    <div key={i} className="card shadow-md hover-3d" style={{ background: 'var(--surface-color)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', transition: 'transform 0.3s, box-shadow 0.3s' }}>
                                        <div style={{ height: '200px', background: 'var(--surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', position: 'relative', overflow: 'hidden' }}>
                                            <span style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${feature.color}15 0%, transparent 70%)` }} />
                                            {feature.fallback}
                                        </div>
                                        <div style={{ padding: '20px' }}>
                                            <h4 style={{ margin: '0 0 8px 0', color: feature.color, fontWeight: 800 }}>{feature.label}</h4>
                                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Future Enhancements ── */}
                        <div className="reveal" style={{ marginBottom: '80px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '40px' }}>
                            <h3 style={{ fontSize: '2rem', marginBottom: '25px', color: 'var(--text-dark)' }}>{t('landing.future.title1')} <span style={{ color: 'var(--primary-purple)' }}>{t('landing.future.title2')}</span></h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                                {[
                                    { icon: '🎙️', text: t('landing.future.e1') },
                                    { icon: '🧬', text: t('landing.future.e2') },
                                    { icon: '📲', text: t('landing.future.e3') },
                                    { icon: '🌍', text: t('landing.future.e4') },
                                ].map((e, i) => (
                                    <div key={i} className="hover-lift" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '15px', background: 'var(--surface-elevated)', borderRadius: '12px' }}>
                                        <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{e.icon}</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>{e.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Developer Team ── */}
                        <div id="developers" className="reveal">
                            <h3 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '10px', color: 'var(--text-dark)', textAlign: 'center' }}>{t('landing.team.title1')} <span style={{ color: 'var(--primary-cyan)' }}>{t('landing.team.title2')}</span></h3>
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1rem' }}>{t('landing.team.subTitle')}</p>
                            
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                                {[
                                    { name: 'Yerneni Vishnu Vardhan', role: t('landing.team.roles.frontend'), color: 'var(--primary-cyan)', emoji: '💻' },
                                    { name: 'Gyas Sheik', role: t('landing.team.roles.backend'), color: 'var(--primary-purple)', emoji: '⚙️' },
                                    { name: 'Siva Sathwik', role: t('landing.team.roles.fullstack'), color: 'var(--primary-green)', emoji: '🚀' },
                                    { name: 'DJ Avinash', role: t('landing.team.roles.qa'), color: 'var(--primary-orange)', emoji: '🔍' },
                                    { name: 'Naveen Paventa', role: t('landing.team.roles.devops'), color: '#F472B6', emoji: '🛠️' },
                                ].map((dev, i) => (
                                    <div key={i} className="card hover-lift" style={{ background: 'var(--surface-color)', border: `1px solid ${dev.color}40`, borderTop: `3px solid ${dev.color}`, borderRadius: '16px', padding: '25px 30px', textAlign: 'center', minWidth: '200px', transition: 'all 0.3s', cursor: 'default' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{dev.emoji}</div>
                                        <h5 style={{ color: 'var(--text-dark)', margin: '0 0 6px 0', fontSize: '1rem' }}>{dev.name}</h5>
                                        <span style={{ color: dev.color, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{dev.role}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Meta styles */}
                    <style dangerouslySetInnerHTML={{ __html: `
                        @keyframes float {
                            0%, 100% { transform: translateY(0px); }
                            50% { transform: translateY(-12px); }
                        }
                    ` }} />
                </section>
            )}

            {/* ── FOOTER ── */}
            <footer style={{ padding: '60px 30px', background: theme === 'light' ? '#fff' : '#05050a', borderTop: theme === 'light' ? '1px solid rgba(124,58,237,0.1)' : '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                    <BrainCircuit size={24} color="var(--primary-cyan)" />
                    <span style={{ fontWeight: 900, letterSpacing: '0.15em', fontSize: '1rem', color: theme === 'light' ? '#1E1B4B' : '#fff' }}>MINDFLOW</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.05em', maxWidth: '600px', margin: '0 auto 30px', lineHeight: 1.6 }}>
                    {t('footer.rights')}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    {/* Placeholder social icons or similar */}
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
            </footer>

        </Layout>
    );
};

export default Landing;
