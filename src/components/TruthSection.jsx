import React from 'react';
import './TruthSection.css';

const TruthSection = () => {
    return (
        <section className="agentic-workflows-section">
            <div className="container">
                <div className="section-header">
                    <p className="subheading">THE CANNABIS INDUSTRY DILEMMA</p>
                    <h2>The Truth</h2>
                </div>

                <div className="workflow-comparison">
                    <div className="workflow-card the-truth animate-on-scroll">
                        <div className="card-header">
                            <h3>The Truth</h3>
                            <p>The reality of the Medical Cannabis Revolution</p>
                        </div>
                        <ul className="workflow-list">
                            <li>It's a verified, ancient medicine</li>
                            <li>Science helps validate Ayurveda</li>
                            <li>The industry is booming with jobs</li>
                            <li>It's 100% legal with Ayush approval</li>
                            <li>Roles exist for counselors, coaches, & more</li>
                        </ul>
                    </div>

                    {/* Image placeholder for future image */}
                    {/* Comparison Image */}
                    <div className="truth-image-container">
                        <img src="/truth-hero.png" alt="Fusion of Ayurveda and Modern Science" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TruthSection;
