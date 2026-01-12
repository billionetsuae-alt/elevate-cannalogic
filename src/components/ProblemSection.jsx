import React from 'react';
import './ProblemSection.css';

const ProblemSection = ({ onOpenAssessment }) => {
    return (
        <>
            {/* New Discovery Section - Cannabis Leaf on Left, Text on Right */}
            <section className="discovery-section">
                <div className="container discovery-container">
                    {/* Mobile Heading - Visible on Mobile Only */}
                    <p className="section-label mobile-label">The Magical Healing</p>

                    <div className="discovery-image">
                        <img src="/cannabis-leaf-spiritual.jpg" alt="Sacred Cannabis Leaf" />
                    </div>
                    <div className="discovery-text">
                        {/* Desktop Heading - Visible on Desktop Only */}
                        <p className="section-label desktop-label">The Magical Healing</p>

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

            {/* Vibrational Energy Section */}
            <section className="energy-section">
                <div className="container energy-container">
                    {/* Mobile Label Only */}
                    <p className="section-label mobile-label">Levels of Consciousness</p>

                    <div className="energy-image">
                        <img src="/vibrational-energy-chart.png" alt="Vibrational Energy Chart" />
                    </div>

                    <div className="energy-text">
                        {/* Desktop Label Only */}
                        <p className="section-label desktop-label">Levels of Consciousness</p>

                        <p className="energy-description">
                            <strong>Consciousness isn't static—it's a spectrum.</strong> When we are caught in survival modes like fear or stress, our frequency drops. Elevate is formulated to help shift your baseline state upwards, moving you from contraction into expansion, clarity, and flow.
                        </p>
                    </div>
                </div>
            </section>

            {/* Venn Diagram Section - Original: Text on Left, Image on Right */}
            {/* Venn Diagram Section - Flipped: Image Left, Text Right */}
            <section className="venn-section">
                <div className="container venn-container venn-flipped">
                    {/* Mobile Label Only */}
                    <p className="section-label mobile-label">IKIGAI – The purpose of life.</p>

                    <div className="venn-text">
                        {/* Desktop Label Only */}
                        <p className="section-label desktop-label">IKIGAI – The purpose of life.</p>

                        <p className="venn-description">
                            <strong>Most people are not happy with where they are in life.</strong> Most people complain about everything but do nothing to change anything.
                            Most people never realise their true potential. Most people wait until it's too late,
                            to realize they could have and should have gone after what they wanted in life.
                            I don't know about you.
                        </p>
                        {/* Desktop button - hidden on mobile */}
                        <div className="venn-text-cta">
                            <button onClick={onOpenAssessment} className="btn btn-primary">Get Access</button>
                        </div>
                    </div>
                    <div className="venn-image">
                        <img src="/ikigai-dark.png" alt="Ikigai Diagram" />
                    </div>
                    <div className="venn-cta">
                        <button onClick={onOpenAssessment} className="btn btn-primary">Get Access</button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProblemSection;
