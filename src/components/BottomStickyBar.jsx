import React from 'react';
import './BottomStickyBar.css';

const BottomStickyBar = ({ onOpenAssessment }) => {
    return (
        <div className="bottom-sticky-bar">
            <div className="sticky-glass-container">
                <p className="sticky-text">Limited Intakes Only.</p>
                <button onClick={onOpenAssessment} className="btn btn-primary sticky-btn">Check Eligibility</button>
            </div>
        </div>
    );
};

export default BottomStickyBar;
