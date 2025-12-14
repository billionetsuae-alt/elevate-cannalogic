import React from 'react';
import './Mentors.css';

const Mentors = () => {
    const mentors = [
        {
            name: "Dr. Ravi Shankar",
            role: "Chief Scientific Officer",
            image: "/assets/raghumm.webp",
            company: "Ayureda Institute"
        },
        {
            name: "Meera Patel",
            role: "Holistic Health Coach",
            image: "/assets/parimala.webp",
            company: "Wellness Collective"
        },
        {
            name: "Arjun Singh",
            role: "Cannabis Researcher",
            image: "/assets/ub.webp",
            company: "Green Science Lab"
        },
        {
            name: "Priya Sharma",
            role: "Ayurvedic Practitioner",
            image: "/assets/tamaranew.webp",
            company: "Veda Health"
        }
    ];

    return (
        <section className="mentors-section">
            <div className="container">
                <div className="section-header">
                    <h2>Guided by Experts in Ancient Wisdom & Modern Science</h2>
                    <p>Learn from the pioneers bridging the gap between Ayurveda and medical cannabis.</p>
                </div>

                <div className="mentors-grid">
                    {mentors.map((mentor, index) => (
                        <div key={index} className="mentor-card">
                            <div className="mentor-image">
                                <img src={mentor.image} alt={mentor.name} />
                            </div>
                            <div className="mentor-info">
                                <h3>{mentor.name}</h3>
                                <p className="mentor-role">{mentor.role}</p>
                                <p className="mentor-company">{mentor.company}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Mentors;
