import React from 'react';
import './Footer.css';

const Footer = () => {
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
                        <div className="footer-social-icons">
                            <a href="#" aria-label="LinkedIn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                            </a>
                            <a href="#" aria-label="Twitter">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                            </a>
                            <a href="#" aria-label="Instagram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                        </div>
                    </div>

                    {/* Links Columns - Minimal & Functional */}
                    <div className="footer-links-grid">
                        <div className="footer-col">
                            <h4>Explore</h4>
                            <a href="#" onClick={(e) => { e.preventDefault(); document.querySelector('.video-section')?.scrollIntoView({ behavior: 'smooth' }) }}>The Science</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); document.querySelector('.community-section')?.scrollIntoView({ behavior: 'smooth' }) }}>Community</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); document.querySelector('.faq-section')?.scrollIntoView({ behavior: 'smooth' }) }}>FAQs</a>
                        </div>
                        <div className="footer-col">
                            <h4>Legal</h4>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">AYUSH Compliance</a>
                        </div>
                        <div className="footer-col">
                            <h4>Action</h4>
                            <a href="#" className="footer-cta-link">Check Eligibility</a>
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
