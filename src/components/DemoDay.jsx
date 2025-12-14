import React from 'react';
import './DemoDay.css';

const features = [
    {
        icon: 'dd2.svg',
        title: 'Ministry Approved',
        desc: 'Fully compliant with AYUSH regulations and Indian law.'
    },
    {
        icon: 'dd3.svg',
        title: 'Doctor Dispensed',
        desc: 'Prescribed by certified Ayurvedic practitioners only.'
    },
    {
        icon: 'dd4.svg',
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
                            <img src={`/assets/${item.icon}`} alt={item.title} className="demoday-icon" />
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
