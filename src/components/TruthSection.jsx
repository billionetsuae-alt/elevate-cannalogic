import React from 'react';
import './TruthSection.css';

const TruthSection = () => {
    return (
        <section className="agentic-workflows-section">
            <div className="container">
                <div className="section-header">
                    <p className="subheading">THE CANNABIS INDUSTRY DILEMMA</p>
                    <h2>The Lie vs. The Truth</h2>
                </div>

                <div className="workflow-comparison">
                    <div className="workflow-card the-lie">
                        <div className="card-header">
                            <h3>The Lie</h3>
                            <p>What they want you to believe</p>
                        </div>
                        <ul className="workflow-list">
                            <li>Cannabis is just a recreational drug</li>
                            <li>"Ayurveda is pseudoscience"</li>
                            <li>You can't build a career in this field</li>
                            <li>It's illegal and dangerous</li>
                            <li>Only doctors can work with cannabis</li>
                        </ul>
                    </div>

                    <div className="workflow-card the-truth">
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
                </div>
            </div>
        </section>
    );
};

export default TruthSection;
