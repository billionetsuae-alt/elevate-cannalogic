import React, { useEffect, useState } from 'react';
import './ProductPage.css';
import './StickyTimer.css';
import CheckoutModal from './CheckoutModal';
import { Star, Check, Clock, Shield, Award, Leaf, ChevronRight, Package, Info, ArrowRight, Rocket, CreditCard, Lock, Gift, Phone, Mail, ChevronLeft, ChevronDown, ShieldCheck, BadgeCheck, Quote, Zap, Brain, Lightbulb, Sprout, Crown, Sparkles, Pill, ShoppingBag, Stethoscope } from 'lucide-react';
import ExitIntentPopup from './ExitIntentPopup';

const PACK_OPTIONS = [
    { id: 1, label: 'Relief Starter', subLabel: '30 Softgels • 30 Days', price: 3750, save: null, best: false, totalValue: 5000 },
    { id: 2, label: 'Balance Builder', subLabel: '60 Softgels • 60 Days', price: 6750, save: 'Save 10%', best: 'Most Popular', totalValue: 7500 },
    { id: 3, label: 'Complete Wellness Kit', subLabel: '90 Softgels • 90 Days', price: 9000, save: 'Save 20%', best: 'Customers Also Bought', totalValue: 11250 }
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
        { src: '/ebook-cover.jpg', alt: 'Cannabis Transformation Guide' },
        { src: '/ebook-mockup.jpg', alt: 'Ebook Mockup' }
    ];
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedPack, setSelectedPack] = useState(null); // Default to null (no pack selected)
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    // Carousel images
    const carouselImages = [
        { src: '/bundle-hero.png', alt: 'Elevate Full Spectrum Bundle' },
        { src: '/ebook-mockup.jpg', alt: 'Cannabis Transformation Guide' },
        // { src: '/ebook-cover.jpg', alt: 'Ebook Cover' }
    ];

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

    // Scroll Depth Tracking
    useEffect(() => {
        const scrollDepths = { 25: false, 50: false, 75: false, 100: false };

        const handleScroll = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            [25, 50, 75, 100].forEach(depth => {
                if (scrollPercent >= depth && !scrollDepths[depth]) {
                    scrollDepths[depth] = true;
                    import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
                        trackEvent(EVENTS.CLICK, 'product', `scroll_${depth}_percent`);
                    });
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Section Visibility Tracking using Intersection Observer
    useEffect(() => {
        const sections = [
            { id: 'pp-ingredients', name: 'trust_badges_section' },
            { id: 'pp-benefits-exhibition', name: 'benefits_section' },
            { id: 'pp-testimonials', name: 'testimonials_section' }
        ];

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const section = sections.find(s => entry.target.classList.contains(s.id));
                        if (section) {
                            import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
                                trackEvent(EVENTS.CLICK, 'product', `viewed_${section.name}`);
                            });
                            observer.unobserve(entry.target);
                        }
                    }
                }
                );
            },
            { threshold: 0.5 }
        );

        sections.forEach(section => {
            const element = document.querySelector(`.${section.id}`);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    // Timer Awareness Tracking
    useEffect(() => {
        if (!offerExpired) {
            import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
                trackEvent(EVENTS.CLICK, 'product', 'viewed_with_active_timer');
            });
        }
    }, [offerExpired]);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Ebook selection state (default true)
    const [isEbookSelected, setIsEbookSelected] = useState(true);
    const [showPackWarning, setShowPackWarning] = useState(false);

    // Auto-cycle through benefit words for glow effect
    useEffect(() => {
        const glowTimer = setInterval(() => {
            setActiveBenefitIndex(prev => (prev + 1) % benefitWords.length);
        }, 1500); // Change every 1.5 seconds for slower, more readable effect

        return () => clearInterval(glowTimer);
    }, [benefitWords.length]);

    // Open checkout modal first, optionally with a specific pack ID
    const handleBuyNow = (packId = null) => {
        // If packId is an event (object), treat it as null
        if (typeof packId === 'object') packId = null;

        // If a specific pack is passed (e.g. from click), use it
        // Otherwise use the state selectedPack
        if (packId && packId !== selectedPack) {
            setSelectedPack(packId);
        }

        setIsCheckoutOpen(true);
    };

    // Process payment after checkout form is filled
    // Process payment after checkout form is filled
    const processPayment = async (checkoutFormData) => {
        // Extract pack selection if provided by modal
        const { selectedPackId, ...userDataRaw } = checkoutFormData;

        // Determine the pack to use: preferring the one from modal, fallback to state
        const packIdToUse = selectedPackId || selectedPack;

        if (!packIdToUse) {
            console.error("No pack selected for payment");
            return;
        }

        setCheckoutData(userDataRaw);
        setIsCheckoutOpen(false);

        // Update state if different, to keep UI in sync
        if (packIdToUse !== selectedPack) {
            setSelectedPack(packIdToUse);
        }

        // Calculate total amount: Pack Price + (Ebook Price if expired and selected)
        const pack = PACK_OPTIONS.find(p => p.id === packIdToUse);
        const packPrice = pack.price;
        const ebookPrice = (offerExpired && isEbookSelected) ? 1500 : 0;
        // Total calculations
        const subtotal = packPrice + ebookPrice;
        const totalAmount = subtotal;

        // 🎯 TRACK PAYMENT ATTEMPT - Update existing record
        try {
            await fetch('https://n8n-642200223.kloudbeansite.com/webhook/update-address', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recordId: userData?.recordId,
                    Payment_Attempted: true,
                    Payment_Attempt_Time: new Date().toISOString(),
                    Payment_Amount_Attempted: totalAmount,
                    Pack_Selected: pack.label,
                    Razorpay_Order_ID: ''
                })
            });
        } catch (error) {
            console.error('Failed to track payment attempt:', error);
        }

        // Configure Razorpay options
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: totalAmount * 100, // Amount in paise
            currency: 'INR',
            name: 'CannaLogic',
            description: `Elevate Full Spectrum Bundle - ${pack.label}${ebookPrice > 0 ? ' + Ebook' : ''}`,
            image: '/Cannalogic-White.svg',
            prefill: {
                name: userDataRaw.fullName || name || '',
                email: userData?.email || '',
                contact: userDataRaw.phone || userData?.phone || ''
            },
            notes: {
                address: userDataRaw.fullAddress,
                pincode: userDataRaw.pincode,
                city: userDataRaw.city,
                state: userDataRaw.state,
                selected_pack: pack.label
            },
            theme: {
                color: '#4caf50'
            },
            handler: async function (response) {
                // Track payment success
                const paymentEndTime = Date.now();
                const timeInModal = paymentModalStartTime ? Math.round((paymentEndTime - paymentModalStartTime) / 1000) : 0;

                import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
                    trackEvent(EVENTS.CLICK, 'payment', 'payment_success', totalAmount);
                    trackEvent(EVENTS.CLICK, 'payment', 'payment_id', response.razorpay_payment_id);
                    if (timeInModal > 0) {
                        trackEvent(EVENTS.CLICK, 'payment', 'time_in_payment_modal', timeInModal);
                    }
                });

                // Try to capture payment method (if available via Razorpay API)
                try {
                    // Note: Payment method details require server-side fetch from Razorpay API
                    // This is a placeholder for client-side tracking
                    import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
                        trackEvent(EVENTS.CLICK, 'payment', 'payment_completed');
                    });
                } catch (e) {
                    // Fail silently
                }
                // Payment successful


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
                                name: userDataRaw.fullName,
                                email: userData?.email,
                                phone: userDataRaw.phone,
                                address: userDataRaw.fullAddress,
                                pincode: userDataRaw.pincode,
                                city: userDataRaw.city,
                                state: userDataRaw.state
                            },
                            recordId: userData?.recordId,
                            amount: totalAmount,
                            product: `Elevate Full Spectrum Bundle - ${pack.label}${ebookPrice > 0 ? ' + Ebook' : ''}`,
                            pack_details: pack
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
                ondismiss: async function () {
                    // Track payment modal dismissed
                    const paymentEndTime = Date.now();
                    const timeInModal = paymentModalStartTime ? Math.round((paymentEndTime - paymentModalStartTime) / 1000) : 0;

                    import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
                        trackEvent(EVENTS.CLICK, 'payment', 'payment_modal_closed');
                        trackEvent(EVENTS.CLICK, 'payment', 'payment_abandoned');
                        if (timeInModal > 0) {
                            trackEvent(EVENTS.CLICK, 'payment', 'time_in_modal_before_abandon', timeInModal);
                        }
                    });
                    if (userData?.recordId) {
                        try {
                            await fetch('https://n8n-642200223.kloudbeansite.com/webhook/update-address', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    recordId: userData.recordId,
                                    Payment_Failure_Reason: 'Payment cancelled by user'
                                })
                            });
                        } catch (error) {
                            console.error('Payment cancellation tracking failed:', error);
                        }
                    }
                }
            }
        };

        // Track payment modal opened and start timer
        let paymentModalStartTime = Date.now();
        import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
            trackEvent(EVENTS.CLICK, 'payment', 'payment_modal_opened', totalAmount);
        });

        // Now open Razorpay
        const razorpay = new window.Razorpay(options);

        // Track Razorpay payment.failed event
        razorpay.on('payment.failed', function (response) {
            import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
                trackEvent(EVENTS.CLICK, 'payment', 'payment_failed');
                trackEvent(EVENTS.CLICK, 'payment', `payment_error_${response.error.code}`);
                trackEvent(EVENTS.CLICK, 'payment', 'payment_failure_reason', response.error.description);
            });

            // Also track via webhook
            if (userData?.recordId) {
                fetch('https://n8n-642200223.kloudbeansite.com/webhook/update-address', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        recordId: userData.recordId,
                        Payment_Failed: true,
                        Payment_Failure_Reason: `${response.error.code}: ${response.error.description}`
                    })
                }).catch(err => console.error('Failed to track payment error:', err));
            }
        });

        razorpay.open();
    };

    return (
        <div className="product-page">
            {/* Animated Background */}
            <div className="pp-bg-glow"></div>
            <div className="pp-bg-pattern"></div>



            {/* Hero Section - Restored with Correct Badge */}
            <section className="pp-hero">
                <div className="pp-container">
                    <div className="pp-hero-content" style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '1rem' }}>
                        {/* Social Proof Pill */}
                        <div className="pp-social-proof-pill" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(255, 255, 255, 0.12)',
                            padding: '8px 16px',
                            borderRadius: '50px',
                            marginBottom: '1.5rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(4px)'
                        }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FFD700" color="#FFD700" />)}
                            </div>
                            <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '0.3px' }}>
                                Rated 4.9/5 by Professionals
                            </span>
                        </div>

                        <h1 className="pp-hero-headline" style={{
                            fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                            fontWeight: '800',
                            lineHeight: '1.2',
                            marginBottom: '1rem',
                            color: '#fff',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                        }}>
                            How to Reduce Daily Stress, Calm Your Mind & Improve Sleep Without Harsh Chemicals
                        </h1>
                        <p className="pp-hero-subhead" style={{
                            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                            color: '#e0e0e0',
                            marginBottom: '1.5rem',
                            lineHeight: '1.6',
                            maxWidth: '800px',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            Even if you've tried everything else — experience the power of <span style={{ color: '#4caf50', fontWeight: 'bold' }}>Natural Hemp + Ayurveda</span> in just a few weeks.
                        </p>

                        {/* Hero CTA - Immediate Action */}
                        <button
                            className="pp-cta-button"
                            onClick={() => {
                                import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                    trackEvent(EVENTS.CLICK, 'product', 'hero_cta_clicked')
                                );
                                handleBuyNow();
                            }}
                            style={{
                                marginTop: '0.5rem',
                                marginBottom: '1.5rem',
                                width: 'auto',
                                padding: '1rem 2.5rem',
                                fontSize: '1.1rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 14px 0 rgba(76, 175, 80, 0.39)'
                            }}
                        >
                            <span>Start Stress Relief Now</span>
                            <ArrowRight size={20} />
                        </button>

                        {/* Trust & Safety Signals */}
                        <div className="pp-hero-trust-row" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                            flexWrap: 'nowrap',
                            opacity: 0.95,
                            padding: '10px',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            maxWidth: '90%',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            {/* AYUSH Badge */}
                            <div className="pp-trust-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '60px' }}>
                                <img src="/ministry-ayush-emblem.png" alt="Ministry of AYUSH" style={{ height: '32px', objectFit: 'contain', filter: 'brightness(0) invert(1) opacity(0.9)' }} />
                                <span style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AYUSH Approved</span>
                            </div>

                            {/* Natural & Safe Badge */}
                            <div className="pp-trust-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '60px' }}>
                                <div style={{ height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Leaf size={24} color="#4caf50" />
                                </div>
                                <span style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>100% Natural</span>
                            </div>

                            {/* Lab Tested */}
                            <div className="pp-trust-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '60px' }}>
                                <div style={{ height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ShieldCheck size={24} color="#4caf50" />
                                </div>
                                <span style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lab Tested</span>
                            </div>

                            {/* Secure Checkout */}
                            <div className="pp-trust-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '60px' }}>
                                <div style={{ height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Lock size={24} color="#4caf50" />
                                </div>
                                <span style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SSL Secure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>





            {/* Product Showcase */}
            <section className="pp-product-showcase">
                <div className="pp-container">
                    <div className="pp-product-grid">
                        {/* Left: Hero Image Carousel */}
                        <div className="pp-product-gallery">
                            <div className="pp-carousel-container"
                                onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
                                onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
                                onTouchEnd={() => {
                                    if (touchStart - touchEnd > 75) {
                                        // Swipe left - next image
                                        setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
                                    }
                                    if (touchStart - touchEnd < -75) {
                                        // Swipe right - previous image
                                        setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
                                    }
                                }}
                            >
                                <img
                                    src={carouselImages[carouselIndex].src}
                                    alt={carouselImages[carouselIndex].alt}
                                    className="pp-main-image single-hero"
                                />

                                {/* Carousel Dots */}
                                <div className="pp-carousel-dots">
                                    {carouselImages.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`pp-carousel-dot ${index === carouselIndex ? 'active' : ''}`}
                                            onClick={() => {
                                                import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                                    trackEvent(EVENTS.CLICK, 'product', `carousel_dot_${index + 1}`)
                                                );
                                                setCarouselIndex(index);
                                            }}
                                            aria-label={`Go to image ${index + 1}`}
                                        />
                                    ))}
                                </div>

                                {/* Navigation Arrows for Desktop */}
                                {carouselImages.length > 1 && (
                                    <>
                                        <button
                                            className="pp-carousel-arrow pp-carousel-arrow-left"
                                            onClick={() => {
                                                import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                                    trackEvent(EVENTS.CLICK, 'product', 'carousel_prev')
                                                );
                                                setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
                                            }}
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft size={28} />
                                        </button>
                                        <button
                                            className="pp-carousel-arrow pp-carousel-arrow-right"
                                            onClick={() => {
                                                import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                                    trackEvent(EVENTS.CLICK, 'product', 'carousel_next')
                                                );
                                                setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
                                            }}
                                            aria-label="Next image"
                                        >
                                            <ChevronRight size={28} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right: Pack Selection + Pricing + CTA */}
                        <div className="pp-product-details">

                            {/* Why This Works - Outcome Focused Copy */}
                            {/* Why This Works - Outcome Focused Copy */}
                            <div className="pp-why-works-container">
                                <h3 className="pp-why-works-title">Why This Works</h3>
                                <ul className="pp-why-works-list">
                                    {[
                                        "Helps reduce stress and anxiety naturally",
                                        "Supports better sleep quality",
                                        "Helps with pain and inflammation",
                                        "100% natural Ayurvedic + hemp formulation"
                                    ].map((benefit, i) => (
                                        <li key={i} className="pp-why-works-item">
                                            <div className="pp-why-works-icon">
                                                <Check size={14} color="#4caf50" strokeWidth={4} />
                                            </div>
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Pack Selection Section - MOVED TO CHECKOUT */}

                            {/* Bundle Items - Ebook Only */}
                            <div className="pp-bundle-list-detailed" id="offer-bundle" style={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}>
                                <div className="pp-bundle-row-item"
                                    onClick={() => {
                                        if (offerExpired) {
                                            const newState = !isEbookSelected;
                                            import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                                trackEvent(EVENTS.CLICK, 'product', newState ? 'ebook_selected' : 'ebook_deselected')
                                            );
                                            setIsEbookSelected(newState);
                                        }
                                    }}
                                    style={{ cursor: offerExpired ? 'pointer' : 'default', opacity: (offerExpired && !isEbookSelected) ? 0.6 : 1 }}>

                                    {/* Checkbox for expired offer */}
                                    {offerExpired && (
                                        <div style={{
                                            marginRight: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '4px',
                                            border: isEbookSelected ? 'none' : '2px solid rgba(255,255,255,0.3)',
                                            background: isEbookSelected ? '#4caf50' : 'transparent',
                                            transition: 'all 0.2s'
                                        }}>
                                            {isEbookSelected && <Check size={16} color="white" />}
                                        </div>
                                    )}

                                    <div className="pp-bundle-thumb">
                                        <img
                                            src="/ebook-cover.jpg"
                                            alt="Ebook"
                                            loading="lazy"
                                            decoding="async"
                                            width="60"
                                            height="80"
                                        />
                                    </div>
                                    <div className="pp-bundle-content">
                                        <div className="pp-bundle-row-header">
                                            <h4>Cannabis Transformation Guide</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {!offerExpired ? (
                                                    <>
                                                        <span style={{ textDecoration: 'line-through', color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.9em' }}>₹1,500</span>
                                                        <span className="pp-row-price" style={{ color: '#4caf50', fontWeight: 'bold' }}>FREE</span>
                                                    </>
                                                ) : (
                                                    <span className="pp-row-price" style={{ color: 'white', fontWeight: 'bold' }}>₹1,500</span>
                                                )}
                                            </div>
                                        </div>
                                        <p>Unlock hidden potential with daily practices.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Total Value & Pricing */}
                            {/* Total Value & Pricing - REMOVED -> Direct Checkout */}
                            {/* <div className="pp-pricing-card">
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
                            </div> */}



                            <button className="pp-cta-button" onClick={() => {
                                import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                    trackEvent(EVENTS.CLICK, 'product', 'buy_now_main')
                                );
                                handleBuyNow();
                            }} style={{ marginTop: '0.75rem' }}>
                                <ShoppingBag size={22} />
                                <span style={{ fontWeight: '700' }}>Get My Elevate Capsules Today</span>
                                {!offerExpired && <ArrowRight size={20} />}
                            </button>

                            {/* Risk-Free Guarantee */}
                            <div className="pp-guarantee-card" style={{
                                marginTop: '1.5rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '12px',
                                padding: '1.25rem',
                                display: 'flex',
                                gap: '16px',
                                alignItems: 'center',
                                border: '1px dashed rgba(76, 175, 80, 0.4)'
                            }}>
                                <div style={{ background: 'rgba(76, 175, 80, 0.2)', borderRadius: '50%', padding: '10px', flexShrink: 0 }}>
                                    <ShieldCheck size={28} color="#4caf50" />
                                </div>
                                <div>
                                    <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '4px', fontWeight: '600' }}>7-Day Risk-Free Guarantee</h4>
                                    <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.4', margin: 0 }}>
                                        Try Elevate for 7 days. If you don’t feel calmer or sleep better, we offer a full refund.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* What's Inside */}
            < section className="pp-ingredients" >
                <div className="pp-container">
                    <div className="pp-section-header light">
                        <span className="pp-section-label">Premium Quality</span>
                        <h2 className="pp-section-title">What's Inside Each Capsule</h2>
                    </div>

                    <div className="pp-ingredients-grid">
                        {[
                            { title: "Cannabis Extract", desc: "High quality, Full Spectrum Compounds", img: "/ingredient-cannabis.png" },
                            { title: "Virgin Coconut Oil", desc: "For optimal absorption & purity", img: "/ingredient-coconut.png" }
                        ].map((item, i) => (
                            <div className="pp-ingredient-item" key={i}>
                                <div className="pp-ingredient-image-container">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="pp-ingredient-img"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                                <div className="pp-ingredient-content">
                                    <strong>{item.title}</strong>
                                    <span>{item.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pp-cert-grid">
                        <div className="pp-cert-card">
                            <div className="pp-cert-icon-circle">
                                <Stethoscope size={28} />
                            </div>
                            <h4 className="pp-cert-title">Doctor Dispensed</h4>
                            <p className="pp-cert-sub">Prescribed by certified Ayurvedic practitioners only.</p>
                        </div>
                        <div className="pp-cert-card">
                            <div className="pp-cert-icon-circle" style={{ background: 'transparent', border: 'none' }}>
                                <img
                                    src="/ministry-ayush-emblem.png"
                                    alt="Ministry of AYUSH"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <h4 className="pp-cert-title">Ministry Approved</h4>
                            <p className="pp-cert-sub">Fully compliant with AYUSH regulations and Indian law.</p>
                        </div>
                        <div className="pp-cert-card">
                            <div className="pp-cert-icon-circle">
                                <ShieldCheck size={28} />
                            </div>
                            <h4 className="pp-cert-title">100% Safe</h4>
                            <p className="pp-cert-sub">Pure, full-spectrum extract. Non-dependency forming.</p>
                        </div>
                    </div>
                </div>
            </section >


            {/* Choosing Your Support Level - Redesigned */}
            <section className="pp-usage-section">
                <div className="pp-container">
                    <div className="pp-section-header">
                        <h2 className="pp-section-title">Dosage Options</h2>
                    </div>

                    <div className="pp-dosing-redesign-grid">
                        {/* Single Dose Option */}
                        <div className="pp-dosing-option-card" onClick={() => {
                            import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                trackEvent(EVENTS.CLICK, 'product', 'dosage_single_clicked')
                            );
                        }} style={{ cursor: 'pointer' }}>
                            <div className="pp-dosing-icon-wrapper">
                                <Pill size={32} className="pp-pill-icon" />
                            </div>
                            <div className="pp-dosing-content">
                                <h3>Single Dose</h3>
                                <p className="pp-dosing-desc">1 Softgel • Subtle Effects</p>
                            </div>
                        </div>

                        {/* Double Dose Option */}
                        <div className="pp-dosing-option-card" onClick={() => {
                            import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                trackEvent(EVENTS.CLICK, 'product', 'dosage_double_clicked')
                            );
                        }} style={{ cursor: 'pointer' }}>
                            <div className="pp-dosing-icon-wrapper double">
                                <Pill size={32} className="pp-pill-icon" />
                                <Pill size={32} className="pp-pill-icon" />
                            </div>
                            <div className="pp-dosing-content">
                                <h3>Double Dose</h3>
                                <p className="pp-dosing-desc">2 Softgels • Deep Effects</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Exhibition Scrolling Section */}
            < section className="pp-benefits-exhibition" style={{ paddingTop: '1rem' }}>
                <div className="pp-container">
                    <div className="pp-benefits-card-parent">
                        <div className="pp-benefits-header">
                            <span className="pp-section-label" style={{ color: currentPhase.color }}>Holistic Impact</span>
                            <h2 className="pp-benefits-title">Potential Outcomes</h2>
                            <p className="pp-benefits-subtitle">When used with intention and guidance</p>
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
                                                    className="glow-active"
                                                >
                                                    {word}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="pp-benefit-col col-medium">
                                            {benefitWords.slice(16, 32).map((word, idx) => (
                                                <span
                                                    key={idx}
                                                    className="glow-active"
                                                >
                                                    {word}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="pp-benefit-col col-fast">
                                            {benefitWords.slice(32, 48).map((word, idx) => (
                                                <span
                                                    key={idx}
                                                    className="glow-active"
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
            </section >



            {/* Brand Story Section */}
            <section className="pp-brand-story" style={{ padding: '4rem 1rem', background: '#0a0a0a', textAlign: 'center' }}>
                <div className="pp-container">
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(76, 175, 80, 0.1)', marginBottom: '1.5rem' }}>
                        <Leaf size={32} color="#4caf50" />
                    </div>
                    <h2 className="pp-section-title" style={{ marginBottom: '1rem' }}>The Cannalogic Philosophy</h2>
                    <p style={{ maxWidth: '700px', margin: '0 auto 2rem', fontSize: '1.1rem', color: '#ccc', lineHeight: '1.6' }}>
                        We believe true healing comes from the union of <span style={{ color: '#fff', fontWeight: 'bold' }}>Ancient Ayurvedic Wisdom</span> and <span style={{ color: '#fff', fontWeight: 'bold' }}>Modern Scientific Precision</span>.
                    </p>

                    <div className="pp-story-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                        <div className="pp-story-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>Sacred Ingredients</h3>
                            <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                We source only the purest Vijaya (Medical Cannabis) from government-authorized cultivators. Every leaf is selected for its potency and purity.
                            </p>
                        </div>
                        <div className="pp-story-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>Science-Backed</h3>
                            <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                We don't just rely on tradition. Our full-spectrum formulations are lab-tested to ensure exact cannabinoid profiles for consistent, safe results.
                            </p>
                        </div>
                        <div className="pp-story-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>Holistic Balance</h3>
                            <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                Elevate isn't just about symptoms. It's about restoring Homeostasis—your body's natural state of balance—so you heal from within.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mindful Use Section (Final Message) */}
            < section className="pp-mindful" >
                <div className="pp-container">
                    <div className="pp-mindful-content">
                        <div className="pp-mindful-header">
                            <Sparkles className="pp-mindful-icon" size={32} />
                            <h2 className="pp-section-title">Your Journey to Higher Alignment</h2>
                            <p className="pp-mindful-subtitle">
                                You become your higher self. This works best when paired with <b>intention</b> —gently, naturally, in your own time.
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
                                    <li>Set an intention</li>
                                    <li>Use in a calm environment</li>
                                    <li>Avoid Smoking or Drinking Alcohol</li>
                                    <li>Stay hydrated</li>
                                    <li>Engage in Calming Activities like Nature walk, Music or Socializing</li>
                                    <li>Listen to your Soul</li>
                                    <li>Use consistently, not excessively</li>
                                </ul>
                            </div>

                            <div className="pp-mindful-card intent">
                                <h3><Leaf size={20} /> A Note On Intention</h3>
                                <p>
                                    Cannabis, when approached consciously, can become more than a substance — it can be a mirror for self-reflection and inner growth. The key is intention.
                                    <br /><br />
                                    Before engaging, pause and ask yourself:
                                    <br />
                                    <b>Why am I doing this? What am I seeking to understand, heal, or release?</b>
                                    <br /><br />
                                    Intention shapes experience. When used mindlessly, it becomes escape. When used mindfully, it becomes exploration.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Testimonials */}
            < section className="pp-testimonials" >
                <div className="pp-container">
                    <div className="pp-section-header">
                        <span className="pp-section-label">Real Stories</span>
                        <h2 className="pp-section-title">What Our Community Says</h2>
                    </div>

                    <div className="pp-testimonials-grid">
                        {[
                            {
                                name: "Rajiv K.",
                                role: "IT Director",
                                location: "Bangalore",
                                text: "\"I was skeptical but desperate. Within 10 days, I stopped taking painkillers completely. My team has commented on my improved mood and decisiveness in meetings.\"",
                                verified: true
                            },
                            {
                                name: "Priya M.",
                                role: "Marketing Executive",
                                location: "Mumbai",
                                text: "\"I was taking 4-5 painkillers daily and sleeping 4-5 hours. Within two weeks of using Cannalogic, I'm sleeping 7+ hours and handling stressful situations with unexpected calm.\"",
                                verified: true
                            },
                            {
                                name: "Vikram S.",
                                role: "Senior Manager",
                                location: "Gurgaon",
                                text: "\"My wife used to say she felt like a single parent. After two weeks on Cannalogic, she told me 'I feel like I got my husband back.' That's worth more than any promotion.\"",
                                verified: true
                            }
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
            </section >

            {/* FAQ */}
            < section className="pp-faq" >
                <div className="pp-container">
                    <div className="pp-section-header">
                        <span className="pp-section-label">Common Questions</span>
                        <h2 className="pp-section-title">Frequently Asked Questions</h2>
                    </div>

                    <div className="pp-faq-grid">
                        {[
                            {
                                q: "Is this legal and safe?",
                                a: "Yes, 100%. Cannalogic Elevate is approved by the Ministry of AYUSH and is fully compliant with Indian laws regarding medical cannabis (Vijaya). It is non-habit forming and safe for long-term use."
                            },
                            {
                                q: "How quickly will I see results?",
                                a: "Most users experience a sense of calm within 45-60 minutes of their first dose. For sleep issues, we recommend taking it 1 hour before bed. Deep, long-term balance typically builds over 3-5 days of consistent use."
                            },
                            {
                                q: "Will I get 'high' or have side effects?",
                                a: "No, you will not get 'high'. Our full-spectrum formula is balanced to provide therapeutic relief without intoxication. Mild drowsiness may occur initially, which is why we suggest starting with the evening dose."
                            },
                            {
                                q: "How do I use it?",
                                a: "Take 1 softgel daily, preferably after dinner or 1 hour before sleep. Swallow whole with water. You can increase to 2 softgels if needed, but we recommend starting with 1 to let your body adjust."
                            },
                            {
                                q: "Is it AYUSH certified?",
                                a: "Yes, our formulation is strictly regulated and approved by the Ministry of AYUSH. Every batch is lab-tested for purity, safety, and consistent potency."
                            }
                        ].map((faq, i) => (
                            <div
                                className={`pp-faq-item ${openFaq === i ? 'open' : ''}`}
                                key={i}
                                onClick={() => {
                                    const isOpening = openFaq !== i;
                                    if (isOpening) {
                                        import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                            trackEvent(EVENTS.CLICK, 'product', `faq_${i + 1}_opened`)
                                        );
                                    }
                                    setOpenFaq(openFaq === i ? null : i);
                                }}
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
            </section >

            {/* Footer */}
            < footer className="pp-footer" >
                <div className="pp-container">
                    <div className="pp-footer-content">
                        <div className="pp-footer-logo">
                            <img
                                src="/Cannalogic-White.svg"
                                alt="CannaLogic"
                                className="pp-footer-logo-img"
                                loading="lazy"
                            />
                        </div>
                        <p className="pp-footer-copy">© 2024 CannaLogic. All rights reserved.</p>
                    </div>
                    <p className="pp-disclaimer">
                        *These statements have not been evaluated by any regulatory authority.
                        This product is not intended to diagnose, treat, cure, or prevent any disease.
                        Please consult your healthcare provider before use.
                    </p>
                </div>
            </footer >

            {/* Sticky Footer Timer */}
            {
                !offerExpired && (
                    <div className="pp-sticky-footer">
                        <div className="pp-sticky-timer">
                            <span className="pp-sticky-label" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginRight: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Offer Ends in:</span>
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
                        <button className="pp-sticky-cta" onClick={() => {
                            import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                trackEvent(EVENTS.CLICK, 'product', 'claim_now_floating')
                            );
                            handleBuyNow();
                        }}>
                            BUY NOW
                        </button>
                    </div>
                )
            }

            {/* Checkout Modal */}
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                userData={userData}
                selectedPack={selectedPack ? PACK_OPTIONS.find(p => p.id === selectedPack) : null}
                packOptions={PACK_OPTIONS}
                onProceedToPayment={processPayment}
            />
            <ExitIntentPopup />
        </div >
    );
};

export default ProductPage;
