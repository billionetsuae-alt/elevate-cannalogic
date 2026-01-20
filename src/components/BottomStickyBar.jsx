import React from 'react';
import './BottomStickyBar.css';

const BottomStickyBar = ({ onOpenAssessment }) => {
    return (
        <div className="bottom-sticky-bar">
            <div className="sticky-glass-container">
                <p className="sticky-text">Limited Intakes Only.</p>
                <button onClick={() => { import('../utils/tracker').then(({ trackEvent, EVENTS }) => trackEvent(EVENTS.CLICK, 'landing', 'sticky_footer_cta')); onOpenAssessment(); }} className="btn btn-primary sticky-btn">Get Free Access</button>
            </div>
        </div>
    );
};

export default BottomStickyBar;
