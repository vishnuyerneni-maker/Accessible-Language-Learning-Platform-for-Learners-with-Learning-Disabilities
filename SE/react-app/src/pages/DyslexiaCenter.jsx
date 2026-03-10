import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { PhonicsLesson, BlendingPractice } from '../components/PhonicsModule';
import { LetterTracing } from '../components/LetterTracing';
import { MiniGames } from '../components/MiniGames';
import { RhymeLab } from '../components/RhymeLab';
import { courseAPI } from '../utils/api';
import '../styles/dyslexia-backdrop.css';
import { Type, PenTool, Brain, Target, Puzzle, Music, Mic, Candy, Palette, Hammer, X, Sparkles, ChevronRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DyslexiaCenter = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [activeModal, setActiveModal] = useState(null);
    const [subModal, setSubModal] = useState(null);
    const [courses, setCourses] = useState([]);
    const observer = useRef(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await courseAPI.getAll({ category: 'dyslexia' });
                setCourses(res.data);
            } catch (error) {
                console.error("Failed to fetch dyslexia courses", error);
            }
        };
        fetchCourses();

        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => observer.current.observe(el));

        return () => observer.current?.disconnect();
    }, []);

    const features = [
        { id: 'phonics', icon: <Type size={40} />, title: t('dyslexiaCenter.phonicsTitle'), desc: t('dyslexiaCenter.phonicsDesc'), color: 'var(--primary-cyan)', bg: 'rgba(6,182,212,0.1)' },
        { id: 'tracing', icon: <PenTool size={40} />, title: t('dyslexiaCenter.tracingTitle'), desc: t('dyslexiaCenter.tracingDesc'), color: 'var(--primary-pink)', bg: 'rgba(236,72,153,0.1)' },
        { id: 'words', icon: <Brain size={40} />, title: t('dyslexiaCenter.memoryTitle'), desc: t('dyslexiaCenter.memoryDesc'), color: 'var(--primary-purple)', bg: 'rgba(139,92,246,0.1)' },
        { id: 'matching', icon: <Target size={40} />, title: t('dyslexiaCenter.pictureTitle'), desc: t('dyslexiaCenter.pictureDesc'), color: 'var(--primary-green)', bg: 'rgba(16,185,129,0.1)' },
        { id: 'wordbuilder', icon: <Puzzle size={40} />, title: t('dyslexiaCenter.wordBuilderTitle'), desc: t('dyslexiaCenter.wordBuilderDesc'), color: 'var(--primary-orange)', bg: 'rgba(249,115,22,0.1)' },
        { id: 'rhymes', icon: <Music size={40} />, title: t('dyslexiaCenter.rhymeTitle'), desc: t('dyslexiaCenter.rhymeDesc'), color: 'var(--primary-pink)', bg: 'rgba(236,72,153,0.1)' },
        { id: 'speech', icon: <Mic size={40} />, title: t('dyslexiaCenter.speechTitle'), desc: t('dyslexiaCenter.speechDesc'), color: 'var(--primary-cyan)', bg: 'rgba(6,182,212,0.1)', route: '/speech-practice' },
    ];

    const openFeature = (f) => {
        if (f.route) navigate(f.route);
        else setActiveModal(f.id);
    };

    return (
        <DashboardLayout>
            <div className="dyslexia-container" style={{ position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - 100px)', padding: '40px 20px' }}>
                {/* BACKGROUND ELEMENTS - LEGENDARY LEVEL */}
                <div className="blob blob-1" style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', filter: 'blur(50px)', borderRadius: '50%', animation: 'float-slow 20s infinite alternate' }}></div>
                <div className="blob blob-2" style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', filter: 'blur(60px)', borderRadius: '50%', animation: 'float-slow 25s infinite alternate-reverse' }}></div>
                
                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div className="reveal hero-dyslexia" style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(6,182,212,0.1)', color: 'var(--primary-cyan)', padding: '8px 20px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px', border: '1px solid rgba(6,182,212,0.2)' }}>
                            <Sparkles size={16}/> {t('common.new', 'Specialized Learning')}
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '0 0 20px 0', color: 'var(--text-dark)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                            {t('dyslexiaCenter.title')}
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
                            {t('dyslexiaCenter.subtitle')}
                        </p>
                    </div>

                    <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }}>
                            <Hammer size={24}/>
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>{t('dyslexiaCenter.interactiveTools')}</h2>
                    </div>

                    <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '25px' }}>
                        {features.map((f, idx) => (
                            <div key={idx} className="reveal hover-3d" onClick={() => openFeature(f)} style={{ background: 'var(--surface-elevated)', padding: '35px', borderRadius: '32px', cursor: 'pointer', border: '1px solid var(--border-color)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', position: 'relative', overflow: 'hidden', animationDelay: `${idx * 0.1}s` }}>
                                <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: f.bg, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', transition: 'all 0.3s' }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px', letterSpacing: '-0.01em' }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem', fontWeight: 500, marginBottom: '25px' }}>{f.desc}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: f.color, fontWeight: 700, fontSize: '0.9rem' }}>
                                    {t('dashboard.startCourse')} <ChevronRight size={18}/>
                                </div>
                                {/* Decorative circle */}
                                <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: f.bg, opacity: 0.5 }}></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MODALS - REIMAGINED WITH LEGENDARY UI */}
                {(activeModal === 'phonics' || activeModal === 'tracing') && (
                    <div className="game-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <div className="reveal-up active" style={{ background: 'var(--surface-elevated)', maxWidth: '900px', width: '100%', borderRadius: '40px', padding: '50px', position: 'relative', border: '1px solid var(--border-color)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                            <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '25px', right: '25px', width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                                <X size={24}/>
                            </button>
                            
                            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                <div style={{ display: 'inline-flex', width: '60px', height: '60px', borderRadius: '18px', background: activeModal === 'tracing' ? 'rgba(236,72,153,0.1)' : 'rgba(6,182,212,0.1)', color: activeModal === 'tracing' ? 'var(--primary-pink)' : 'var(--primary-cyan)', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                    {activeModal === 'tracing' ? <PenTool size={32}/> : <Type size={32}/>}
                                </div>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)', letterSpacing: '-0.02em' }}>
                                    {activeModal === 'tracing' ? t('dyslexiaCenter.tracingTitle') : t('dyslexiaCenter.phonicsLab')}
                                </h2>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '15px', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }} className="custom-scrollbar">
                                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l, i) => (
                                    <button 
                                        key={l} 
                                        onClick={() => setSubModal({ type: activeModal === 'phonics' ? 'phonics-lesson' : 'tracing', data: l })} 
                                        className="hover-3d"
                                        style={{ 
                                            aspectRatio: '1', borderRadius: '18px', background: 'var(--surface-color)', 
                                            border: '2px solid var(--border-color)', color: 'var(--text-dark)', fontSize: '1.8rem', 
                                            fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                        }}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>

                            {activeModal === 'phonics' && (
                                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                                    <button onClick={() => setSubModal({ type: 'blending' })} className="button-hover-effect" style={{ background: 'var(--primary-cyan)', color: 'black', border: 'none', padding: '16px 40px', borderRadius: '18px', fontWeight: 800, fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                        <Music size={22}/> {t('dyslexiaCenter.practiceBlending')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* SUB-MODALS & GAMES - SHOULD BE UPDATED INDIVIDUALLY IF NEEDED */}
                {subModal?.type === 'phonics-lesson' && (
                    <PhonicsLesson letter={subModal.data} onClose={() => setSubModal(null)} />
                )}
                {subModal?.type === 'blending' && (
                    <BlendingPractice onClose={() => setSubModal(null)} />
                )}
                {subModal?.type === 'tracing' && (
                    <LetterTracing letter={subModal.data} onClose={() => setSubModal(null)} />
                )}
                {activeModal === 'matching' && (
                    <MiniGames.PictureMatching onClose={() => setActiveModal(null)} onComplete={() => { alert('YAY! +50 XP'); setActiveModal(null); }} />
                )}
                {activeModal === 'words' && (
                    <MiniGames.MemoryAndFocus onClose={() => setActiveModal(null)} onComplete={() => { alert('Great Memory! +50 XP'); setActiveModal(null); }} />
                )}
                {activeModal === 'wordbuilder' && (
                    <MiniGames.WordBuilder onClose={() => setActiveModal(null)} onComplete={() => { alert('Incredible Spelling! +100 XP'); setActiveModal(null); }} />
                )}
                {activeModal === 'rhymes' && (
                    <RhymeLab onClose={() => setActiveModal(null)} />
                )}
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
                .reveal-up { opacity: 0; transform: translateY(40px); transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
                .reveal.active, .reveal-up.active { opacity: 1; transform: translate(0); }
                .hover-3d:hover { transform: translateY(-10px) scale(1.02); box-shadow: 0 30px 60px rgba(0,0,0,0.1) !important; border-color: var(--primary-cyan); }
                @keyframes float-slow { from { transform: translate(0, 0) rotate(0deg); } to { transform: translate(40px, 40px) rotate(10deg); } }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
                .button-hover-effect:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(6,182,212,0.3); }
                .button-hover-effect:active { transform: translateY(0); }
            `}} />
        </DashboardLayout>
    );
};

export default DyslexiaCenter;
