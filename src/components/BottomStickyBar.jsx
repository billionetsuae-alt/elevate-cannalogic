import React from 'react';
import './BottomStickyBar.css';

const BottomStickyBar = () => {
    return (
        <div className="bottom-sticky-bar">
            <div className="sticky-glass-container">
                <p className="sticky-text">Limited Intakes Only.</p>
                <a href="#" className="btn btn-primary sticky-btn">Check Eligibility</a>
            </div>
        </div>
    );
};

export default BottomStickyBar;
