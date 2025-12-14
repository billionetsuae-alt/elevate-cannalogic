import React from 'react';
import './BottomStickyBar.css';

const BottomStickyBar = () => {
    return (
        <div className="bottom-sticky-bar">
            {/* We can add a timer here if needed */}
            <div className="sticky-content">
                <p className="sticky-text">Limited Intakes Only.</p>
                <a href="#" className="btn btn-primary sticky-btn">Check Eligibility</a>
            </div>
        </div>
    );
};

export default BottomStickyBar;
