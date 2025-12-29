import React from 'react';
import { CheckCircle, ArrowRight, Mail, Phone } from 'lucide-react';
import './ThankYouPage.css';

const ThankYouPage = ({ userData, paymentData, onGoHome }) => {
    const firstName = userData?.name?.split(' ')[0] || 'Friend';

    return (
        <div className="thankyou-page">
            <div className="thankyou-bg-glow"></div>

            <div className="thankyou-container">
                <div className="thankyou-icon">
                    <CheckCircle size={80} />
                </div>

                <h1 className="thankyou-title">
                    Thank You, {firstName}!
                </h1>

                <p className="thankyou-subtitle">
                    Your payment was successful. Welcome to your transformation journey!
                </p>

                <div className="thankyou-order-card">
                    <h3>Order Confirmation</h3>
                    <div className="order-details">
                        <div className="order-row">
                            <span>Product</span>
                            <span>Elevate Full Spectrum Bundle</span>
                        </div>
                        <div className="order-row">
                            <span>Amount Paid</span>
                            <span className="amount">₹3,899</span>
                        </div>
                        {paymentData?.razorpay_payment_id && (
                            <div className="order-row">
                                <span>Payment ID</span>
                                <span className="payment-id">{paymentData.razorpay_payment_id}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="thankyou-next-steps">
                    <h3>What Happens Next?</h3>
                    <ul>
                        <li>
                            <span className="step-number">1</span>
                            <span>You'll receive an order confirmation email shortly</span>
                        </li>
                        <li>
                            <span className="step-number">2</span>
                            <span>Our team will reach out within 24 hours to schedule your consultation</span>
                        </li>
                        <li>
                            <span className="step-number">3</span>
                            <span>Your Elevate Bundle will be shipped within 2-3 business days</span>
                        </li>
                    </ul>
                </div>

                <div className="thankyou-contact">
                    <p>Questions? Reach out to us:</p>
                    <div className="contact-options">
                        <a href="mailto:support@cannalogic.in" className="contact-item">
                            <Mail size={18} />
                            <span>support@cannalogic.in</span>
                        </a>
                        <a href="tel:+918048799897" className="contact-item">
                            <Phone size={18} />
                            <span>+91 80 4879 9897</span>
                        </a>
                    </div>
                </div>

                <button className="thankyou-btn" onClick={onGoHome}>
                    <span>Back to Home</span>
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default ThankYouPage;
