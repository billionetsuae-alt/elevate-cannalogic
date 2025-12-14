import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
    const faqs = [
        {
            question: "Is this program certified?",
            answer: "Yes, our program is approved by the Ministry of AYUSH and recognized by leading medical cannabis institutions."
        },
        {
            question: "Do I need a medical background?",
            answer: "While beneficial, it is not strictly required. The curriculum is designed to take you from foundational concepts to advanced applications."
        },
        {
            question: "What is the duration of the course?",
            answer: "The program is a 6-month intensive fellowship with hybrid learning modules."
        },
        {
            question: "Is financial aid available?",
            answer: "Yes, we offer flexible payment plans and limited scholarships for eligible candidates."
        }
    ];

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
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
