import React, { useEffect, useState } from 'react';
import './ProductPage.css';
import {
    Sparkles, Leaf, ShieldCheck, Award, Truck, Heart,
    Check, Star, Clock, Users, Package, ChevronRight,
    Rocket, ArrowRight, Play, Quote, Zap, Brain,
    Gift, Timer, TrendingUp, Crown, BadgeCheck, Minus, Plus
} from 'lucide-react';

const ProductPage = ({ userData, onClose }) => {
    const {
        name = 'Friend',
        totalScore = 0,
        maxScore = 32
    } = userData || {};

    const firstName = name.split(' ')[0];
    const scorePercentage = Math.round((totalScore / maxScore) * 100);

    // Quantity state
    const [quantity, setQuantity] = useState(1);
    const basePrice = 1999;
    const originalPrice = 2999;

    // Countdown timer state (3 minutes = 180 seconds)
    const [timeLeft, setTimeLeft] = useState(180);
    const [offerExpired, setOfferExpired] = useState(false);

    // Product gallery images
    const productImages = [
        { src: '/elevate product image.png', alt: 'Elevate Capsules - Main' },
        { src: '/capsule-2.png', alt: 'Elevate Capsules - Close Up' },
        { src: '/ebook-cover.png', alt: 'Mystery Transformation Ebook' },
        { src: '/ebook-mockup.jpg', alt: 'Ebook Mockup' }
    ];
    const [selectedImage, setSelectedImage] = useState(0);

    // Countdown timer effect
    useEffect(() => {
        if (timeLeft <= 0) {
            setOfferExpired(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getReadinessLevel = () => {
        if (scorePercentage >= 88) return { level: "Highly Ready", color: "#4caf50", gradient: "linear-gradient(135deg, #4caf50, #8bc34a)" };
        if (scorePercentage >= 66) return { level: "Ready", color: "#8bc34a", gradient: "linear-gradient(135deg, #8bc34a, #cddc39)" };
        if (scorePercentage >= 44) return { level: "Approaching Readiness", color: "#ffc107", gradient: "linear-gradient(135deg, #ffc107, #ff9800)" };
        return { level: "Exploring", color: "#ff9800", gradient: "linear-gradient(135deg, #ff9800, #f44336)" };
    };

    const readiness = getReadinessLevel();

    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, Math.min(10, prev + delta)));
    };

    const handleBuyNow = () => {
        // Razorpay integration placeholder
        window.open('https://calendly.com/cannalogic/consultation', '_blank');
    };

    return (
        <div className="product-page">
            {/* Animated Background */}
            <div className="pp-bg-glow"></div>
            <div className="pp-bg-pattern"></div>

            {/* Navigation */}
            <nav className="pp-nav">
                <div className="pp-container">
                    <button className="pp-back-btn" onClick={onClose}>
                        ← Back to Home
                    </button>
                    <div className="pp-nav-logo">
                        <img src="/Cannalogic-White.svg" alt="CannaLogic" className="pp-logo-img" />
                    </div>
                </div>
            </nav>

            {/* Hero Section - Personalized */}
            <section className="pp-hero">
                <div className="pp-container">
                    <div className="pp-hero-content">
                        <div className="pp-badge-row">
                            <div className="pp-badge animated">
                                <Sparkles size={16} />
                                <span>Personalized for {firstName}</span>
                            </div>
                        </div>

                        <h1 className="pp-hero-title">
                            Your Transformation Journey
                            <span className="highlight"> Starts Here</span>
                        </h1>

                        <div className="pp-score-card">
                            <div className="pp-score-visual">
                                <svg className="pp-score-ring" viewBox="0 0 120 120">
                                    <circle className="ring-bg" cx="60" cy="60" r="52" />
                                    <circle
                                        className="ring-progress"
                                        cx="60"
                                        cy="60"
                                        r="52"
                                        style={{
                                            strokeDasharray: `${(scorePercentage / 100) * 327} 327`,
                                            stroke: readiness.color
                                        }}
                                    />
                                </svg>
                                <div className="pp-score-inner">
                                    <span className="pp-score-value">{scorePercentage}</span>
                                    <span className="pp-score-max">/100</span>
                                </div>
                            </div>
                            <div className="pp-score-details">
                                <span className="pp-score-label">Your Readiness Score</span>
                                <h3 className="pp-score-level" style={{ color: readiness.color }}>
                                    {readiness.level}
                                </h3>
                                <p className="pp-score-desc">
                                    Based on your responses, you're ready to begin your transformation journey.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Showcase */}
            <section className="pp-product-showcase">
                <div className="pp-container">
                    <div className="pp-product-grid">
                        <div className="pp-product-visual">
                            <div className="pp-gallery">
                                <div className="pp-gallery-main">
                                    <div className="pp-product-glow"></div>
                                    <img
                                        src={productImages[selectedImage].src}
                                        alt={productImages[selectedImage].alt}
                                        className="pp-product-img"
                                    />
                                </div>
                                <div className="pp-gallery-thumbnails">
                                    {productImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`pp-thumbnail ${selectedImage === index ? 'active' : ''}`}
                                            onMouseEnter={() => setSelectedImage(index)}
                                        >
                                            <img src={img.src} alt={img.alt} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pp-product-details">
                            {/* Personalized Offer Bundle */}
                            <div className="pp-offer-bundle">
                                <div className="pp-offer-header">
                                    <Crown size={24} />
                                    <span>Exclusive Bundle Offer for {firstName}</span>
                                </div>

                                <div className="pp-offer-items">
                                    <div className="pp-offer-item">
                                        <div className="pp-offer-item-info">
                                            <Users size={20} />
                                            <span>1-on-1 Personalized Guidance</span>
                                        </div>
                                        <span className="pp-offer-item-price">₹5,000</span>
                                    </div>
                                    <div className="pp-offer-item">
                                        <div className="pp-offer-item-info">
                                            <Package size={20} />
                                            <span>Elevate Capsules (30-day supply)</span>
                                        </div>
                                        <span className="pp-offer-item-price">₹6,000</span>
                                    </div>
                                    <div className="pp-offer-item">
                                        <div className="pp-offer-item-info">
                                            <Gift size={20} />
                                            <span>Mystery Transformation Ebook</span>
                                        </div>
                                        <span className="pp-offer-item-price">₹1,500</span>
                                    </div>
                                </div>

                                <div className="pp-offer-total">
                                    <span className="pp-offer-total-label">Total Value:</span>
                                    <span className="pp-offer-total-original">₹12,500</span>
                                </div>

                                <div className="pp-offer-special">
                                    <div className="pp-offer-special-badge">
                                        <Sparkles size={18} />
                                        <span>Special Offer</span>
                                    </div>
                                    <div className="pp-offer-special-price">
                                        <span className="pp-currency">₹</span>
                                        <span className="pp-amount">3,899</span>
                                    </div>
                                    <p className="pp-offer-savings">You save ₹8,601 (69% OFF)</p>
                                </div>
                            </div>

                            <button className="pp-cta-button" onClick={handleBuyNow} disabled={offerExpired}>
                                <Rocket size={22} />
                                <span>{offerExpired ? 'Offer Expired' : 'Claim My Exclusive Bundle'}</span>
                                {!offerExpired && <ArrowRight size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="pp-benefits">
                <div className="pp-container">
                    <div className="pp-section-header">
                        <span className="pp-section-label">Why This Works</span>
                        <h2 className="pp-section-title">
                            Designed for Your Transformation, {firstName}
                        </h2>
                    </div>

                    <div className="pp-benefits-grid">
                        {[
                            { icon: Brain, title: "Mental Clarity", desc: "Experience crystal-clear thinking and enhanced focus for your daily journey." },
                            { icon: Heart, title: "Emotional Balance", desc: "Find your center and maintain stable, positive emotional states." },
                            { icon: Zap, title: "Conscious Awareness", desc: "Deepen your connection to presence and heightened awareness." },
                            { icon: Leaf, title: "Natural Formula", desc: "100% plant-based ingredients, backed by ancient Ayurvedic wisdom." }
                        ].map((benefit, i) => (
                            <div className="pp-benefit-card" key={i}>
                                <div className="pp-benefit-icon">
                                    <benefit.icon size={28} />
                                </div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What's Inside */}
            <section className="pp-ingredients">
                <div className="pp-container">
                    <div className="pp-section-header light">
                        <span className="pp-section-label">Premium Quality</span>
                        <h2 className="pp-section-title">What's Inside Each Capsule</h2>
                    </div>

                    <div className="pp-ingredients-grid">
                        {[
                            { title: "Premium Hemp Extract", desc: "High-quality, legal hemp compounds" },
                            { title: "Ashwagandha", desc: "Ancient adaptogenic herb for stress relief" },
                            { title: "Brahmi", desc: "Cognitive enhancement & mental clarity" },
                            { title: "Tulsi Extract", desc: "Holy basil for balance & immunity" },
                            { title: "Black Pepper Extract", desc: "Enhanced bioavailability" },
                            { title: "Coconut Oil Base", desc: "Optimal absorption & purity" }
                        ].map((item, i) => (
                            <div className="pp-ingredient-item" key={i}>
                                <div className="pp-ingredient-check">
                                    <Check size={18} />
                                </div>
                                <div className="pp-ingredient-content">
                                    <strong>{item.title}</strong>
                                    <span>{item.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pp-certifications">
                        <div className="pp-cert-item">
                            <ShieldCheck size={24} />
                            <span>Ministry of AYUSH Approved</span>
                        </div>
                        <div className="pp-cert-item">
                            <Award size={24} />
                            <span>Third-Party Lab Tested</span>
                        </div>
                        <div className="pp-cert-item">
                            <BadgeCheck size={24} />
                            <span>GMP Certified Facility</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="pp-testimonials">
                <div className="pp-container">
                    <div className="pp-section-header">
                        <span className="pp-section-label">Real Stories</span>
                        <h2 className="pp-section-title">What Our Community Says</h2>
                    </div>

                    <div className="pp-testimonials-grid">
                        {[
                            { name: "Rahul M.", location: "Mumbai", text: "This has completely transformed my morning routine. I feel more centered and aware throughout the day. Highly recommend to anyone on a conscious journey!" },
                            { name: "Priya S.", location: "Bangalore", text: "Finally found something natural that actually works. The quality is exceptional and I've noticed real changes in my mental clarity and emotional stability." },
                            { name: "Amit K.", location: "Delhi", text: "I was skeptical at first, but after a month I can honestly say this has helped me tremendously on my journey of self-discovery and inner peace." }
                        ].map((review, i) => (
                            <div className="pp-testimonial-card" key={i}>
                                <div className="pp-testimonial-quote">
                                    <Quote size={24} />
                                </div>
                                <div className="pp-testimonial-stars">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} size={16} fill="#ffc107" color="#ffc107" />
                                    ))}
                                </div>
                                <p className="pp-testimonial-text">{review.text}</p>
                                <div className="pp-testimonial-author">
                                    <div className="pp-author-avatar">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div className="pp-author-info">
                                        <span className="pp-author-name">{review.name}</span>
                                        <span className="pp-author-location">{review.location}</span>
                                    </div>
                                    <BadgeCheck size={18} className="pp-verified" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="pp-faq">
                <div className="pp-container">
                    <div className="pp-section-header">
                        <span className="pp-section-label">Common Questions</span>
                        <h2 className="pp-section-title">Frequently Asked Questions</h2>
                    </div>

                    <div className="pp-faq-grid">
                        {[
                            { q: "Is this legal in India?", a: "Yes! Our product is Ministry of AYUSH approved and 100% legal. We use only permitted hemp compounds within legal THC limits." },
                            { q: "How long until I see results?", a: "Most people notice subtle changes within the first week, with more significant benefits after 2-4 weeks of consistent use." },
                            { q: "Are there any side effects?", a: "Our natural formulation is gentle and well-tolerated. Some may experience mild relaxation initially. Always consult your doctor if you have concerns." },
                            { q: "How do I take it?", a: "Simply take one capsule daily with water, preferably in the morning or as directed. Each bottle contains 30 capsules (one month supply)." }
                        ].map((faq, i) => (
                            <div className="pp-faq-item" key={i}>
                                <h3>{faq.q}</h3>
                                <p>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="pp-footer">
                <div className="pp-container">
                    <div className="pp-footer-content">
                        <div className="pp-footer-logo">
                            <img src="/Cannalogic-White.svg" alt="CannaLogic" className="pp-footer-logo-img" />
                        </div>
                        <p className="pp-footer-copy">© 2024 CannaLogic. All rights reserved.</p>
                    </div>
                    <p className="pp-disclaimer">
                        *These statements have not been evaluated by any regulatory authority.
                        This product is not intended to diagnose, treat, cure, or prevent any disease.
                        Please consult your healthcare provider before use.
                    </p>
                </div>
            </footer>

            {/* Sticky Footer Timer */}
            {!offerExpired && (
                <div className="pp-sticky-footer">
                    <div className="pp-sticky-timer">
                        <span className="pp-sticky-label">Offer Will Expire In</span>
                        <div className="pp-sticky-countdown">
                            <div className="pp-sticky-time-unit">
                                <span className="pp-sticky-time-value">{Math.floor(timeLeft / 60).toString().padStart(2, '0')}</span>
                                <span className="pp-sticky-time-label">minutes</span>
                            </div>
                            <div className="pp-sticky-time-unit">
                                <span className="pp-sticky-time-value">{(timeLeft % 60).toString().padStart(2, '0')}</span>
                                <span className="pp-sticky-time-label">seconds</span>
                            </div>
                        </div>
                    </div>
                    <button className="pp-sticky-cta" onClick={handleBuyNow}>
                        Claim Offer Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductPage;
