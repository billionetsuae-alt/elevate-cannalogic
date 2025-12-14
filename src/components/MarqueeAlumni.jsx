import React, { useState, useRef } from 'react';
import './MarqueeAlumni.css';
import ToolsMarquee from './ToolsMarquee';

const MarqueeAlumni = () => {
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);

    const toggleSound = () => {
        setIsMuted(!isMuted);
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
        }
    };

    return (
        <section className="marquee-alumni-section">
            <div className="section-header">
                <p className="endorsement-subtitle">Endorsed by Ancient Wisdom & Modern Science</p>
                <div className="logo-marquee-wrapper">
                    <ToolsMarquee />
                </div>
            </div>

            <div className="video-section container">
                <div className="video-header">
                    <p className="video-label">DISCOVER THE SCIENCE BEHIND THE HEALING</p>
                    <h3>Elevate Cannalogic: Nature's Answer to Inner Balance</h3>
                </div>

                <div className="fullwidth-video-container">
                    <button className="sound-toggle-btn" onClick={toggleSound}>
                        <svg className="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {isMuted ? (
                                <>
                                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                    <line x1="23" y1="9" x2="17" y2="15" />
                                    <line x1="17" y1="9" x2="23" y2="15" />
                                </>
                            ) : (
                                <>
                                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                </>
                            )}
                        </svg>
                        <span>{isMuted ? 'Enable sound' : 'Mute sound'}</span>
                    </button>

                    <video
                        ref={videoRef}
                        src="https://res.cloudinary.com/djwx0b9nj/video/upload/v1765290145/VSL_Thampi_Nagarjuna_1_t4cg84.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        className="fullwidth-video"
                    />
                </div>
            </div>
        </section>
    );
};

export default MarqueeAlumni;
