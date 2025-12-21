import React from 'react';
import './ProductPage.css';
import {
    Sparkles, Leaf, ShieldCheck, Award, Truck, Heart,
    Check, Star, Clock, Users, Package, ChevronRight,
    Rocket, ArrowRight, Play, Quote, Zap, Brain
} from 'lucide-react';

const ProductPage = ({ userData, onClose }) => {
    const {
        name = 'Friend',
        totalScore = 0,
        maxScore = 32
    } = userData || {};

    const firstName = name.split(' ')[0];
    const scorePercentage = Math.round((totalScore / maxScore) * 100);

    const getReadinessLevel = () => {
        if (totalScore >= 28) return { level: "Highly Ready", color: "#4caf50" };
        if (totalScore >= 21) return { level: "Ready", color: "#8bc34a" };
        if (totalScore >= 14) return { level: "Approaching Readiness", color: "#ffc107" };
        return { level: "Exploring", color: "#ff9800" };
    };

    const readiness = getReadinessLevel();

    const handleBuyNow = () => {
        // Razorpay integration placeholder
        window.open('https://calendly.com/cannalogic/consultation', '_blank');
    };

    return (
        <div className="product-page">
            {/* Hero Section - Personalized */}
            <section className="pp-hero">
                <div className="pp-container">
                    <button className="pp-back-btn" onClick={onClose}>
                        ← Back to Home
                    </button>

                    <div className="pp-personalized-header">
                        <div className="pp-badge">
                            <Sparkles size={16} />
                            <span>Personalized for {firstName}</span>
                        </div>

                        <div className="pp-score-summary">
                            <div className="pp-score-circle" style={{ borderColor: readiness.color }}>
                                <span className="pp-score-value">{totalScore}</span>
                                <span className="pp-score-max">/{maxScore}</span>
                            </div>
                            <div className="pp-score-info">
                                <h3 style={{ color: readiness.color }}>{readiness.level}</h3>
                                <p>Your Transformation Readiness Score</p>
                            </div>
                        </div>

                        <div className="pp-personalized-message">
                            <p>
                                Based on your responses, {firstName}, you're ready to begin your journey
                                toward inner transformation. We've identified the perfect solution to
                                support your path.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Hero */}
            <section className="pp-product-hero">
                <div className="pp-container">
                    <div className="pp-product-grid">
                        <div className="pp-product-image">
                            <div className="pp-image-placeholder">
                                <Package size={80} strokeWidth={1} />
                                <span>Product Image</span>
                            </div>
                            {/* Replace with actual product image */}
                            {/* <img src="/elevate-capsules.png" alt="Elevate Capsules" /> */}
                        </div>

                        <div className="pp-product-info">
                            <div className="pp-product-badge">
                                <ShieldCheck size={14} />
                                Ministry of AYUSH Approved
                            </div>

                            <h1 className="pp-product-title">Elevate Capsules</h1>
                            <p className="pp-product-tagline">
                                Your Gateway to Inner Transformation
                            </p>

                            <p className="pp-product-description">
                                A premium, plant-based formulation designed to support conscious
                                transformation, mental clarity, and deeper awareness. Backed by
                                ancient wisdom and modern science.
                            </p>

                            <div className="pp-product-pricing">
                                <div className="pp-price-row">
                                    <span className="pp-price-original">₹2,999</span>
                                    <span className="pp-price-current">₹1,999</span>
                                    <span className="pp-price-save">Save 33%</span>
                                </div>
                                <p className="pp-price-note">One-time purchase • No subscription</p>
                            </div>

                            <button className="pp-cta-primary" onClick={handleBuyNow}>
                                <Rocket size={20} />
                                Begin My Transformation
                            </button>

                            <div className="pp-trust-badges">
                                <div className="pp-trust-item">
                                    <ShieldCheck size={16} />
                                    <span>30-Day Money Back</span>
                                </div>
                                <div className="pp-trust-item">
                                    <Truck size={16} />
                                    <span>Free Shipping</span>
                                </div>
                                <div className="pp-trust-item">
                                    <Package size={16} />
                                    <span>Discreet Packaging</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why This Works For You - Personalized */}
            <section className="pp-why-section">
                <div className="pp-container">
                    <h2 className="pp-section-title">
                        Why Elevate Capsules Are Right For You, {firstName}
                    </h2>

                    <div className="pp-why-grid">
                        <div className="pp-why-card">
                            <div className="pp-why-icon">
                                <Brain size={28} />
                            </div>
                            <h3>Mental Clarity</h3>
                            <p>Experience clearer thinking and enhanced focus for your transformation journey.</p>
                        </div>

                        <div className="pp-why-card">
                            <div className="pp-why-icon">
                                <Heart size={28} />
                            </div>
                            <h3>Emotional Balance</h3>
                            <p>Support your emotional wellbeing and find greater inner peace daily.</p>
                        </div>

                        <div className="pp-why-card">
                            <div className="pp-why-icon">
                                <Zap size={28} />
                            </div>
                            <h3>Conscious Awareness</h3>
                            <p>Deepen your connection to presence and heightened awareness states.</p>
                        </div>

                        <div className="pp-why-card">
                            <div className="pp-why-icon">
                                <Leaf size={28} />
                            </div>
                            <h3>Natural Formula</h3>
                            <p>100% plant-based ingredients with no harmful additives or chemicals.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="pp-features-section">
                <div className="pp-container">
                    <h2 className="pp-section-title">What's Inside</h2>

                    <div className="pp-features-grid">
                        <div className="pp-feature-item">
                            <Check size={20} />
                            <div>
                                <strong>Premium Hemp Extract</strong>
                                <span>High-quality, legal hemp compounds</span>
                            </div>
                        </div>

                        <div className="pp-feature-item">
                            <Check size={20} />
                            <div>
                                <strong>Adaptogenic Herbs</strong>
                                <span>Ashwagandha, Brahmi & more</span>
                            </div>
                        </div>

                        <div className="pp-feature-item">
                            <Check size={20} />
                            <div>
                                <strong>Ayurvedic Formulation</strong>
                                <span>Traditional wisdom, modern science</span>
                            </div>
                        </div>

                        <div className="pp-feature-item">
                            <Check size={20} />
                            <div>
                                <strong>Third-Party Tested</strong>
                                <span>Verified purity & potency</span>
                            </div>
                        </div>

                        <div className="pp-feature-item">
                            <Check size={20} />
                            <div>
                                <strong>30 Capsules Per Bottle</strong>
                                <span>One month supply</span>
                            </div>
                        </div>

                        <div className="pp-feature-item">
                            <Check size={20} />
                            <div>
                                <strong>Easy to Take</strong>
                                <span>One capsule daily with water</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="pp-testimonials">
                <div className="pp-container">
                    <h2 className="pp-section-title">What Others Are Saying</h2>

                    <div className="pp-testimonials-grid">
                        <div className="pp-testimonial-card">
                            <div className="pp-testimonial-stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill="#ffc107" color="#ffc107" />
                                ))}
                            </div>
                            <p className="pp-testimonial-text">
                                "This has completely changed my morning routine. I feel more centered
                                and aware throughout the day. Highly recommend!"
                            </p>
                            <div className="pp-testimonial-author">
                                <span className="pp-author-name">Rahul M.</span>
                                <span className="pp-author-location">Mumbai</span>
                            </div>
                        </div>

                        <div className="pp-testimonial-card">
                            <div className="pp-testimonial-stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill="#ffc107" color="#ffc107" />
                                ))}
                            </div>
                            <p className="pp-testimonial-text">
                                "Finally a natural solution that actually works. The quality is exceptional
                                and I've noticed real changes in my mental clarity."
                            </p>
                            <div className="pp-testimonial-author">
                                <span className="pp-author-name">Priya S.</span>
                                <span className="pp-author-location">Bangalore</span>
                            </div>
                        </div>

                        <div className="pp-testimonial-card">
                            <div className="pp-testimonial-stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill="#ffc107" color="#ffc107" />
                                ))}
                            </div>
                            <p className="pp-testimonial-text">
                                "I was skeptical at first, but after a month I can honestly say this
                                has helped me on my journey of self-discovery."
                            </p>
                            <div className="pp-testimonial-author">
                                <span className="pp-author-name">Amit K.</span>
                                <span className="pp-author-location">Delhi</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="pp-faq">
                <div className="pp-container">
                    <h2 className="pp-section-title">Frequently Asked Questions</h2>

                    <div className="pp-faq-list">
                        <div className="pp-faq-item">
                            <h3>Is this legal in India?</h3>
                            <p>Yes! Our product is Ministry of AYUSH approved and 100% legal. We use only permitted hemp compounds within legal THC limits.</p>
                        </div>

                        <div className="pp-faq-item">
                            <h3>How long until I see results?</h3>
                            <p>Most people notice subtle changes within the first week, with more significant benefits after 2-4 weeks of consistent use.</p>
                        </div>

                        <div className="pp-faq-item">
                            <h3>Are there any side effects?</h3>
                            <p>Our natural formulation is gentle and well-tolerated. Some people may experience mild relaxation initially. Consult your doctor if you have concerns.</p>
                        </div>

                        <div className="pp-faq-item">
                            <h3>How do I take it?</h3>
                            <p>Simply take one capsule daily with water, preferably in the morning or as directed by your wellness guide.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="pp-final-cta">
                <div className="pp-container">
                    <div className="pp-cta-box">
                        <h2>Ready to Begin Your Transformation, {firstName}?</h2>
                        <p>Join thousands who have started their journey to inner peace and clarity.</p>

                        <div className="pp-cta-pricing">
                            <span className="pp-cta-original">₹2,999</span>
                            <span className="pp-cta-current">₹1,999</span>
                        </div>

                        <button className="pp-cta-primary large" onClick={handleBuyNow}>
                            <Rocket size={22} />
                            Begin My Transformation Now
                        </button>

                        <div className="pp-cta-guarantees">
                            <div><ShieldCheck size={16} /> 30-Day Money Back Guarantee</div>
                            <div><Truck size={16} /> Free Pan-India Shipping</div>
                            <div><Package size={16} /> Discreet Packaging</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="pp-footer">
                <div className="pp-container">
                    <p>© 2024 CannaLogic. All rights reserved.</p>
                    <p className="pp-disclaimer">
                        *These statements have not been evaluated by any regulatory authority.
                        This product is not intended to diagnose, treat, cure, or prevent any disease.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ProductPage;
