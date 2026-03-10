import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { courseAPI } from '../utils/api';
import { COURSE_DATA } from '../data/course_data';
import IconMapping from '../components/IconMapping';
import { useTranslation } from 'react-i18next';
import { Lock, Unlock, CheckCircle2, Info, BookOpen, ArrowRight, Star } from 'lucide-react';

const CourseLibrary = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const observer = useRef(null);

    useEffect(() => {
        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        const fetchCourses = async () => {
            try {
                if (user) {
                    const response = await courseAPI.getAll();
                    const userProgress = user.progress || {};
                    const parentSettings = user.parentSettings || { lockedCourses: [] };

                    let targetRecommendedIndex = -1;
                    const sortedRaw = response.data.sort((a,b) => (parseInt(a.id.replace('c','')) || 0) - (parseInt(b.id.replace('c','')) || 0));

                    for (let i = 0; i < sortedRaw.length; i++) {
                        if ((userProgress[sortedRaw[i].id] || 0) < 100) {
                            targetRecommendedIndex = i;
                            break;
                        }
                    }

                    const enrichedCourses = sortedRaw.map((course, index) => {
                        const isLockedByParent = parentSettings.lockedCourses?.includes(course.id);
                        const isSequentialLock = index > targetRecommendedIndex && targetRecommendedIndex !== -1;
                        
                        return {
                            ...course,
                            progress: userProgress[course.id] || 0,
                            locked: isLockedByParent || isSequentialLock,
                            lockedReason: isLockedByParent ? t('courseLibrary.lockedByGuardian') : (isSequentialLock ? t('courseLibrary.finishPrevious') : null),
                            recommended: index === targetRecommendedIndex
                        };
                    });
                    
                    setCourses(enrichedCourses);
                }
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
                setTimeout(() => {
                    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.current.observe(el));
                }, 100);
            }
        };

        fetchCourses();
        return () => observer.current?.disconnect();
    }, [user, t]);

    if (!user) return <div className="container" style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>{t('common.loading', 'Loading Library...')}</div>;

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
                <header className="reveal" style={{ marginBottom: '50px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(6,182,212,0.2)' }}>
                            <BookOpen size={28} color="var(--primary-cyan)" className="animate-pulse" />
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'var(--text-dark)', letterSpacing: '-0.02em' }}>
                            {t('courseLibrary.title')}
                        </h2>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 500, marginLeft: '63px' }}>{t('courseLibrary.subtitle')}</p>
                </header>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px', paddingBottom: '50px' }}>
                    {courses.map((course, index) => {
                        const hasData = !!COURSE_DATA[course.id];
                        const isHardLocked = course.locked || !hasData;

                        return (
                            <article key={course.id} className="reveal hover-3d" style={{ transitionDelay: `${index * 0.05}s` }}>
                                <div style={{ background: 'var(--surface-elevated)', borderRadius: '28px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                                    
                                    {/* Card Header Illustration */}
                                    <div className={course.gradient || 'gradient-blue'} style={{ height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', filter: isHardLocked ? 'grayscale(0.8) contrast(0.8)' : 'none', transition: 'filter 0.5s' }}>
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.2), transparent)', opacity: 0.5 }}></div>
                                        <div className="icon-bounce" style={{ position: 'relative', zIndex: 1 }}>
                                            <IconMapping iconName={course.image || 'Library'} size={80} color="white" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' }} />
                                        </div>
                                        
                                        {/* Status Badges */}
                                        <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
                                            {course.recommended && (
                                                <span style={{ padding: '6px 12px', background: 'var(--primary-orange)', color: '#fff', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 800, boxShadow: '0 4px 12px rgba(251,146,60,0.4)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <Star size={12} fill="currentColor" /> {t('dashboard.recommended').toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 12px 0', color: 'var(--text-dark)', letterSpacing: '-0.01em' }}>{course.title}</h3>
                                        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 0 24px 0', flex: 1 }}>{course.description}</p>
                                        
                                        {/* Progress Section */}
                                        <div style={{ marginBottom: '24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('courseLibrary.completion')}</span>
                                                <span style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 800 }}>{course.progress}%</span>
                                            </div>
                                            <div style={{ height: '10px', background: 'var(--border-color)', borderRadius: '10px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                                                <div style={{ width: `${course.progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-cyan), var(--primary-purple))', borderRadius: '10px', transition: 'width 1s cubic-bezier(0.65, 0, 0.35, 1)' }} />
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={() => {
                                                if (!hasData) {
                                                    alert(t('courseLibrary.underConstruction'));
                                                } else if (!course.locked) {
                                                    window.location.href = `/lesson/${course.id}`;
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '16px',
                                                borderRadius: '16px',
                                                border: 'none',
                                                background: isHardLocked ? 'rgba(0,0,0,0.05)' : 'var(--primary-cyan)',
                                                color: isHardLocked ? 'var(--text-muted)' : '#000',
                                                fontSize: '1rem',
                                                fontWeight: 800,
                                                cursor: isHardLocked && hasData ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '10px',
                                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                boxShadow: isHardLocked ? 'none' : '0 10px 20px rgba(6,182,212,0.2)'
                                            }}
                                            className={!isHardLocked ? 'button-hover-effect' : ''}
                                        >
                                            {isHardLocked ? (
                                                <>
                                                    <Lock size={18} />
                                                    {!hasData ? t('dashboard.locked') : course.lockedReason}
                                                </>
                                            ) : (
                                                <>
                                                    {course.progress > 0 ? t('dashboard.continueCourse') : t('dashboard.startCourse')}
                                                    <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .reveal { opacity: 0; transform: translateY(30px); transition: all 1s cubic-bezier(0.22, 1, 0.36, 1); }
                .reveal.active { opacity: 1; transform: translateY(0); }
                .hover-3d:hover { transform: translateY(-10px) scale(1.02); }
                .hover-3d:hover > div { border-color: var(--primary-cyan); box-shadow: 0 25px 50px rgba(6,182,212,0.15) !important; }
                .button-hover-effect:hover { background: var(--primary-purple) !important; color: white !important; transform: translateY(-2px); }
                .button-hover-effect:active { transform: translateY(0px); }
            `}} />
        </DashboardLayout>
    );
};

export default CourseLibrary;
