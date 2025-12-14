import React from 'react';
import './GlobalCommunity.css';

const stats = [
    { icon: 'sc1.svg', value: '100%', label: 'Legal' },
    { icon: 'sc2.svg', value: 'AYUSH', label: 'Approved' },
    { icon: 'sc3.svg', value: 'Ancient', label: 'Wisdom' },
    { icon: 'sc4.svg', value: 'Zero', label: 'Additives' },
    { icon: 'sc5.svg', value: '24/7', label: 'Support' }
];

const GlobalCommunity = () => {
    return (
        <section className="community-section">
            <div className="container">
                <div className="community-header">
                    <h2>A Movement of Consciousness</h2>
                    <p>Join thousands of seekers returning to their roots.</p>
                </div>

                <div className="map-container">
                    <img src="/assets/mc3.svg" alt="World Map" className="world-map" />
                </div>

                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <img src={`/assets/${stat.icon}`} alt={stat.label} />
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GlobalCommunity;
