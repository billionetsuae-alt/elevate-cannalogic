import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { X, Gift, ArrowRight, Check } from 'lucide-react';
import './ExitIntentPopup.css';

const ExitIntentPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, submitting, success

    useEffect(() => {
        // Check local storage to ensure we don't annoy the user
        const hasSeenPopup = localStorage.getItem('cannalogic_exit_intent_seen');
        if (hasSeenPopup) return;

        // Desktop: Exit Intent (Mouse Leave) - only when leaving viewport
        const handleMouseLeave = (e) => {
            // Only trigger if mouse is actually leaving the document (not just moving to top)
            if (e.clientY <= 0 && e.relatedTarget === null) {
                showPopup();
            }
        };

        // Mobile: Timer (30 seconds)
        const timer = setTimeout(() => {
            showPopup();
        }, 30000);

        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            clearTimeout(timer);
        };
    }, []);

    const showPopup = () => {
        const hasSeenPopup = localStorage.getItem('cannalogic_exit_intent_seen');
        if (!hasSeenPopup) {
            setIsVisible(true);
            localStorage.setItem('cannalogic_exit_intent_seen', 'true');
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('submitting');

        setStatus('submitting');

        try {
            // Send to Supabase directly
            const { error } = await supabase.from('elevate_customers').insert([{
                email: email,
                source: 'exit_intent',
                status: 'Lead',
                page_url: window.location.href,
                user_agent: navigator.userAgent
            }]);

            if (error) throw error;

            if (true) { // Success
                setStatus('success');
                // Track event
                import('../utils/tracker').then(({ trackEvent, EVENTS }) =>
                    trackEvent(EVENTS.CLICK, 'lead_capture', 'exit_intent_success')
                );
            } else {
                console.error('Submission failed');
                // Fallback to success UI regardless (don't block user from discount)
                setStatus('success');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            // Fallback to success UI regardless
            setStatus('success');
        }
    };

    if (!isVisible) return null;

    return (
        <div className="exit-popup-overlay">
            <div className="exit-popup-card">
                <button className="exit-popup-close" onClick={handleClose}>
                    <X size={24} />
                </button>

                {status === 'success' ? (
                    <div className="exit-popup-success">
                        <div className="success-icon">
                            <Check size={40} color="#4caf50" />
                        </div>
                        <h3>Welcome to the Family!</h3>
                        <p>Here is your discount code:</p>
                        <div className="code-display">ELEVATE1000</div>
                        <p className="small-print">Use this at checkout for ₹1,000 off your first order.</p>
                        <button className="exit-popup-cta" onClick={handleClose}>
                            Shop Now
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="exit-popup-header">
                            <div className="gift-icon">
                                <Gift size={32} color="#fff" />
                            </div>
                            <h2>Wait! Don't Miss Out</h2>
                            <p>
                                Get <strong>₹1,000 OFF</strong> your first order + our exclusive Wellness Guide when you join our community.
                            </p>
                        </div>

                        <form className="exit-popup-form" onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="exit-popup-input"
                                required
                            />
                            <button
                                type="submit"
                                className="exit-popup-cta"
                                disabled={status === 'submitting'}
                            >
                                {status === 'submitting' ? 'Unlocking...' : 'Unlock My ₹1,000 Discount'}
                                {status !== 'submitting' && <ArrowRight size={18} />}
                            </button>
                        </form>

                        <p className="exit-popup-footer">
                            No spam. Unsubscribe anytime.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ExitIntentPopup;
