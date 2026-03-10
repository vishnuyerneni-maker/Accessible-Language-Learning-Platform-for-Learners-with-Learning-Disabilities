import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Bot, CheckCircle, AlertTriangle, FileText, Sparkles, TrendingUp, X, Type, MessageSquare, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NLPWritingAssistant = () => {
    const { t } = useTranslation();
    const [text, setText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const observer = useRef(null);

    useEffect(() => {
        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.05 });

        const timeout = setTimeout(() => {
            document.querySelectorAll('.reveal, .reveal-left').forEach(el => el.classList.add('active'));
        }, 300);

        const elements = document.querySelectorAll('.reveal, .reveal-left');
        elements.forEach(el => observer.current.observe(el));

        return () => {
            clearTimeout(timeout);
            observer.current?.disconnect();
        };
    }, [analysisResult]);

    // Mock NLP Engine
    const analyzeText = () => {
        if (!text.trim()) return;
        setIsAnalyzing(true);
        setAnalysisResult(null);

        setTimeout(() => {
            const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
            const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
            const charCount = text.length;
            
            const readingLevel = Math.max(1, Math.min(12, Math.round((charCount / wordCount) * 0.39 + (wordCount / sentenceCount) * 11.8 - 15.59)));
            
            const positiveWords = ['good', 'great', 'happy', 'love', 'excellent', 'amazing', 'fun', 'like'];
            const negativeWords = ['bad', 'sad', 'hate', 'terrible', 'awful', 'angry', 'hard', 'difficult'];
            const words = text.toLowerCase().match(/\b\w+\b/g) || [];
            
            let posScore = 0; let negScore = 0;
            words.forEach(w => {
                if(positiveWords.includes(w)) posScore++;
                if(negativeWords.includes(w)) negScore++;
            });

            let sentiment = 'Neutral';
            if (posScore > negScore) sentiment = 'Positive';
            if (negScore > posScore) sentiment = 'Negative';

            const passiveTriggers = ['is', 'are', 'was', 'were', 'be', 'being', 'been'];
            const passiveMatches = words.filter(w => passiveTriggers.includes(w)).length;
            const grammarSuggestions = [];
            
            if (passiveMatches > 2) {
                grammarSuggestions.push(t('nlpLab.passiveSuggestion'));
            }
            if (wordCount > 0 && sentenceCount > 0 && (wordCount / sentenceCount) > 15) {
                grammarSuggestions.push(t('nlpLab.longSentenceSuggestion'));
            }
            if (grammarSuggestions.length === 0 && wordCount > 5) {
                grammarSuggestions.push(t('nlpLab.greatJob'));
            }

            setAnalysisResult({
                wordCount,
                sentenceCount,
                readingLevel,
                sentiment,
                grammarSuggestions
            });
            setIsAnalyzing(false);
        }, 1500);
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
                <header className="reveal" style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '15px', padding: '10px 24px', background: 'rgba(124,58,237,0.08)', borderRadius: '20px', border: '1px solid rgba(124,58,237,0.2)', marginBottom: '20px' }}>
                        <Bot size={32} color="var(--primary-purple)" className="icon-bounce" />
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>
                            {t('nlpLab.assistantTitle')}
                        </h2>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 500 }}>{t('nlpLab.assistantSubtitle')}</p>
                </header>

                <div className="reveal hover-3d" style={{ background: 'var(--surface-elevated)', borderRadius: '28px', border: '2px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', overflow: 'hidden', marginBottom: '40px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    <div style={{ padding: '24px', background: 'rgba(124,58,237,0.03)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Type size={20} color="var(--primary-purple)" />
                        <span style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Writing Canvas</span>
                    </div>
                    <textarea 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={t('nlpLab.placeholder')}
                        style={{
                            width: '100%',
                            minHeight: '280px',
                            padding: '32px',
                            fontSize: '1.2rem',
                            border: 'none',
                            outline: 'none',
                            resize: 'vertical',
                            background: 'transparent',
                            color: 'var(--text-dark)',
                            lineHeight: 1.7,
                            fontFamily: 'inherit'
                        }}
                    />
                    <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.02)' }}>
                        <button 
                            className={`btn btn-primary ${!isAnalyzing && text.trim() ? 'button-hover-effect' : ''}`}
                            onClick={analyzeText}
                            disabled={!text.trim() || isAnalyzing}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px', 
                                padding: '14px 32px', 
                                borderRadius: '16px', 
                                fontSize: '1.1rem', 
                                fontWeight: 800,
                                background: isAnalyzing ? 'var(--text-muted)' : 'var(--primary-purple)',
                                color: '#fff',
                                border: 'none',
                                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isAnalyzing ? 'none' : '0 10px 20px rgba(124,58,237,0.3)'
                            }}
                        >
                            {isAnalyzing ? <><Sparkles size={20} className="spin"/> {t('nlpLab.analyzing')}</> : <><Sparkles size={20}/> {t('nlpLab.analyzeBtn')}</>}
                        </button>
                    </div>
                </div>

                {analysisResult && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', paddingBottom: '60px' }}>
                        
                        {/* Metrics Card */}
                        <div className="reveal hover-3d" style={{ background: 'var(--surface-elevated)', borderRadius: '24px', padding: '32px', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BarChart3 size={20} color="var(--primary-cyan)" />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>{t('nlpLab.readingStats')}</h3>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {[
                                    { label: t('nlpLab.wordCount'), value: analysisResult.wordCount, icon: <FileText size={18} /> },
                                    { label: t('nlpLab.sentences'), value: analysisResult.sentenceCount, icon: <MessageSquare size={18} /> },
                                    { label: t('nlpLab.gradeLevel'), value: `Grade ${analysisResult.readingLevel}`, badge: true, color: analysisResult.readingLevel > 8 ? 'var(--primary-orange)' : 'var(--primary-green)' },
                                    { label: t('nlpLab.sentiment'), value: analysisResult.sentiment, badge: true, color: 'var(--primary-purple)' }
                                ].map((stat, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < 3 ? '15px' : 0, borderBottom: i < 3 ? '1px solid var(--border-color)' : 'none' }}>
                                        <span style={{ color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {stat.icon} {stat.label}
                                        </span>
                                        {stat.badge ? (
                                            <span style={{ padding: '6px 14px', background: `${stat.color}15`, color: stat.color, borderRadius: '30px', fontSize: '0.9rem', fontWeight: 800, border: `1px solid ${stat.color}30` }}>
                                                {stat.value}
                                            </span>
                                        ) : (
                                            <strong style={{ fontSize: '1.2rem', color: 'var(--text-dark)', fontWeight: 800 }}>{stat.value}</strong>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Feedback Card */}
                        <div className="reveal hover-3d" style={{ background: 'var(--surface-elevated)', borderRadius: '24px', padding: '32px', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(251,146,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <TrendingUp size={20} color="var(--primary-orange)" />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)' }}>{t('nlpLab.grammarStyle')}</h3>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {analysisResult.grammarSuggestions.map((suggestion, index) => (
                                    <div key={index} className="reveal-left" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: 'var(--background-color)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)', transitionDelay: `${index * 0.1}s` }}>
                                        <div style={{ flexShrink: 0, marginTop: '2px' }}>
                                            {suggestion.includes('Great job') || suggestion.includes('बहुत अच्छा')
                                                ? <CheckCircle size={22} color="var(--primary-green)" />
                                                : <AlertTriangle size={22} color="var(--primary-orange)" />
                                            }
                                        </div>
                                        <span style={{ lineHeight: 1.6, color: 'var(--text-dark)', fontWeight: 500, fontSize: '0.95rem' }}>{suggestion}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
                .reveal-left { opacity: 0; transform: translateX(-20px); transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
                .reveal.active, .reveal-left.active { opacity: 1; transform: translate(0); }
                .hover-3d:hover { transform: translateY(-8px) scale(1.01); box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important; border-color: var(--primary-purple); }
                .button-hover-effect:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(124,58,237,0.4) !important; background: var(--primary-cyan) !important; color: #000 !important; }
                .button-hover-effect:active { transform: translateY(0px); }
            `}} />
        </DashboardLayout>
    );
};

export default NLPWritingAssistant;
