import React, { useEffect, useState } from 'react';
import './ProductPage.css';
import './StickyTimer.css';
import CheckoutModal from './CheckoutModal';
import {
    Sparkles, Leaf, ShieldCheck, Award, Heart,
    Check, Star, Users, Package, Eye, Feather,
    Rocket, ArrowRight, Quote, Zap, Brain,
    Gift, Crown, BadgeCheck, Lightbulb, Sprout, ChevronDown
} from 'lucide-react';

const PACK_OPTIONS = [
    { id: 1, label: '1 Pack', price: 3899, save: null, best: false, totalValue: 12500 },
    { id: 2, label: '2 Packs', price: 7018, save: 'Save 10%', best: 'Most Chosen', totalValue: 25000 },
    { id: 3, label: '3 Packs', price: 9358, save: 'Save 20%', best: 'Best Value', totalValue: 37500 }
];

const UNIFIED_PHASE = {
    phase: "Full Spectrum Alignment",
    title: "The Path to Higher Alignment",
    color: "#4caf50", // Growth Green - Universal Healing
    gradient: "linear-gradient(135deg, #4caf50, #009688)",
    meaning: [
        "Quiet the Mental Noise",
        "Restore Emotional Stability",
        "Deepen Your Self-Awareness",
        "Reconnect with Your Inner Flow"
    ],
    support: {
        heading: "A complete holistic shift—calming the noise, stabilizing the emotions, and expanding awareness.",
        points: [
            "Nervous System Regulation",
            "Emotional Grounding & Calm",
            "Enhanced Mental Clarity",
            "Deep Mind-Body Harmony"
        ]
    },
    usage: {
        guide: [
            "Start with intention, not just habit",
            "Best taken in the evening or during overwhelm",
            "Create a calm space — dim lights, silence",
            "Listen to your body — it always knows"
        ]
    },
    dosing: [
        {
            title: "Daily Balance (1 Capsule)",
            bestFor: "Consistent clarity, emotional stability, and daily presence.",
            experience: "A subtle lifting of fog, a gentle sense of calm, and sustained focus.",
            when: "Morning for clarity, or Evening for winding down."
        },
        {
            title: "Deep Restoration (2 Capsules)",
            bestFor: "High-stress days, deep inner work, or somatic release.",
            experience: "Profound grounding, quietened mind, and deep physical relaxation.",
            when: "During intense overwhelm or intentional meditation/rest."
        }
    ],
    reminder: "Healing is not linear. It is a spiral of returning to yourself. Elevate is your anchor in the storm, helping you find your center whenever you drift."
};

const ProductPage = ({ userData, onClose, onPaymentSuccess }) => {
    const {
        name = 'Friend'
    } = userData || {};

    const firstName = name.split(' ')[0];

    // Countdown timer state (1 hour = 3600 seconds)
    const [timeLeft, setTimeLeft] = useState(3600);
    const [offerExpired, setOfferExpired] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [checkoutData, setCheckoutData] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);
    const [activeBenefitIndex, setActiveBenefitIndex] = useState(0);

    // Benefit words for auto-glow animation
    const benefitWords = [
        // Column 1 - Mental
        'Mental Clarity', 'Cognitive Function', 'Focus & Flow', 'Reduced Brain Fog',
        'Sharp Memory', 'Strategic Thinking', 'Intellectual Insight', 'Processing Speed',
        'Mental Resilience', 'Clear Intentions', 'Heightened Perception', 'Thought Organization',
        'Quick Wit', 'Problem Solving', 'Learning Capacity', 'Mindful Awareness',
        // Column 2 - Emotional
        'Inner Peace', 'Emotional Balance', 'Reduced Anxiety', 'Stress Relief',
        'Deep Sleep', 'Nervous System Regulation', 'Mood Elevation', 'Calm Confidence',
        'Emotional Depth', 'Gentle Softening', 'Heart Opening', 'Less Reactivity',
        'Patience', 'Self-Compassion', 'Joyful Presence', 'Serenity',
        // Column 3 - Physical
        'Physical Ease', 'Muscle Relaxation', 'Pain Management', 'Lower Inflammation',
        'Body Awareness', 'Vitality', 'Homeostasis', 'Deep Rest',
        'Immune Support', 'Cellular Repair', 'Better Digestion', 'Energy Flow',
        'Physical Stamina', 'Tension Release', 'Grounding', 'Somatic Healing'
    ];

    // Standardized Common Phase (No dynamic scoring)
    const currentPhase = UNIFIED_PHASE;

    // Product gallery images
    const productImages = [
        { src: '/elevate product image.png', alt: 'Elevate Capsules - Main' },
        { src: '/capsule-2.png', alt: 'Elevate Capsules - Close Up' },
        { src: '/ebook-cover.png', alt: 'Mystery Transformation Ebook' },
        { src: '/ebook-mockup.jpg', alt: 'Ebook Mockup' }
    ];
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedPack, setSelectedPack] = useState(2); // Default to Most Chosen (2 Packs)

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

    // Auto-cycle through benefit words for glow effect
    useEffect(() => {
        const glowTimer = setInterval(() => {
            setActiveBenefitIndex(prev => (prev + 1) % benefitWords.length);
        }, 1500); // Change every 1.5 seconds for slower, more readable effect

        return () => clearInterval(glowTimer);
    }, [benefitWords.length]);

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
            amount: PACK_OPTIONS.find(p => p.id === selectedPack).price * 100, // Amount in paise
            currency: 'INR',
            name: 'CannaLogic',
            description: `Elevate Full Spectrum Bundle - ${PACK_OPTIONS.find(p => p.id === selectedPack).label}`,
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
                state: checkoutFormData.state,
                selected_pack: PACK_OPTIONS.find(p => p.id === selectedPack).label
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
                                address: checkoutFormData.fullAddress,
                                pincode: checkoutFormData.pincode,
                                city: checkoutFormData.city,
                                state: checkoutFormData.state
                            },
                            recordId: userData?.recordId,
                            amount: PACK_OPTIONS.find(p => p.id === selectedPack).price,
                            product: `Elevate Full Spectrum Bundle - ${PACK_OPTIONS.find(p => p.id === selectedPack).label}`,
                            pack_details: PACK_OPTIONS.find(p => p.id === selectedPack)
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
                                <span>{firstName}'s Full Spectrum Alignment</span>
                            </div>
                        </div>

                        <div className="pp-hero-welcome" style={{ color: currentPhase.color, marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                            Prepared for {firstName}
                        </div>


                        <h1 className="pp-hero-title">
                            {currentPhase.title}
                        </h1>

                        <p className="pp-hero-subtitle" style={{ marginTop: '1.5rem', fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', marginInline: 'auto' }}>
                            Your personalized path to finding balance, clarity, and inner peace begins here.
                        </p>
                    </div>
                </div>
            </section>



            {/* Product Showcase */}
            <section className="pp-product-showcase">
                <div className="pp-container">
                    <div className="pp-product-grid">
                        {/* Left: Hero Image + Bundle Items */}
                        <div className="pp-product-gallery">
                            <div className="pp-product-header" style={{ marginBottom: '2rem', textAlign: 'left' }}>
                                <div className="pp-header-top" style={{ justifyContent: 'flex-start' }}>
                                    <span className="pp-badge secondary">Best Value</span>
                                    <div className="pp-rating">
                                        <Star size={16} fill="#ffc107" color="#ffc107" />
                                        <span>4.9 (120+ Reviews)</span>
                                    </div>
                                </div>
                                <h1 className="pp-title">Elevate Full Spectrum Bundle</h1>
                            </div>
                            <div className="pp-hero-image-container">
                                <img
                                    src="/bundle-hero.png"
                                    alt="Elevate Full Spectrum Bundle"
                                    className="pp-main-image single-hero"
                                />
                            </div>

                            {/* Bundle Items - Now in Left Column */}
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
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ textDecoration: 'line-through', color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.9em' }}>₹1,500</span>
                                                <span className="pp-row-price" style={{ color: '#4caf50', fontWeight: 'bold' }}>FREE</span>
                                            </div>
                                        </div>
                                        <p>Unlock hidden potential with daily practices.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Pack Selection + Pricing + CTA */}
                        <div className="pp-product-details">
                            {/* Pack Selection Section */}
                            <div className="pp-pack-selection-container">
                                <div className="pp-section-label" style={{ textAlign: 'center', marginBottom: '1rem', color: '#8bc34a' }}>Choose Your Elevation Path</div>
                                <div className="pp-pack-grid">
                                    {PACK_OPTIONS.map(pack => (
                                        <div
                                            key={pack.id}
                                            className={`pp-pack-card ${selectedPack === pack.id ? 'selected' : ''} ${pack.best ? 'featured' : ''}`}
                                            onClick={() => setSelectedPack(pack.id)}
                                        >
                                            {pack.best && (
                                                <div className="pp-pack-ribbon">
                                                    <span>{pack.best}</span>
                                                </div>
                                            )}
                                            <h4 className="pp-pack-title">{pack.label}</h4>
                                            <div className="pp-pack-price">
                                                <span className="pp-currency">₹</span>
                                                {pack.price.toLocaleString()}
                                            </div>
                                            {pack.save && (
                                                <div className="pp-pack-save">{pack.save}</div>
                                            )}
                                            <button className="pp-pack-select-btn">
                                                {selectedPack === pack.id ? 'Selected' : `Select ${pack.label}`}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total Value & Pricing */}
                            <div className="pp-pricing-card">
                                <div className="pp-value-row">
                                    <span>Total Value</span>
                                    <span className="pp-value-crossed">₹{PACK_OPTIONS.find(p => p.id === selectedPack).totalValue.toLocaleString()}</span>
                                </div>
                                <div className="pp-price-main-row">
                                    <span className="pp-special-label">Special Offer</span>
                                    <div className="pp-final-price">
                                        <span className="pp-currency">₹</span>
                                        {PACK_OPTIONS.find(p => p.id === selectedPack).price.toLocaleString()}
                                    </div>
                                </div>
                                <div className="pp-savings-badge">
                                    You save ₹{(PACK_OPTIONS.find(p => p.id === selectedPack).totalValue - PACK_OPTIONS.find(p => p.id === selectedPack).price).toLocaleString()} ({Math.round(((PACK_OPTIONS.find(p => p.id === selectedPack).totalValue - PACK_OPTIONS.find(p => p.id === selectedPack).price) / PACK_OPTIONS.find(p => p.id === selectedPack).totalValue) * 100)}% OFF)
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

            {/* Analysis Section (Restored & Moved) */}
            <section className="pp-analysis">
                <div className="pp-container">
                    <div className="pp-analysis-content">
                        <span className="pp-section-label" style={{ color: currentPhase.color }}>The Experience</span>
                        <h2 className="pp-analysis-title">What Alignment Means For {firstName}</h2>
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

            {/* Effects Section (New) */}
            <section className="pp-effects-section">
                <div className="pp-container">
                    <div className="pp-section-header">
                        <span className="pp-section-label" style={{ color: currentPhase.color }}>The Transformation</span>
                        <h2 className="pp-section-title">What You Will Feel</h2>
                    </div>
                    <div className="pp-effects-grid">
                        {/* Card 1: Sensory */}
                        <div className="pp-effect-card">
                            <video className="pp-effect-video" autoPlay muted loop playsInline>
                                <source src="/smoke.mp4" type="video/mp4" />
                            </video>
                            <div className="pp-effect-content">
                                <div className="pp-effect-icon-wrapper">
                                    <Eye size={32} />
                                </div>
                                <h3 className="pp-effect-title">Heightened Sensory Awareness</h3>
                                <ul className="pp-effect-list">
                                    <li>Colors appear vibrant, sounds more nuanced.</li>
                                    <li>Helps anchor you in the 'now' for honest mindfulness.</li>
                                    <li>Fosters clarity for deep introspective growth.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Card 2: Physical */}
                        <div className="pp-effect-card">
                            <video className="pp-effect-video" autoPlay muted loop playsInline>
                                <source src="/smoke.mp4" type="video/mp4" />
                            </video>
                            <div className="pp-effect-content">
                                <div className="pp-effect-icon-wrapper">
                                    <Feather size={32} />
                                </div>
                                <h3 className="pp-effect-title">Physical Relaxation & Balance</h3>
                                <ul className="pp-effect-list">
                                    <li>Melts tension, shifting body from effort to ease.</li>
                                    <li>Recalibrates the nervous system to restore balance.</li>
                                    <li>Heightens connection to physical sensations.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Exhibition Scrolling Section */}
            <section className="pp-benefits-exhibition">
                <div className="pp-container">
                    <div className="pp-benefits-card-parent">
                        <div className="pp-benefits-header">
                            <span className="pp-section-label" style={{ color: currentPhase.color }}>Holistic Impact</span>
                            <h2 className="pp-benefits-title">The Benefits Exhibition</h2>
                            <p className="pp-benefits-subtitle">Touch every aspect of your life with Full Spectrum Alignment.</p>
                        </div>

                        <div className="pp-benefits-scroll-window">
                            <div className="pp-benefits-scroll-track">
                                {/* Duplicated Content for Seamless Loop */}
                                {[...Array(2)].map((_, loopIndex) => (
                                    <div key={loopIndex} className="pp-benefits-grid-content">
                                        <div className="pp-benefit-col col-slow">
                                            {benefitWords.slice(0, 16).map((word, idx) => (
                                                <span
                                                    key={idx}
                                                    className={activeBenefitIndex === idx ? 'glow-active' : ''}
                                                >
                                                    {word}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="pp-benefit-col col-medium">
                                            {benefitWords.slice(16, 32).map((word, idx) => (
                                                <span
                                                    key={idx}
                                                    className={activeBenefitIndex === (idx + 16) ? 'glow-active' : ''}
                                                >
                                                    {word}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="pp-benefit-col col-fast">
                                            {benefitWords.slice(32, 48).map((word, idx) => (
                                                <span
                                                    key={idx}
                                                    className={activeBenefitIndex === (idx + 32) ? 'glow-active' : ''}
                                                >
                                                    {word}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Gradient Overlay for Fade Effect */}
                            <div className="pp-benefits-overlay-top"></div>
                            <div className="pp-benefits-overlay-bottom"></div>
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
        </div>
    );
};

export default ProductPage;
