import React from 'react';
import './Hero.css';

const Hero = () => {
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
                                    <img src="/assets/osc1.svg" alt="Icon" />
                                    <span>100% Legal</span>
                                </div>
                                <div className="stat-item">
                                    <img src="/assets/osc2.svg" alt="Icon" />
                                    <span>Ayurvedic</span>
                                </div>
                                <div className="stat-item">
                                    <img src="/assets/osc3.svg" alt="Icon" />
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
                                <a href="#" className="btn btn-primary">Take the Assessment</a>
                                <button className="btn btn-outline">Watch Video</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
