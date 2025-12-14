import React from 'react';
import './Pricing.css';

const criteria = [
    'Mentally Ready',
    'Emotionally Prepared',
    'Spiritually Seeking',
    'Willing to Respect the Medicine',
    'Not for Recreation',
    'Commitment to Balance'
];

const Pricing = ({ onOpenAssessment }) => {
    return (
        <section className="pricing-section">
            <div className="container">
                <div className="pricing-card">
                    <div className="pricing-header">
                        <h2>This Medicine Is Not for Everyone</h2>
                        <p>Only the Ready Will Be Invited.</p>
                    </div>

                    <div className="pricing-content">
                        <div className="price-display">
                            <span className="amount">INVITE ONLY</span>
                        </div>

                        <div className="price-sub">
                            <p>Access begins with a simple assessment.</p>
                        </div>

                        <button onClick={onOpenAssessment} className="btn btn-primary btn-block">Begin Qualification</button>

                        <div className="pricing-list-container">
                            <p style={{ marginBottom: '1rem', color: 'gray' }}>We are looking for those who are:</p>
                            <ul className="pricing-list">
                                {criteria.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
