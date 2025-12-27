import React from 'react';
import './ProblemSection.css';

const ProblemSection = ({ onOpenAssessment }) => {
    return (
        <>
            {/* New Discovery Section - Cannabis Leaf on Left, Text on Right */}
            <section className="discovery-section">
                <div className="container discovery-container">
                    <div className="discovery-image">
                        <img src="/cannabis-leaf-spiritual.png" alt="Sacred Cannabis Leaf" />
                    </div>
                    <div className="discovery-text">
                        <p className="section-label">THE SCIENCE</p>
                        <h2>Discover the science behind the magical healing.</h2>
                        <p className="discovery-description">
                            Modern digital life has pushed you away from your true self, your inner child and your inner spirit.
                            Stress, Anxiety, Overthinking, Emotional heaviness is an indication of the inner imbalance.
                            Your mind fights itself. You have come a long journey throughout your life.
                            What you ate became your body, and what you think and experienced became your mind —
                            but what if the negativity you've accumulated in the past is holding you back from your best future?
                        </p>
                    </div>
                </div>
            </section>

            {/* Venn Diagram Section - Original: Text on Left, Image on Right */}
            <section className="venn-section">
                <div className="container venn-container">
                    <div className="venn-text">
                        <p className="section-label">IKIGAI – The purpose of life.</p>
                        <h2>Most people are not happy with where they are in life.</h2>
                        <p className="venn-description">
                            Most people complain about everything but do nothing to change anything.
                            Most people never realise their true potential. Most people wait until it's too late,
                            to realize they could have and should have gone after what they wanted in life.
                            I don't know about you.
                        </p>
                        <div style={{ marginTop: '2rem' }}>
                            <button onClick={onOpenAssessment} className="btn btn-primary">Take the Consciousness Assessment</button>
                        </div>
                    </div>
                    <div className="venn-image">
                        <img src="/ikigai-dark.png" alt="Ikigai Diagram" />
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProblemSection;
