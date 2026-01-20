import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
    const faqs = [
        {
            question: "What is Full Spectrum Cannabis Oil?",
            answer: "It represents the complete extraction of the plant, preserving CBD, THC, and minor cannabinoids to create the \"Entourage Effect\" for maximum therapeutic potential, unlike isolated compounds."
        },
        {
            question: "Is this product legal in India?",
            answer: "Yes, 100%. Our products are approved by the Ministry of Ayush and compliant with all Government of India regulations for Vijaya (Medical Cannabis) products."
        },
        {
            question: "Will I get \"high\" from using this?",
            answer: "No. Our formulation is chemically balanced to provide therapeutic relief (pain, stress, sleep) without intoxication or psychoactive effects when strictly dosed as prescribed."
        },
        {
            question: "Do I need a prescription?",
            answer: "Yes, a valid prescription is mandatory by law. We provide a complimentary medical consultation with our certified doctors to assess your eligibility and generate a prescription."
        },
        {
            question: "What conditions can this help with?",
            answer: "It is effective for managing chronic pain, stress, anxiety, insomnia, and inflammation. It helps regulate your body's Endocannabinoid System (ECS) for overall balance."
        },
        {
            question: "Are there any side effects?",
            answer: "It is natural and safe. Mild side effects like dry mouth or drowsiness may occur initially as your body adjusts. It is non-addictive and safer than many chemical painkillers."
        },
        {
            question: "How do I take the softgels?",
            answer: "Take 1 softgel daily after dinner or before bed for sleep/recovery. For stress/pain, take as directed by our physician. Swallow whole with water; do not chew."
        }
    ];

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        const isOpening = activeIndex !== index;
        if (isOpening) {
            import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                trackEvent(EVENTS.CLICK, 'landing', `faq_${index + 1}_opened`)
            );
        }
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="container">
                <div className="section-header">
                    <h2>Frequently Asked Questions</h2>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className="faq-question">
                                <h3>{faq.question}</h3>
                                <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
                            </div>
                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
