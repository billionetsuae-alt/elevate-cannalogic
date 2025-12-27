import React from 'react';
import './Footer.css';

const Footer = ({ onOpenAssessment }) => {
    return (
        <footer className="footer-section">
            <div className="container">
                <div className="footer-content">
                    {/* Brand Column */}
                    <div className="footer-brand-col">
                        <img src="/logo-white.svg" alt="Cannalogic" className="footer-logo" onError={(e) => e.target.style.display = 'none'} />
                        {/* Fallback text if logo missing */}
                        <h2 className="footer-logo-text">Cannalogic</h2>
                        <p className="footer-tagline">Where Science Meets Nature.</p>
                    </div>

                    {/* Links Columns - Minimal & Functional */}
                    <div className="footer-links-grid">
                        <div className="footer-col">
                            <h4>Explore</h4>
                            <a href="#" onClick={(e) => { e.preventDefault(); document.querySelector('.curriculum-section')?.scrollIntoView({ behavior: 'smooth' }) }}>The Science</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); document.querySelector('.mentors-section')?.scrollIntoView({ behavior: 'smooth' }) }}>Community</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); document.querySelector('.faq-section')?.scrollIntoView({ behavior: 'smooth' }) }}>FAQs</a>
                        </div>

                        <div className="footer-col">
                            <h4>Action</h4>
                            <a href="#" className="footer-cta-link" onClick={(e) => {
                                e.preventDefault();
                                if (onOpenAssessment) onOpenAssessment();
                            }}>Check Eligibility</a>
                            <a href="mailto:support@cannalogic.com">Contact Support</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Cannalogic. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
