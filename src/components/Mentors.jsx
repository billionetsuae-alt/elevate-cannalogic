import React from 'react';
import './Mentors.css';

const Mentors = () => {
    const mentors = [
        {
            name: "Dr. Sankalp Khullar",
            role: "BAMS, Panchkarma Specialist",
            company: "",
            image: "/dr-sankalp-pro.png",
            initials: "SK",
            color: "#4caf50"
        },
        {
            name: "Dr. Arathy Ravi",
            role: "BAMS, Holistic Healing",
            company: "",
            image: "/dr-arathy-pro.png",
            initials: "AR",
            color: "#8bc34a"
        },
        {
            name: "Thampi Nagarjuna",
            role: "Ancient Ayurveda Healer",
            company: "Ecoherb",
            image: "/thampi-nagarjuna-pro.png",
            initials: "TN",
            color: "#26a69a"
        },
        {
            name: "Akhil Tony",
            role: "Cannabis Activist",
            company: "Ecoherb",
            image: "/akhil-tony-pro.png",
            initials: "AT",
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
                            <div className="mentor-avatar" style={{ background: mentor.image ? 'transparent' : `linear-gradient(135deg, ${mentor.color}, ${mentor.color}dd)` }}>
                                {mentor.image ? (
                                    <img src={mentor.image} alt={mentor.name} className="mentor-photo" />
                                ) : (
                                    <span className="avatar-initials">{mentor.initials}</span>
                                )}
                                <div className="avatar-ring" style={{ borderColor: mentor.color }}></div>
                            </div>
                            <div className="mentor-info">
                                <h3>{mentor.name}</h3>
                                <p className="mentor-role">{mentor.role}</p>
                                {mentor.company && <p className="mentor-company">{mentor.company}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Mentors;
