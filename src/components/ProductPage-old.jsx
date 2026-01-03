import React, { useEffect, useState } from 'react';
import './ProductPage.css';
import './StickyTimer.css';
import CheckoutModal from './CheckoutModal';
import {
    Sparkles, Leaf, ShieldCheck, Award, Heart,
    Check, Star, Users, Package,
    Rocket, ArrowRight, Quote, Zap, Brain,
    Gift, Crown, BadgeCheck, Lightbulb, Sprout, ChevronDown
} from 'lucide-react';

const RESULT_DATA = [
    {
        range: [7, 14],
        phase: "Survival Phase",
        title: "Returning to Safety",
        color: "#f44336",
        gradient: "linear-gradient(135deg, #f44336, #e91e63)",
        meaning: [
            "Constant mental fatigue or overthinking",
            "Emotional heaviness or numbness",
            "Difficulty relaxing or sleeping",
            "Feeling disconnected from yourself"
        ],
        support: {
            heading: "A steady hand holding you when everything feels too much.",
            points: [
                "Nervous system regulation",
                "Emotional grounding",
                "Reduction in mental overload",
                "A sense of inner safety and calm"
            ]
        },
        usage: {
            guide: [
                "Best taken during the evening or when you feel overwhelmed",
                "Create a calm environment — dim lights, silence, rest",
                "Avoid stimulation after use (screens, stress, noise)",
                "Let your body slow down naturally"
            ]
        },
        dosing: [
            {
                title: "Option 1: Single Dose — Gentle Stabilization",
                bestFor: "First-time users, High sensitivity, Daily emotional support",
                experience: "Subtle calming effect, Reduced mental noise, Gentle sense of grounding",
                when: "Evening, before rest, or during emotional overwhelm"
            },
            {
                title: "Option 2: Double Dose — Deeper Grounding",
                bestFor: "High stress or emotional overload, Persistent anxiety",
                experience: "Deeper calming response, Stronger sense of safety",
                when: "During intense days, emotional recovery periods"
            }
        ],
        reminder: "You are not broken. You are responding to pressure the best way you know how. This phase is not about fixing yourself — it’s about giving your system permission to breathe again."
    },
    {
        range: [15, 21],
        phase: "Stabilization Phase",
        title: "Reconnecting with Yourself",
        color: "#ff9800",
        gradient: "linear-gradient(135deg, #ff9800, #ff5722)",
        meaning: [
            "Mental busyness",
            "Emotional ups and downs",
            "Occasional overwhelm or overthinking",
            "Difficulty switching off"
        ],
        support: {
            heading: "A stabilizing force that helps your system find its natural centre.",
            points: [
                "Soothe the nervous system",
                "Reduce mental noise",
                "Support emotional stability",
                "Enhance present-moment awareness",
                "Better sleep rhythms"
            ]
        },
        usage: {
            guide: [
                "Take in the evening or during downtime",
                "Start low and slow",
                "Pair with rest, short walks, or calm music",
                "Avoid overstimulation after use"
            ]
        },
        dosing: [
            {
                title: "Option 1: Single Dose — Balanced Support",
                bestFor: "Daily emotional regulation, Mild stress, Maintaining stability",
                experience: "Smooth calming effect, Improved emotional control, Clearer mindset",
                when: "Morning or early evening for daily balance"
            },
            {
                title: "Option 2: Double Dose — Deeper Stabilization",
                bestFor: "Ongoing stress patterns, Emotional sensitivity, Heavy mental load",
                experience: "Deeper emotional grounding, Reduced internal noise, Stability",
                when: "During emotionally demanding days or intentional self-care"
            }
        ],
        reminder: "Stability is not stagnation. It is the foundation from which clarity, growth, and confidence emerge. Balance isn’t something you force. It returns naturally when the body feels supported."
    },
    {
        range: [22, 28],
        phase: "Growth Phase",
        title: "Expanding Awareness",
        color: "#4caf50",
        gradient: "linear-gradient(135deg, #4caf50, #009688)",
        meaning: [
            "Increased self-awareness",
            "Curiosity about growth and meaning",
            "Desire for clarity, creativity, or deeper understanding",
            "A sense that “there’s more” within you"
        ],
        support: {
            heading: "A gentle amplifier for awareness — not pushing, just revealing.",
            points: [
                "Mental clarity and focus",
                "Emotional openness without instability",
                "Enhanced self-awareness",
                "A smoother connection between mind and body"
            ]
        },
        usage: {
            guide: [
                "Use during moments of reflection, creativity, or focused work",
                "Ideal before journaling, meditation, or intentional rest",
                "Create a calm, intentional setting",
                "Let awareness unfold naturally"
            ]
        },
        dosing: [
            {
                title: "Option 1: Single Dose — Conscious Balance",
                bestFor: "Daily clarity and presence, Light emotional support",
                experience: "Clearer thinking, Calm focus, Gentle uplift in awareness",
                when: "Morning or early afternoon during focused activities"
            },
            {
                title: "Option 2: Double Dose — Deeper Expansion",
                bestFor: "Inner exploration, Creative or spiritual practices",
                experience: "Heightened awareness, Stronger mind–body connection",
                when: "During intentional sessions or exploring deeper states"
            }
        ],
        reminder: "Growth isn’t about becoming someone new. It’s about remembering who you already are — with clarity, balance, and presence."
    },
    {
        range: [29, 35],
        phase: "Elevated State",
        title: "Living in Alignment",
        color: "#06b6d4",
        gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
        meaning: [
            "Creativity",
            "Emotional clarity",
            "Deeper self-awareness",
            "A sense of purpose and flow"
        ],
        support: {
            heading: "A quiet enhancer — helping you stay aligned while moving through life.",
            points: [
                "Sustained clarity and mental presence",
                "Creative flow and intuitive insight",
                "Calm energy without dullness",
                "Deep mind–body harmony"
            ]
        },
        usage: {
            guide: [
                "Use with intention, not habit",
                "Ideal during reflection, creative work, or mindful routines",
                "Best paired with silence, journaling, or meditation",
                "Allow the experience to unfold naturally"
            ]
        },
        dosing: [
            {
                title: "Option 1: Single Dose — Sustained Alignment",
                bestFor: "Maintaining clarity and balance, Conscious living",
                experience: "Clean mental clarity, Calm presence, Subtle uplift",
                when: "Morning or mid-day to maintain alignment"
            },
            {
                title: "Option 2: Double Dose — Deep Integration",
                bestFor: "Deep inner work, Creative/spiritual exploration",
                experience: "Heightened perception, Expanded awareness, Deep cohesion",
                when: "During intentional self-inquiry or rituals"
            }
        ],
        reminder: "Elevation isn’t escape. It’s living with awareness, clarity, and responsibility. You’re not trying to rise above life — you’re learning to meet it fully awake."
    }
];

const ProductPage = ({ userData, onClose, onPaymentSuccess }) => {
    const {
        name = 'Friend',
        totalScore = 0,
        maxScore = 32
    } = userData || {};

    const firstName = name.split(' ')[0];
    const scorePercentage = Math.round((totalScore / maxScore) * 100);

    // Countdown timer state (1 hour = 3600 seconds)
    const [timeLeft, setTimeLeft] = useState(3600);
    const [offerExpired, setOfferExpired] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [checkoutData, setCheckoutData] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);

    // Determine Result Phase based on Total Score
    const getResultPhase = () => {
        // Find phase where score falls within range
        const phase = RESULT_DATA.find(p => totalScore >= p.range[0] && totalScore <= p.range[1]);
        // Default to Phase 2 if undefined (safe fallback)
        return phase || RESULT_DATA[1];
    };

    const currentPhase = getResultPhase();

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
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    setOfferExpired(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Open checkout modal first
    const handleBuyNow = () => {
        setIsCheckoutOpen(true);
    };

    // Process payment after checkout form is filled
    const processPayment = (checkoutFormData) => {
        setCheckoutData(checkoutFormData);
        setIsCheckoutOpen(false);

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: 389900, // ₹3,899 in paise
            currency: 'INR',
            name: 'CannaLogic',
            description: 'Elevate Full Spectrum Bundle',
            image: '/Cannalogic-White.svg',
            prefill: {
                name: checkoutFormData.fullName || name || '',
                email: userData?.email || '',
                contact: checkoutFormData.phone || userData?.phone || ''
            },
            notes: {
                address: checkoutFormData.fullAddress,
                pincode: checkoutFormData.pincode,
                city: checkoutFormData.city,
                state: checkoutFormData.state
            },
            theme: {
                color: '#4caf50'
            },
            handler: async function (response) {
                // Payment successful
                console.log('Payment Success:', response);

                // Send to webhook with address
                try {
                    await fetch('https://n8n-642200223.kloudbeansite.com/webhook/razorpay-success', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            payment_id: response.razorpay_payment_id,
                            order_id: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            customer: {
                                name: checkoutFormData.fullName,
                                email: userData?.email,
                                phone: checkoutFormData.phone,
                                score: totalScore,
                                address: checkoutFormData.fullAddress,
                                pincode: checkoutFormData.pincode,
                                city: checkoutFormData.city,
                                state: checkoutFormData.state
                            },
                            recordId: userData?.recordId,
                            amount: 3899,
                            product: 'Elevate Full Spectrum Bundle'
                        })
                    });
                } catch (error) {
                    console.error('Webhook error:', error);
                }

                // Redirect to thank you page
                if (onPaymentSuccess) {
                    onPaymentSuccess(response);
                }
            },
            modal: {
                ondismiss: function () {
                    console.log('Payment cancelled');
                }
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    return (
        <div className="product-page">
            {/* Animated Background */}
            <div className="pp-bg-glow"></div>
            <div className="pp-bg-pattern"></div>

            {/* Navigation */}
            <nav className="pp-nav">
                <div className="pp-container">
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
                            <div className="pp-badge animated" style={{ background: currentPhase.color + '20', color: currentPhase.color, borderColor: currentPhase.color + '40' }}>
                                <Sparkles size={16} />
                                <span>{currentPhase.phase}</span>
                            </div>
                        </div>

                        <div className="pp-hero-welcome" style={{ color: currentPhase.color, marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                            Prepared for {firstName}
                        </div>
                        <h1 className="pp-hero-title">
                            {currentPhase.title}
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
                                            stroke: currentPhase.color
                                        }}
                                    />
                                </svg>
                                <div className="pp-score-inner">
                                    <span className="pp-score-value">{scorePercentage}</span>
                                    <span className="pp-score-max">/100</span>
                                </div>
                            </div>
                            <div className="pp-score-details">
                                <span className="pp-score-label">Your Assessment Score</span>
                                <h3 className="pp-score-level" style={{ color: currentPhase.color }}>
                                    {currentPhase.phase}
                                </h3>
                                <p className="pp-score-desc">
                                    We've analyzed your responses. Here is your personalized support plan.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Analysis Section (What This Means) */}
            <section className="pp-analysis">
                <div className="pp-container">
                    <div className="pp-analysis-content">
                        <span className="pp-section-label" style={{ color: currentPhase.color }}>Your Current State</span>
                        <h2 className="pp-analysis-title">What This Means For {firstName}</h2>
                        <h3 className="pp-experience-label">You may experience:</h3>
                        <div className="pp-meaning-grid-2col">
                            {currentPhase.meaning.map((point, i) => (
                                <div key={i} className="pp-meaning-card" style={{
                                    borderColor: currentPhase.color + '30',
                                    background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, ' + currentPhase.color + '05 100%)'
                                }}>
                                    <div className="pp-card-icon" style={{ backgroundColor: currentPhase.color + '20', color: currentPhase.color }}>
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    <span className="pp-card-text">{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Showcase */}
            <section className="pp-product-showcase">
                <div className="pp-container">
                    <div className="pp-product-grid">
                        {/* Left: Single Hero Image */}
                        <div className="pp-product-gallery">
                            <div className="pp-hero-image-container">
                                <img
                                    src="/bundle-hero.png"
                                    alt="Elevate Full Spectrum Bundle"
                                    className="pp-main-image single-hero"
                                />
                            </div>
                        </div>

                        {/* Right: Bundle Details */}
                        <div className="pp-product-details">
                            <div className="pp-product-header">
                                <div className="pp-header-top">
                                    <span className="pp-badge secondary">Best Value</span>
                                    <div className="pp-rating">
                                        <Star size={16} fill="#ffc107" color="#ffc107" />
                                        <span>4.9 (120+ Reviews)</span>
                                    </div>
                                </div>
                                <h1 className="pp-title">Elevate Full Spectrum Bundle</h1>
                            </div>

                            {/* Detailed Bundle Rows */}
                            <div className="pp-bundle-list-detailed" id="offer-bundle">
                                <div className="pp-bundle-row-item">
                                    <div className="pp-bundle-thumb">
                                        <img src="/dr-arathy-pro.png" alt="Guidance" />
                                    </div>
                                    <div className="pp-bundle-content">
                                        <div className="pp-bundle-row-header">
                                            <h4>1-on-1 Personalized Guidance</h4>
                                            <span className="pp-row-price">₹5,000</span>
                                        </div>
                                        <p>Expert consultation to align your journey and dosage.</p>
                                    </div>
                                </div>

                                <div className="pp-bundle-row-item">
                                    <div className="pp-bundle-thumb">
                                        <img src="/elevate product image.png" alt="Capsules" />
                                    </div>
                                    <div className="pp-bundle-content">
                                        <div className="pp-bundle-row-header">
                                            <h4>Elevate Capsules (30-day supply)</h4>
                                            <span className="pp-row-price">₹6,000</span>
                                        </div>
                                        <p>Full spectrum hemp extract for deep healing.</p>
                                    </div>
                                </div>

                                <div className="pp-bundle-row-item">
                                    <div className="pp-bundle-thumb">
                                        <img src="/ebook-cover.png" alt="Ebook" />
                                    </div>
                                    <div className="pp-bundle-content">
                                        <div className="pp-bundle-row-header">
                                            <h4>Mystery Transformation Ebook</h4>
                                            <span className="pp-row-price">₹1,500</span>
                                        </div>
                                        <p>Unlock hidden potential with daily practices.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Total Value & Pricing */}
                            <div className="pp-pricing-card">
                                <div className="pp-value-row">
                                    <span>Total Value</span>
                                    <span className="pp-value-crossed">₹12,500</span>
                                </div>
                                <div className="pp-price-main-row">
                                    <span className="pp-special-label">Special Offer</span>
                                    <div className="pp-final-price">
                                        <span className="pp-currency">₹</span>
                                        3,899
                                    </div>
                                </div>
                                <div className="pp-savings-badge">
                                    You save ₹8,601 (69% OFF)
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

            {/* Dynamic Support Section */}
            <section className="pp-dynamic-support">
                <div className="pp-container">
                    <div className="pp-section-header">
                        <span className="pp-section-label" style={{ color: currentPhase.color }}>Tailored Support</span>
                        <h2 className="pp-section-title">How the Full-Spectrum Extract Supports {firstName}</h2>
                        <p className="pp-support-subtitle">{currentPhase.support.heading}</p>
                    </div>

                    <div className="pp-support-grid">
                        {currentPhase.support.points.map((point, i) => {
                            const SupportIcons = [Brain, Sparkles, Zap, Heart];
                            const Icon = SupportIcons[i % SupportIcons.length];

                            return (
                                <div className="pp-support-card" key={i} style={{ borderTopColor: currentPhase.color }}>
                                    <div className="pp-support-icon" style={{ color: currentPhase.color, background: currentPhase.color + '15' }}>
                                        <Icon size={24} />
                                    </div>
                                    <p>{point}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Usage & Dosing Section */}
            <section className="pp-usage-section">
                <div className="pp-container">
                    {/* Guided Usage */}
                    <div className="pp-usage-guide">
                        <h3 className="pp-inner-title">
                            <Sparkles size={20} style={{ color: currentPhase.color }} />
                            Guided Usage Ritual
                        </h3>
                        <ul className="pp-usage-list">
                            {currentPhase.usage.guide.map((step, i) => (
                                <li key={i}>
                                    <span className="usage-dot" style={{ background: currentPhase.color }}></span>
                                    {step}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Dosing Options */}
                    <div className="pp-dosing-options">
                        <div className="pp-section-header">
                            <span className="pp-section-label">Your Path</span>
                            <h2 className="pp-section-title">Choosing Your Support Level</h2>
                        </div>
                        <div className="pp-dosing-grid">
                            {currentPhase.dosing.map((option, i) => (
                                <div className="pp-dosing-card" key={i}>
                                    <div className="pp-dosing-header" style={{ background: i === 1 ? currentPhase.color + '10' : '' }}>
                                        <h4 style={{ color: currentPhase.color }}>{option.title}</h4>
                                    </div>
                                    <div className="pp-dosing-body">
                                        <div className="dosing-block">
                                            <strong>🎯 Best For:</strong>
                                            <p>{option.bestFor}</p>
                                        </div>
                                        <div className="dosing-block">
                                            <strong>🌊 Experience:</strong>
                                            <p>{option.experience}</p>
                                        </div>
                                        <div className="dosing-block">
                                            <strong>⏰ When to use:</strong>
                                            <p>{option.when}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gentle Reminder */}
                    <div className="pp-reminder-box" style={{ borderColor: currentPhase.color + '40', background: currentPhase.color + '05' }}>
                        <Heart size={24} className="reminder-icon" style={{ color: currentPhase.color }} />
                        <h3>Gentle Reminder</h3>
                        <p>{currentPhase.reminder}</p>
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

            {/* Mindful Use Section (Final Message) */}
            <section className="pp-mindful">
                <div className="pp-container">
                    <div className="pp-mindful-content">
                        <div className="pp-mindful-header">
                            <Sparkles className="pp-mindful-icon" size={32} />
                            <h2 className="pp-section-title">Your Journey to Higher Alignment</h2>
                            <p className="pp-mindful-subtitle">
                                You become your higher self. This works best when paired with intention—gently, naturally, in your own time.
                            </p>
                            <div className="pp-mindful-tip">
                                <Lightbulb size={20} />
                                <span>Always start with the single dose and increase only if your body feels comfortable.</span>
                            </div>
                        </div>

                        <div className="pp-mindful-grid">
                            <div className="pp-mindful-card">
                                <h3><Sprout size={20} /> How To Use Mindfully</h3>
                                <ul>
                                    <li>Start low, go slow</li>
                                    <li>Use in a calm environment</li>
                                    <li>Avoid mixing with alcohol or stimulants</li>
                                    <li>Stay hydrated</li>
                                    <li>Listen to your body — it always knows</li>
                                    <li>Observe your body</li>
                                    <li>Use consistently, not excessively</li>
                                </ul>
                            </div>

                            <div className="pp-mindful-card intent">
                                <h3><Leaf size={20} /> A Note On Intention</h3>
                                <p>
                                    This is not about escaping reality. It’s about meeting yourself with clarity.
                                    When used with awareness, the plant supports what already exists within you — calm, balance, and presence.
                                </p>
                            </div>
                        </div>
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
                            <div
                                className={`pp-faq-item ${openFaq === i ? 'open' : ''}`}
                                key={i}
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="pp-faq-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ marginBottom: 0 }}>{faq.q}</h3>
                                    <ChevronDown
                                        size={20}
                                        style={{
                                            transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.3s',
                                            color: '#4caf50'
                                        }}
                                    />
                                </div>
                                {openFaq === i && (
                                    <p className="pp-faq-answer" style={{ marginTop: '1rem' }}>{faq.a}</p>
                                )}
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
            {
                !offerExpired && (
                    <div className="pp-sticky-footer">
                        <div className="pp-sticky-timer">
                            <span className="pp-sticky-label" style={{ display: 'block', color: 'white', fontSize: '12px', marginBottom: '4px', textAlign: 'center' }}>Offer Will Expire In</span>
                            <div className="pp-sticky-countdown">
                                <div className="pp-sticky-time-unit">
                                    <span className="pp-sticky-time-value">{Math.floor(timeLeft / 60).toString().padStart(2, '0')}</span>
                                    <span className="pp-sticky-time-label">mins</span>
                                </div>
                                <span className="pp-timer-sep">:</span>
                                <div className="pp-sticky-time-unit">
                                    <span className="pp-sticky-time-value">{(timeLeft % 60).toString().padStart(2, '0')}</span>
                                    <span className="pp-sticky-time-label">secs</span>
                                </div>
                            </div>
                        </div>
                        <button className="pp-sticky-cta" onClick={handleBuyNow}>
                            Claim Now
                        </button>
                    </div>
                )
            }

            {/* Checkout Modal */}
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                userData={userData}
                onProceedToPayment={processPayment}
            />
        </div >
    );
};

export default ProductPage;
