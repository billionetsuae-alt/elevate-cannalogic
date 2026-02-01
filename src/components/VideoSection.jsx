import React from 'react';
import './VideoSection.css';
import PartnersMarquee from './PartnersMarquee';

const VideoSection = ({ pageName = 'landing' }) => {
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
                        src="https://res.cloudinary.com/dve0pokcj/video/upload/v1767726214/finalFinalFinal_1_oiys4j.mp4"
                        poster="/video-thumbnail.jpeg"
                        loop
                        playsInline
                        controls
                        className="fullwidth-video"
                        onPlay={(e) => {
                            const video = e.target;
                            if (video.currentTime < 1) {
                                import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                    trackEvent(EVENTS.VIDEO_START, pageName, 'main_video')
                                );
                            } else {
                                import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                    trackEvent(EVENTS.CLICK, pageName, 'video_resumed')
                                );
                            }
                        }}
                        onPause={(e) => {
                            import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                trackEvent(EVENTS.VIDEO_PAUSE, pageName, 'main_video')
                            );
                        }}
                        onEnded={() => {
                            import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                trackEvent(EVENTS.VIDEO_COMPLETE, pageName, 'main_video')
                            );
                        }}
                        onTimeUpdate={(e) => {
                            const video = e.target;
                            const percentWatched = (video.currentTime / video.duration) * 100;

                            if (!video.dataset.reached25 && percentWatched >= 25) {
                                video.dataset.reached25 = 'true';
                                import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                    trackEvent(EVENTS.CLICK, pageName, 'video_25_percent')
                                );
                            }
                            if (!video.dataset.reached50 && percentWatched >= 50) {
                                video.dataset.reached50 = 'true';
                                import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                    trackEvent(EVENTS.CLICK, pageName, 'video_50_percent')
                                );
                            }
                            if (!video.dataset.reached75 && percentWatched >= 75) {
                                video.dataset.reached75 = 'true';
                                import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                    trackEvent(EVENTS.CLICK, pageName, 'video_75_percent')
                                );
                            }
                        }}
                    />
                </div>
            </div>
        </section>
    );
};

export default VideoSection;
