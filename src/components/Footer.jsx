import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo-section">
                        <img src="/Cannalogic-White.svg" alt="Cannalogic Logo" className="footer-logo" />
                        <p>Where Science Meets Nature</p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Program</h4>
                            <a href="#">Curriculum</a>
                            <a href="#">Mentors</a>
                            <a href="#">Admissions</a>
                        </div>
                        <div className="footer-column">
                            <h4>Company</h4>
                            <a href="#">About Us</a>
                            <a href="#">Contact</a>
                            <a href="#">Privacy Policy</a>
                        </div>
                        <div className="footer-column">
                            <h4>Connect</h4>
                            <a href="#">LinkedIn</a>
                            <a href="#">Twitter</a>
                            <a href="#">Instagram</a>
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
