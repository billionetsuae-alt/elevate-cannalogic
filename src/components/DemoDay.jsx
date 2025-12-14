import React from 'react';
import './DemoDay.css';

const features = [
    {
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
            </svg>
        ),
        title: 'Ministry Approved',
        desc: 'Fully compliant with AYUSH regulations and Indian law.'
    },
    {
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
        ),
        title: 'Doctor Dispensed',
        desc: 'Prescribed by certified Ayurvedic practitioners only.'
    },
    {
        icon: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                <path d="M12 6v6l4 2" />
            </svg>
        ),
        title: '100% Safe',
        desc: 'Pure, full-spectrum extract. Non-dependency forming.'
    }
];

const DemoDay = () => {
    return (
        <section className="demoday-section">
            <div className="container">
                <div className="demoday-header">
                    <h2>Legality & Safety</h2>
                    <p>100% Legal. 100% Safe. Ministry of AYUSH Approved.</p>
                </div>

                <div className="demoday-grid">
                    {features.map((item, index) => (
                        <div key={index} className="demoday-card">
                            <div className="demoday-icon">{item.icon}</div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DemoDay;
