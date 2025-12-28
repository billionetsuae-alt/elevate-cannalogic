import React, { useEffect, useRef, useState } from 'react';
import {
    Brain,
    TrendingUp,
    Activity,
    Users,
    Coins,
    Zap, // or CloudLightning
    Sparkles
} from 'lucide-react';
import './ScienceSection.css';

const ScienceSection = () => {
    const [activeLevel, setActiveLevel] = useState(0);
    const contentRefs = useRef([]);

    const levels = [
        {
            id: 'level1',
            title: 'Inner Clarity',
            subtitle: 'Beginners Seeking Inner Clarity (No Spiritual Experience Needed)',
            icon: Sparkles,
            items: [
                'If you want calm, balance, and emotional stability without rituals or belief systems, this is for you.'
            ]
        },
        {
            id: 'level2',
            title: 'Unlocking Potential',
            subtitle: 'High Achievers Who Feel Stuck Despite Effort',
            icon: TrendingUp,
            items: [
                'You push, work, and try — but progress feels blocked, slow, or inconsistent without a clear reason.'
            ]
        },
        {
            id: 'level3',
            title: 'Somatic Relief',
            subtitle: 'People Facing Stress-Driven Health Symptoms',
            icon: Activity,
            items: [
                'Your body feels tense, tired, or overwhelmed because the mind rarely gets a moment of real calm.'
            ]
        },
        {
            id: 'level4',
            title: 'Relationship Harmony',
            subtitle: 'Those Struggling With Repeating Relationship',
            icon: Users,
            items: [
                'You notice the same emotional triggers, conflicts, or misunderstandings repeating across relationships.'
            ]
        },
        {
            id: 'level5',
            title: 'Financial Peace',
            subtitle: 'Individuals With Money Stress or Decision Anxiety',
            icon: Coins,
            items: [
                'You work hard but still feel financial pressure, inconsistency, or confusion around important money choices.'
            ]
        },
        {
            id: 'level6',
            title: 'Emotional Lightness',
            subtitle: 'People Who Feel Mentally Heavy',
            icon: Zap,
            items: [
                'Even when life looks “fine” externally, your inner world feels cluttered, stressed, or emotionally drained.'
            ]
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = contentRefs.current.indexOf(entry.target);
                        if (index !== -1) {
                            setActiveLevel(index);
                        }
                    }
                });
            },
            {
                rootMargin: '-20% 0px -60% 0px',
                threshold: 0
            }
        );

        contentRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToLevel = (index) => {
        contentRefs.current[index]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        setActiveLevel(index);
    };

    return (
        <section className="curriculum-section">
            <div className="container">
                {/* Mobile Header */}
                <div className="mobile-section-header">
                    <h2>Is This For You?</h2>
                    <p>Designed for those seeking real transformation.</p>
                </div>

                <div className="curriculum-layout">
                    {/* Sticky Sidebar */}
                    <div className="curriculum-sidebar">
                        <div className="sticky-wrapper">
                            <h2>Is This For You?</h2>
                            <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>
                                Designed for those seeking real transformation.
                            </p>
                            <ul className="level-nav">
                                {levels.map((level, index) => (
                                    <li
                                        key={index}
                                        className={activeLevel === index ? 'active' : ''}
                                        onClick={() => scrollToLevel(index)}
                                    >
                                        <span className="level-num">{level.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="curriculum-content">
                        {levels.map((level, index) => {
                            const Icon = level.icon;
                            return (
                                <div
                                    key={index}
                                    ref={el => contentRefs.current[index] = el}
                                    className={`level-block ${activeLevel === index ? 'active' : ''}`}
                                >
                                    <div className="level-header">
                                        <div className="level-icon-wrapper">
                                            <Icon size={28} className="level-icon" />
                                        </div>
                                        <div className="level-subtitle">{level.subtitle}</div>
                                    </div>
                                    <div className="level-details">
                                        <ul>
                                            {level.items.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ScienceSection;
