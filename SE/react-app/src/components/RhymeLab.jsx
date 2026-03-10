import React, { useState, useEffect, useRef } from 'react';
import { Music, X, Tv, AlertTriangle, SkipBack, Pause, Play, ExternalLink, Lightbulb, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../styles/dyslexia-backdrop.css';

export const RhymeLab = ({ onClose }) => {
    const { t, i18n } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [playerStatus, setPlayerStatus] = useState('loading'); // 'loading' | 'ready' | 'playing' | 'error'
    const playerRef = useRef(null);
    const containerRef = useRef(null);

    // Video ID: LooLoo Kids - Johny Johny Yes Papa
    const videoId = 'F4tHL8reNCs';

    useEffect(() => {
        let isMounted = true;

        // 1. Ensure Global Callback exists
        window.onYouTubeIframeAPIReady = () => {
            console.log("YouTube API Ready");
            if (isMounted) initPlayer();
        };

        // 2. Load Script if not present
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        } else if (window.YT.Player) {
            // Already loaded, just init
            initPlayer();
        }

        function initPlayer() {
            if (!containerRef.current || playerRef.current) return;

            console.log("Initializing Player...");
            playerRef.current = new window.YT.Player(containerRef.current, {
                height: '100%',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    controls: 0, // HIDE built-in YouTube controls
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    fs: 0, // Disable fullscreen from built-in controls
                    disablekb: 1, // Disable keyboard controls
                    iv_load_policy: 3, // Hide video annotations
                    origin: window.location.origin
                },
                events: {
                    onReady: (event) => {
                        console.log("Player Ready");
                        if (isMounted) {
                            setPlayerStatus('ready');
                            event.target.playVideo();
                        }
                    },
                    onStateChange: (event) => {
                        if (!isMounted) return;
                        if (event.data === 1) { // PLAYING
                            setPlayerStatus('playing');
                            setIsPlaying(true);
                        } else {
                            setPlayerStatus('ready');
                            setIsPlaying(false);
                        }
                    },
                    onError: (err) => {
                        console.error("Player Error:", err);
                        if (isMounted) setPlayerStatus('error');
                    }
                }
            });
        }

        // Fallback check: if API loaded but callback didn't fire
        const fallback = setTimeout(() => {
            if (window.YT && window.YT.Player && !playerRef.current) {
                initPlayer();
            }
        }, 2000);

        return () => {
            isMounted = false;
            clearTimeout(fallback);
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
            playerRef.current = null;
        };
    }, []);

    return (
        <div className="game-overlay reveal active" style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{
                padding: '25px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.4)',
                zIndex: 10,
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(236,72,153,0.2)', color: 'var(--primary-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Music size={28}/>
                    </div>
                    <div>
                        <h2 style={{ color: 'white', margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Johny Johny Yes Papa</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-pink)', fontSize: '0.9rem', fontWeight: 700 }}>
                            <Sparkles size={14}/> {t('dyslexiaCenter.rhymeTitle')}
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="button-hover-effect" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={28}/></button>
            </div>

            {/* Main Stage */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '100%',
                padding: '40px'
            }}>
                <div className="blob" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0 }}></div>

                {/* Status Messages */}
                {playerStatus === 'loading' && (
                    <div style={{ color: 'white', textAlign: 'center', zIndex: 1 }}>
                        <div className="animate-pulse" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '2rem', fontWeight: 800 }}><Tv size={32}/> {t('rhymeLab.connecting')}</div>
                    </div>
                )}

                {playerStatus === 'error' && (
                    <div style={{ color: '#f87171', textAlign: 'center', padding: '40px', background: 'rgba(0,0,0,0.6)', borderRadius: '32px', zIndex: 1, border: '1px solid rgba(248,113,113,0.2)', maxWidth: '500px' }}>
                        <AlertTriangle size={60} style={{ marginBottom: '20px' }}/>
                        <p style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>{t('rhymeLab.error')}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn button-hover-effect"
                            style={{ background: 'var(--primary-pink)', color: 'white', padding: '12px 30px', borderRadius: '15px' }}
                        >Refresh Page</button>
                    </div>
                )}

                {/* Player Container */}
                <div className="reveal-up active" style={{
                    width: '90%',
                    maxWidth: '1000px',
                    aspectRatio: '16/9',
                    borderRadius: '40px',
                    overflow: 'hidden',
                    boxShadow: '0 50px 100px rgba(0,0,0,0.6)',
                    border: '10px solid rgba(255,255,255,0.05)',
                    background: '#000',
                    display: playerStatus === 'error' ? 'none' : 'block',
                    zIndex: 1,
                    position: 'relative'
                }}>
                    <div ref={containerRef}></div>
                </div>
            </div>

            {/* Footer / Custom Controls */}
            <div style={{
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '25px',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                    <button
                        onClick={() => playerRef.current?.seekTo(0)}
                        className="button-hover-effect"
                        style={{
                            background: '#475569',
                            color: 'white',
                            border: 'none',
                            padding: '18px 35px',
                            borderRadius: '24px',
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                        }}
                    >
                        <SkipBack size={24}/> {t('rhymeLab.restart')}
                    </button>

                    <button
                        onClick={() => {
                            if (isPlaying) playerRef.current?.pauseVideo();
                            else playerRef.current?.playVideo();
                        }}
                        className="button-hover-effect"
                        style={{
                            background: isPlaying ? '#ef4444' : 'var(--primary-green)',
                            color: 'white',
                            border: 'none',
                            padding: '22px 70px',
                            borderRadius: '100px',
                            fontSize: '2rem',
                            fontWeight: 900,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                    >
                        {isPlaying ? (
                            <><Pause size={40}/> {t('rhymeLab.pause')}</>
                        ) : (
                            <><Play size={40}/> {t('rhymeLab.play')}</>
                        )}
                    </button>

                    <a
                        href={`https://www.youtube.com/watch?v=${videoId}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            color: 'var(--primary-cyan)',
                            textDecoration: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '15px'
                        }}
                        className="button-hover-effect"
                    >
                        {t('rhymeLab.openYoutube')} <ExternalLink size={18}/>
                    </a>
                </div>

                <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
                    <Lightbulb size={24} style={{ color: 'var(--primary-orange)' }}/> {t('rhymeLab.instruction')}
                </p>
            </div>
        </div>
    );
};
