import React from 'react';
import './Footer.css';

const Footer = ({ onOpenAssessment }) => {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand-col">
                        <img src="/Cannalogic-White.svg" alt="CannaLogic" className="footer-logo" />
                    </div>
                    <p className="footer-copy">© {new Date().getFullYear()} CannaLogic. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
