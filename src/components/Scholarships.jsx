import React from 'react';
import './Scholarships.css';

const Scholarships = () => {
    return (
        <section className="scholarships-section">
            <div className="container">
                <div className="scholarship-card">
                    <div className="scholarship-content">
                        <h2>Limited Scholarships Available</h2>
                        <p>We are committed to making this knowledge accessible. Merit-based scholarships are available for deserving candidates.</p>
                        <div className="scholarship-tags">
                            <span>Students</span>
                            <span>Researchers</span>
                            <span>Medical Professionals</span>
                        </div>
                        <button className="btn btn-primary">Get Access</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Scholarships;
