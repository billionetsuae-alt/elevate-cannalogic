import React from 'react';
import './QuotesSlider.css';

const QuotesSlider = () => {
    return (
        <section className="quotes-section">
            <div className="container">
                <div className="quote-card">
                    <div className="quote-content">
                        <blockquote>
                            "When your ECS activates, your inner noise drops, your clarity rises, your consciousness expands. This is biology, not mythology."
                        </blockquote>
                        <cite>- The Science of Alignment</cite>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuotesSlider;
