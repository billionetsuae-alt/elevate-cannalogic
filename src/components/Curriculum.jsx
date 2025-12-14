import React, { useState } from 'react';
import './Curriculum.css';

const levels = [
    {
        id: 'level1',
        title: 'The System',
        subtitle: 'Endocannabinoid System (ECS)',
        content: ['Natural regulatory network inside you', 'Designed to work with this plant']
    },
    {
        id: 'level2',
        title: 'Function 1',
        subtitle: 'Balance Mood',
        content: ['Stabilizes emotional highs and lows', 'Reduces inner noise']
    },
    {
        id: 'level3',
        title: 'Function 2',
        subtitle: 'Regulate Stress',
        content: ['Lowers cortisol naturally', 'Prevents burnout and fatigue']
    },
    {
        id: 'level4',
        title: 'Function 3',
        subtitle: 'Support Sleep',
        content: ['Restores natural circadian rhythm', 'Deep, restorative rest']
    },
    {
        id: 'level5',
        title: 'The Result',
        subtitle: 'Inner Harmony',
        content: ['Intuition rises', 'Clarity expands', 'Consciousness aligns']
    },
    {
        id: 'level6',
        title: 'The Verdict',
        subtitle: 'Biology, Not Mythology',
        content: ['Scientifically validated', 'Historically proven']
    }
];

const Curriculum = () => {
    const [activeLevel, setActiveLevel] = useState('level1');

    return (
        <section className="curriculum-section">
            <div className="container curriculum-layout">
                <div className="curriculum-sidebar">
                    <div className="sticky-wrapper">
                        <h2>The Science</h2>
                        <p style={{ color: 'gray', marginBottom: '1.5rem' }}>Your Body Was Designed to Work with This Plant.</p>
                        <ul className="level-nav">
                            {levels.map(level => (
                                <li
                                    key={level.id}
                                    className={activeLevel === level.id ? 'active' : ''}
                                    onClick={() => setActiveLevel(level.id)}
                                >
                                    <span className="level-num">{level.title}</span>
                                    <span className="level-sub">{level.subtitle}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="curriculum-content">
                    {levels.map(level => (
                        <div key={level.id} id={level.id} className="level-block">
                            <div className="mobile-header">
                                <h3>{level.title}</h3>
                                <p>{level.subtitle}</p>
                            </div>
                            <div className="level-details">
                                <ul>
                                    {level.content.map((point, idx) => (
                                        <li key={idx}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Curriculum;
