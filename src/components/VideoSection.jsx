import React from 'react';
import './VideoSection.css';
import PartnersMarquee from './PartnersMarquee';

const VideoSection = () => {
    return (
        <section className="video-testimonial-section">
            <div className="section-header">
                <p className="endorsement-subtitle">Endorsed by Ancient Wisdom & Modern Science</p>
                <div className="logo-marquee-wrapper">
                    <PartnersMarquee />
                </div>
            </div>

            <div className="video-section container">
                <div className="video-header animate-on-scroll">
                    <p className="video-label">DISCOVER THE SCIENCE BEHIND THE HEALING</p>
                    <h3>Elevate Cannalogic: Nature's Answer to Inner Balance</h3>
                </div>

                <div className="fullwidth-video-container animate-on-scroll">
                    <video
                        src="https://res.cloudinary.com/dve0pokcj/video/upload/v1767691948/IntroVideoElevate_twuep3.mp4"
                        poster="/video-thumbnail.png"
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

export default VideoSection;
