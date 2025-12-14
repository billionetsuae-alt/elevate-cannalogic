import React from 'react';
import './ToolsMarquee.css';

const ToolsMarquee = () => {
    // Using placeholder logos or simplified svg text for now if assets are missing
    // Ideally these should be the logos from the original site
    const logos = [
        "osb1.svg", "osb2.svg", "osb3.svg", "osb4.svg", "osb5.svg",
        "osb6.svg", "osb7.svg", "osb8.svg", "osb9.svg", "osb10.svg"
    ];

    return (
        <div className="tools-marquee-container">
            <div className="marquee-track">
                {/* Double the logos for seamless loop */}
                {[...logos, ...logos].map((logo, index) => (
                    <div key={index} className="marquee-item">
                        {/* Placeholder for tool logos - typically svgs in public folder */}
                        <img
                            src={`/assets/${logo}`}
                            alt={`Tool ${index}`}
                            className="tool-logo"
                            onError={(e) => {
                                e.target.style.display = 'none'; // Hide if image not found
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ToolsMarquee;
