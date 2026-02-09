import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Home, Package, Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '../utils/supabase';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [showContent, setShowContent] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ebookSent, setEbookSent] = useState(true);

    const orderId = searchParams.get('orderId') || 'N/A';
    const email = searchParams.get('email') || '';

    useEffect(() => {
        // Trigger animation after mount
        setTimeout(() => setShowContent(true), 100);

        // Enhanced confetti effect
        if (window.confetti) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min, max) => Math.random() * (max - min) + min;

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                // since particles fall down, start a bit higher than random
                window.confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                window.confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        }

        // Fetch order and customer details
        const fetchOrderDetails = async () => {
            if (orderId && orderId !== 'N/A' && orderId !== 'TEST') {
                try {
                    // Fetch order data
                    const { data: order, error: orderError } = await supabase
                        .from('elevate_orders')
                        .select('*') // Select * to get amount and items
                        .eq('id', orderId)
                        .single();

                    if (order && !orderError) {
                        setOrderData(order);

                        // Always show ebook sent (default)
                        setEbookSent(true);

                        // Fetch customer data
                        if (order.customer_id) {
                            const { data: customer, error: customerError } = await supabase
                                .from('elevate_customers')
                                .select('*')
                                .eq('id', order.customer_id)
                                .single();

                            if (customer && !customerError) {
                                setCustomerData(customer);
                            }
                        }
                    } else {
                        // Attempt to fetch by readable_id if UUID fetch failed
                        const { data: orderReadable, error: orderReadableError } = await supabase
                            .from('elevate_orders')
                            .select('*')
                            .eq('readable_id', orderId)
                            .single();

                        if (orderReadable && !orderReadableError) {
                            setOrderData(orderReadable);
                            setEbookSent(true);
                            if (orderReadable.customer_id) {
                                const { data: customer } = await supabase
                                    .from('elevate_customers')
                                    .select('*')
                                    .eq('id', orderReadable.customer_id)
                                    .single();
                                if (customer) setCustomerData(customer);
                            }
                        }
                    }
                } catch (err) {
                    console.error('Failed to fetch order details:', err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const getProductLabel = () => {
        if (!orderData?.items) return 'Elevate Full Spectrum Bundle';
        const items = orderData.items;
        // Handle if items is a string (JSON) or object
        if (typeof items === 'string') {
            try {
                const parsed = JSON.parse(items);
                return parsed.label || items;
            } catch (e) { return items; }
        }
        return items.label || 'Elevate Full Spectrum Bundle';
    };

    return (
        <div className="success-page">
            <div className={`success-container ${showContent ? 'show' : ''}`}>

                {/* Leaf Image - Prominently Displayed */}
                <div className="success-leaf-container">
                    <img src="/success_leaf_cluster.png" alt="Cannabis Leaf Cluster" className="success-main-leaf" />
                </div>

                {/* Success Icon with Custom SVG Checkmark */}
                <div className="success-icon-wrapper">
                    <div className="success-icon-circle">
                        <svg className="success-icon" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                            <circle className="success-icon-circle-svg" cx="26" cy="26" r="25" fill="none" />
                            <path className="success-icon-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                    </div>
                </div>

                {/* Main Thank You Message */}
                <h1 className="success-title">Thank You, {customerData?.full_name?.split(' ')[0] || 'Friend'}!</h1>
                <p className="success-subtitle" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                    Your payment was successful. Welcome to your transformation journey!
                </p>

                {/* Ebook Section - Only show if ebook was sent */}
                {ebookSent && (
                    <div className="ebook-section">
                        <img src="/ebook.png" alt="Cannabis Transformation Ebook" className="ebook-cover" />
                        <div className="ebook-message">
                            <Mail size={20} className="ebook-icon" />
                            <p>
                                Your <strong>Cannabis Transformation Ebook</strong> has been successfully sent to{' '}
                                <span className="email-highlight">{email}</span>
                            </p>
                        </div>
                    </div>
                )}

                {/* Order Details Card */}
                {!loading && (orderData || customerData) && (
                    <div className="order-details-card">
                        <div className="order-details-header">
                            <Package size={24} />
                            <h3>Order Confirmation</h3>
                        </div>

                        <div className="order-details-body">
                            {/* Product Row */}
                            <div className="detail-item">
                                <span className="detail-icon">🌿</span>
                                <div className="detail-content">
                                    <span className="detail-label">Product</span>
                                    <span className="detail-value">{getProductLabel()}</span>
                                </div>
                            </div>

                            {/* Amount Row */}
                            {orderData.amount !== undefined && (
                                <div className="detail-item">
                                    <span className="detail-icon">₹</span>
                                    <div className="detail-content">
                                        <span className="detail-label">Amount Paid</span>
                                        <span className="detail-value text-xl font-bold text-green-400" style={{ fontSize: '1.25rem', color: '#4caf50' }}>
                                            {formatCurrency(orderData.amount)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="detail-item">
                                <span className="detail-icon">#</span>
                                <div className="detail-content">
                                    <span className="detail-label">Order Number</span>
                                    <span className="detail-value font-mono">
                                        {orderData.readable_id || `#${orderId.slice(0, 8)}`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* What Happens Next Section */}
                <div className="success-steps">
                    <h3>What Happens Next?</h3>
                    <div className="steps-list">
                        <div className="step-item">
                            <div className="step-number">1</div>
                            <span className="step-text">You'll receive an order confirmation email shortly</span>
                        </div>
                        <div className="step-item">
                            <div className="step-number">2</div>
                            <span className="step-text">Our team will reach out within 24 hours to schedule your consultation</span>
                        </div>
                        <div className="step-item">
                            <div className="step-number">3</div>
                            <span className="step-text">Your Elevate Bundle will be shipped within 2-3 business days</span>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="success-actions">
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/')}
                    >
                        <Home size={20} />
                        Back to Home
                    </button>
                </div>

                {/* Support Message */}
                <p className="support-message">
                    Need help? Contact us at<br />
                    <a href="mailto:hello@cannalogic.in" style={{ marginRight: '1rem' }}>hello@cannalogic.in</a>
                    <a href="tel:8431975346">8431975346</a>
                </p>
            </div>
        </div>
    );
};

export default OrderSuccess;



