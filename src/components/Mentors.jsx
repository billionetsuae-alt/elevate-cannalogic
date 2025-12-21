import React from 'react';
import './Mentors.css';

const Mentors = () => {
    const mentors = [
        {
            name: "Dr. Ravi Shankar",
            role: "Chief Scientific Officer",
            company: "Ayureda Institute",
            initials: "RS",
            color: "#4caf50"
        },
        {
            name: "Meera Patel",
            role: "Holistic Health Coach",
            company: "Wellness Collective",
            initials: "MP",
            color: "#8bc34a"
        },
        {
            name: "Arjun Singh",
            role: "Cannabis Researcher",
            company: "Green Science Lab",
            initials: "AS",
            color: "#26a69a"
        },
        {
            name: "Priya Sharma",
            role: "Ayurvedic Practitioner",
            company: "Veda Health",
            initials: "PS",
            color: "#66bb6a"
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
                            <div className="mentor-avatar" style={{ background: `linear-gradient(135deg, ${mentor.color}, ${mentor.color}dd)` }}>
                                <span className="avatar-initials">{mentor.initials}</span>
                                <div className="avatar-ring" style={{ borderColor: mentor.color }}></div>
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
