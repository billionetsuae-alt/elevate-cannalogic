import React from 'react';
import './Hero.css';

const Hero = ({ onOpenAssessment, onWatchVideo }) => {
    return (
        <section className="hero">
            <div className="hero-container container">
                <div className="hero-card">
                    <div className="hero-bg" style={{ backgroundImage: 'url(/Cannalogic%20Landing%20page.png)' }}>
                        <div className="hero-overlay"></div>
                    </div>

                    <div className="badge-wrapper">
                        <div className="badge">
                            MINISTRY OF AYUSH APPROVED
                        </div>
                    </div>

                    <div className="hero-content">
                        <img src="/Cannalogic-White.svg" alt="Cannalogic Logo" className="hero-logo" />

                        <div className="content-inner">
                            <div className="glass-badge">
                                LEGAL ◆ SCIENTIFIC ◆ HOLISTIC
                            </div>

                            <h1>
                                Unlock Higher Consciousness, Emotional Balance & Inner Clarity — Naturally.
                            </h1>

                            <p className="hero-subtitle">
                                The Ancient Medicine They Tried to Hide from You. For centuries this sacred plant awakened seekers and threatened the systems that control you.
                            </p>

                            <div className="hero-stats">
                                <div className="stat-item">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        <path d="M9 12l2 2 4-4" />
                                    </svg>
                                    <span>100% Legal</span>
                                </div>
                                <div className="stat-item">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
                                        <circle cx="7.5" cy="11.5" r="1.5" />
                                        <circle cx="12" cy="7.5" r="1.5" />
                                        <circle cx="16.5" cy="11.5" r="1.5" />
                                    </svg>
                                    <span>Ayurvedic</span>
                                </div>
                                <div className="stat-item">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                    <span>Doctor Prescribed</span>
                                </div>
                            </div>

                            <div className="hero-dates">
                                <div className="date-box">
                                    <div className="date-label">Status</div>
                                    <div className="date-value">Invite Only</div>
                                </div>
                                <div className="date-box">
                                    <div className="date-label">Availability</div>
                                    <div className="date-value">Limited Slots</div>
                                </div>
                            </div>

                            <div className="hero-actions">
                                <button onClick={() => { import('../utils/tracker').then(({ trackEvent, EVENTS }) => trackEvent(EVENTS.CLICK, 'landing', 'hero_cta')); onOpenAssessment(); }} className="btn btn-primary">Get Free Access</button>
                                <button onClick={() => { import('../utils/tracker').then(({ trackEvent, EVENTS }) => trackEvent(EVENTS.CLICK, 'landing', 'hero_video_btn')); onWatchVideo(); }} className="btn btn-outline">Watch Video</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
