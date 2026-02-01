import React, { useEffect, useState } from 'react';
import './ProductPage.css';
import './Hero.css'; // Imported for Hero styles
import './StickyTimer.css';
import CheckoutModal from './CheckoutModal';
import ExitIntentPopup from './ExitIntentPopup';
import HempParticles from './HempParticles';
import OfferMarquee from './OfferMarquee';
import VideoSection from './VideoSection';
import { Star, Check, Clock, Shield, Award, Leaf, ChevronRight, Package, Info, ArrowRight, Rocket, CreditCard, Lock, Gift, Phone, Mail, ChevronLeft, ChevronDown, ShieldCheck, BadgeCheck, Quote, Zap, Brain, Lightbulb, Sprout, Crown, Sparkles, Pill, ShoppingBag, Stethoscope } from 'lucide-react';

const PACK_OPTIONS = [
    { id: 1, label: '1 Pack', subLabel: '30 Softgels • 30 Days', price: 4750, discountPrice: 3750, save: null, best: false, totalValue: 5000 },
    { id: 2, label: '2 Packs', subLabel: '60 Softgels • 60 Days', price: 9500, discountPrice: 6750, save: 'Save 29%', best: 'Most Chosen', totalValue: 10000 },
    { id: 3, label: '3 Packs', subLabel: '90 Softgels • 90 Days', price: 14250, discountPrice: 9000, save: 'Save 37%', best: 'Best Value', totalValue: 15000 }
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
        name
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
        const packToBuy = packId || selectedPack;

        if (!packToBuy) {
            setShowPackWarning(true);
            const packSection = document.getElementById('pack-selection');
            if (packSection) {
                packSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Hide warning if selection is made
        setShowPackWarning(false);

        // Ensure state is synced if we passed a direct ID (case: click on unselected pack)
        if (packId && packId !== selectedPack) {
            setSelectedPack(packId);
        }

        setIsCheckoutOpen(true);
    };

    // Process payment after checkout form is filled
    const processPayment = async (checkoutFormData) => {
        setCheckoutData(checkoutFormData);
        setIsCheckoutOpen(false);

        // Calculate total amount: Check for discount
        const selectedPackObj = PACK_OPTIONS.find(p => p.id === selectedPack);
        // Use discountPrice if offer is NOT expired, otherwise regular price
        const packPrice = (!offerExpired && selectedPackObj.discountPrice) ? selectedPackObj.discountPrice : selectedPackObj.price;
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
                    Pack_Selected: PACK_OPTIONS.find(p => p.id === selectedPack).label,
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
            description: `Elevate Full Spectrum Bundle - ${PACK_OPTIONS.find(p => p.id === selectedPack).label}${ebookPrice > 0 ? ' + Ebook' : ''}`,
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
                                name: checkoutFormData.fullName,
                                email: userData?.email,
                                phone: checkoutFormData.phone,
                                address: checkoutFormData.fullAddress,
                                pincode: checkoutFormData.pincode,
                                city: checkoutFormData.city,
                                state: checkoutFormData.state
                            },
                            recordId: userData?.recordId,
                            amount: totalAmount,
                            product: `Elevate Full Spectrum Bundle - ${PACK_OPTIONS.find(p => p.id === selectedPack).label}${ebookPrice > 0 ? ' + Ebook' : ''}`,
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



            {/* Hero Section - Replaced with Home Page Hero Layout */}
            <section className="hero">
                <div className="hero-container container">
                    <div className="hero-card">
                        <div className="hero-bg">
                            <HempParticles />
                            <div className="hero-overlay"></div>
                        </div>

                        <div className="badge-wrapper">
                            <div className="badge">
                                MINISTRY OF AYUSH APPROVED
                            </div>
                        </div>

                        <div className="hero-content">
                            <img src="/Cannalogic-White.svg" alt="Cannalogic Logo" className="hero-logo" />

                            <div className="content-inner">
                                <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>
                                    How to achieve <span style={{ color: '#8bc34a', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em' }}>deep inner calm</span> & <span style={{ color: '#8bc34a', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em' }}>higher awareness</span> without meditation retreats or life-long practice<br />— even while living a <span style={{ color: '#ef5350', borderBottom: '2px solid #ef5350', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em' }}>busy modern life</span>
                                </h1>

                                <p className="hero-subtitle">
                                    The Ancient Medicine They Tried to Hide from You. For centuries this sacred plant awakened seekers and threatened the systems that control you.
                                </p>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    padding: '0.8rem 1.5rem',
                                    marginBottom: '2rem',
                                    marginTop: '1rem',
                                    gap: '1rem',
                                    width: '100%',
                                    maxWidth: '500px',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}>
                                    <img
                                        src="/thambi.png"
                                        alt="Thampi Nagarjuna"
                                        style={{
                                            width: '70px',
                                            height: '70px',
                                            borderRadius: '50%',
                                            border: '2px solid rgba(139, 195, 74, 0.5)',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: 'rgba(255, 255, 255, 0.6)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            marginBottom: '0.2rem'
                                        }}>
                                            Promoted by
                                        </div>
                                        <div style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '700',
                                            color: 'white',
                                            lineHeight: '1.2'
                                        }}>
                                            Thampi Nagarjuna
                                        </div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#8bc34a',
                                            marginTop: '0.2rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.3rem'
                                        }}>
                                            <BadgeCheck size={14} /> FSSAI Licensed • Kerala
                                        </div>
                                    </div>
                                </div>

                                <div className="hero-stats">
                                    <div className="stat-item">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                            <path d="M9 12l2 2 4-4" />
                                        </svg>
                                        <span>100% Legal</span>
                                    </div>
                                    <div className="stat-item">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.648 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
                                            <circle cx="7.5" cy="11.5" r="1.5" />
                                            <circle cx="12" cy="7.5" r="1.5" />
                                            <circle cx="16.5" cy="11.5" r="1.5" />
                                        </svg>
                                        <span>Ayurvedic</span>
                                    </div>
                                    <div className="stat-item">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                        </svg>
                                        <span>Doctor Prescribed</span>
                                    </div>
                                </div>



                                <div className="hero-actions">
                                    <button onClick={() => {
                                        import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                            trackEvent(EVENTS.CLICK, 'product', 'hero_buy_now')
                                        );
                                        handleBuyNow();
                                    }} className="btn btn-primary">
                                        Start Stress Relief Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Offer Marquee */}
            <OfferMarquee />





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
                            {/* Pack Selection Section - MOVED TO TOP */}
                            <div id="pack-selection" className="pp-pack-selection-container" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                                <div className="pp-section-label" style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#8bc34a', width: '100%', display: 'block' }}>Choose Your Elevation Path</div>
                                {showPackWarning && (
                                    <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                                        ⚠ Please select a pack to proceed
                                    </div>
                                )}
                                <div className="pp-pack-grid" style={{ justifyContent: 'center', marginTop: '0' }}>
                                    {PACK_OPTIONS.map(pack => (
                                        <div
                                            key={pack.id}
                                            className={`pp-pack-card ${selectedPack === pack.id ? 'selected' : ''} ${pack.best ? 'featured' : ''}`}
                                            onClick={() => {
                                                import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                                    trackEvent(EVENTS.CLICK, 'product', `select_${pack.id}_pack`)
                                                );
                                                handleBuyNow(pack.id);
                                            }}
                                        >
                                            {pack.best && (
                                                <div className="pp-pack-ribbon">
                                                    <span>{pack.best}</span>
                                                </div>
                                            )}
                                            <h4 className="pp-pack-title">{pack.label}</h4>
                                            {/* Sub-label for 1 Pack (and others if needed) */}
                                            {pack.subLabel && (
                                                <div className="pp-pack-sublabel">{pack.subLabel}</div>
                                            )}
                                            <div className="pp-pack-price">
                                                <span className="pp-currency">₹</span>
                                                {offerExpired ? pack.price.toLocaleString() : pack.discountPrice.toLocaleString()}
                                            </div>
                                            {/* Show Strike-through original price for all packs when offer active */}
                                            {!offerExpired && (
                                                <div style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginTop: '-0.25rem' }}>
                                                    ₹{pack.price.toLocaleString()}
                                                </div>
                                            )}

                                            {/* Show save amount for all packs */}
                                            {!offerExpired && (
                                                <div className="pp-pack-save" style={{ color: '#ffeb3b', fontWeight: 'bold' }}>
                                                    Save ₹{(pack.price - pack.discountPrice).toLocaleString()}
                                                </div>
                                            )}
                                            {offerExpired && pack.save && (
                                                <div className="pp-pack-save">{pack.save}</div>
                                            )}

                                            <button
                                                className="pp-pack-select-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                                                        trackEvent(EVENTS.CLICK, 'product', `pack_${pack.id}_button`)
                                                    );
                                                    handleBuyNow(pack.id); // Direct checkout
                                                }}
                                            >
                                                {`Select ${pack.label}`}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

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
                                        <img src="/ebook-cover.jpg" alt="Ebook" />
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
                                <span>{offerExpired ? 'Buy Now' : 'Buy Now'}</span>
                                {!offerExpired && <ArrowRight size={20} />}
                            </button>

                            {/* Secure Payment Badge */}
                            <div style={{
                                marginTop: '0.75rem',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <img
                                    src="/razorpaySecure.png"
                                    alt="100% Secure Payment by Razorpay"
                                    style={{
                                        maxWidth: '200px',
                                        height: 'auto',
                                        opacity: 0.9,
                                        borderRadius: '4px'
                                    }}
                                />
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
                                    <img src={item.img} alt={item.title} className="pp-ingredient-img" />
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
                                <img src="/ministry-ayush-emblem.png" alt="Ministry of AYUSH" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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



            {/* Mindful Use Section (Final Message) */}
            <section className="pp-mindful">
                <div className="pp-container">
                    <div className="pp-mindful-content">
                        <div className="pp-mindful-header">
                            <Sparkles className="pp-mindful-icon" size={32} />
                            <h2 className="pp-section-title">Your Journey to Higher Alignment</h2>
                            <p className="pp-mindful-subtitle">
                                You become your higher self. This works best when paired with <b>intention</b> —gently, naturally, in your own time.
                            </p>

                            {/* Vibrational Energy Chart */}
                            <div className="pp-vibrational-chart" style={{ marginBottom: '2rem', marginTop: '1.5rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <img
                                    src="/vibrational-energy-chart.png"
                                    alt="Vibrational Energy Chart"
                                    style={{
                                        width: '100%',
                                        maxWidth: '600px',
                                        height: 'auto',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                    loading="lazy"
                                />
                            </div>

                            <div className="pp-mindful-tip">
                                <Lightbulb size={20} />
                                <span>Always start with the single dose and increase only if your body feels comfortable.</span>
                            </div>
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

            {/* Video Section */}
            <VideoSection pageName="product" />

            {/* FAQ */}
            <section className="pp-faq">
                <div className="pp-container">
                    <div className="pp-section-header">
                        <span className="pp-section-label">Common Questions</span>
                        <h2 className="pp-section-title">Frequently Asked Questions</h2>
                    </div>

                    <div className="pp-faq-grid">
                        {[
                            { q: "What is Full Spectrum Cannabis Oil?", a: "It represents the complete extraction of the plant, preserving CBD, THC, and minor cannabinoids to create the \"Entourage Effect\" for maximum therapeutic potential, unlike isolated compounds." },
                            { q: "Is this product legal in India?", a: "Yes, 100%. Our products are approved by the Ministry of Ayush and compliant with all Government of India regulations for Vijaya (Medical Cannabis) products." },
                            { q: "Will I get \"high\" from using this?", a: "No. Our formulation is chemically balanced to provide therapeutic relief (pain, stress, sleep) without intoxication or psychoactive effects when strictly dosed as prescribed." },
                            { q: "Do I need a prescription?", a: "Yes, a valid prescription is mandatory by law. We provide a complimentary medical consultation with our certified doctors to assess your eligibility and generate a prescription." },
                            { q: "What conditions can this help with?", a: "It is effective for managing chronic pain, stress, anxiety, insomnia, and inflammation. It helps regulate your body's Endocannabinoid System (ECS) for overall balance." },
                            { q: "Are there any side effects?", a: "It is natural and safe. Mild side effects like dry mouth or drowsiness may occur initially as your body adjusts. It is non-addictive and safer than many chemical painkillers." },
                            { q: "How do I take the softgels?", a: "Take 1 softgel daily after dinner or before bed for sleep/recovery. For stress/pain, take as directed by our physician. Swallow whole with water; do not chew." }
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
                            <span className="pp-sticky-label">🔥 Save up to ₹5,250</span>
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
                selectedPack={PACK_OPTIONS.find(p => p.id === selectedPack)}
                onProceedToPayment={processPayment}
                offerExpired={offerExpired}
            />

            {/* Exit Intent Popup */}
            <ExitIntentPopup />
        </div >
    );
};

export default ProductPage;
