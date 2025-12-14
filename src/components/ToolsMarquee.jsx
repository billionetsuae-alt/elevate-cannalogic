import React from 'react';
import './ToolsMarquee.css';

const ToolsMarquee = () => {
    // Cannabis/wellness related partner logos as text placeholders
    const partners = [
        "AYUSH Ministry",
        "Vaidya Network",
        "HempCare Labs",
        "Wellness India",
        "Cannalogic Research",
        "Ayurveda Council",
        "Green Healing",
        "Holistic Health"
    ];

    return (
        <div className="tools-marquee-container">
            <div className="marquee-track">
                {/* Double the logos for seamless loop */}
                {[...partners, ...partners].map((partner, index) => (
                    <div key={index} className="marquee-item">
                        <span className="partner-text">{partner}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ToolsMarquee;
