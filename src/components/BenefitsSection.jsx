import React from 'react';
import './BenefitsSection.css';

const features = [
    {
        years: 'Calm Mind',
        label: 'Clarity',
        desc: 'Overthinking slows. Awareness sharpens. You begin perceiving life without the filters of stress.'
    },
    {
        years: 'Stability',
        label: 'Emotional Balance',
        desc: 'Your reactions soften. Your inner strength rises. No crashes, just balanced vitality.'
    },
    {
        years: 'Sleep',
        label: 'Deep Rest',
        desc: 'Your nervous system finally unwinds. You wake up refreshed, not drained.'
    }
];

const BenefitsSection = () => {
    return (
        <section className="target-section">
            <div className="container">
                <div className="section-header">
                    <p className="section-label">THE BENEFITS</p>
                    <h2>What Happens When Your Body Returns to Balance?</h2>
                </div>

                <div className="audience-grid">
                    {features.map((item, index) => (
                        <div key={index} className="audience-card animate-on-scroll">
                            <div className="card-bg-placeholder"></div>
                            <div className="card-content">
                                <h3>{item.years}</h3>
                                <p className="exp-label">{item.label}</p>
                                <p className="card-desc">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;
