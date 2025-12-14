import React from 'react';
import './VennSection.css';

const VennSection = () => {
    return (
        <section className="venn-section">
            <div className="container venn-container">
                <div className="venn-text">
                    <p className="section-label">THE PROBLEM</p>
                    <h2>You’re Not Broken. You’ve Been Disconnected.</h2>
                    <p className="venn-description">
                        Modern life has pushed you away from your true self. Stress. Overthinking. Emotional heaviness.
                        Not because you’re weak — but because your inner balancing system has been suppressed.
                        Your mind fights itself. You’re not meant to live like this.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <a href="#" className="btn btn-primary">Take the Consciousness Assessment</a>
                    </div>
                </div>
                <div className="venn-image">
                    <img src="/ikigai-dark.png" alt="Ikigai Diagram" />
                </div>
            </div>
        </section>
    );
};

export default VennSection;
