import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Mail, Package, Home, CreditCard, IndianRupee } from 'lucide-react';
import { supabase } from '../utils/supabase';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [showContent, setShowContent] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);

    const orderId = searchParams.get('orderId') || 'N/A';
    const email = searchParams.get('email') || '';

    useEffect(() => {
        // Trigger animation after mount
        setTimeout(() => setShowContent(true), 100);

        // Confetti effect (optional)
        if (window.confetti) {
            window.confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        // Fetch order details
        const fetchOrderDetails = async () => {
            if (orderId && orderId !== 'N/A') {
                try {
                    const { data, error } = await supabase
                        .from('elevate_orders')
                        .select('*')
                        .eq('id', orderId)
                        .single();

                    if (data && !error) {
                        setOrderData(data);
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

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getPaymentMethod = (paymentId) => {
        if (!paymentId) return 'N/A';
        if (paymentId.startsWith('TEST_BYPASS')) return 'Test Order';
        return 'Online Payment';
    };

    return (
        <div className="success-page">
            <div className={`success-container ${showContent ? 'show' : ''}`}>
                {/* Animated Success Icon */}
                <div className="success-icon-wrapper">
                    <div className="success-icon-circle">
                        <CheckCircle className="success-icon" size={64} />
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="success-title">Order Confirmed!</h1>
                <p className="success-subtitle">
                    Thank you for your purchase. Your order has been successfully placed.
                </p>

                {/* Order Details Card */}
                <div className="success-card">
                    <div className="success-card-header">
                        <Package size={24} />
                        <h2>Order Details</h2>
                    </div>
                    <div className="success-card-body">
                        <div className="detail-row">
                            <span className="detail-label">Order ID:</span>
                            <span className="detail-value">#{orderId}</span>
                        </div>
                        {email && (
                            <div className="detail-row">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{email}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment Details Card */}
                {!loading && orderData && (
                    <div className="success-card">
                        <div className="success-card-header">
                            <CreditCard size={24} />
                            <h2>Payment Details</h2>
                        </div>
                        <div className="success-card-body">
                            <div className="detail-row">
                                <span className="detail-label">Amount Paid:</span>
                                <span className="detail-value payment-amount">
                                    <IndianRupee size={16} />
                                    {formatAmount(orderData.amount || 0)}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Payment Method:</span>
                                <span className="detail-value">{getPaymentMethod(orderData.payment_id)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Payment Status:</span>
                                <span className="detail-value status-paid">
                                    <span className="status-badge">Paid</span>
                                </span>
                            </div>
                            {orderData.payment_id && !orderData.payment_id.startsWith('TEST_BYPASS') && (
                                <div className="detail-row">
                                    <span className="detail-label">Transaction ID:</span>
                                    <span className="detail-value transaction-id">{orderData.payment_id}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Next Steps */}
                <div className="next-steps">
                    <h3>What's Next?</h3>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-icon">
                                <Mail size={28} />
                            </div>
                            <h4>Check Your Email</h4>
                            <p>
                                We've sent your order confirmation and ebook to{' '}
                                <strong>{email || 'your email'}</strong>
                            </p>
                        </div>
                        <div className="step-card">
                            <div className="step-icon">
                                <Package size={28} />
                            </div>
                            <h4>Track Your Order</h4>
                            <p>
                                You'll receive shipping updates via email as your order is processed
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
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
                    Need help? Contact us at{' '}
                    <a href="mailto:hello@cannalogic.in">hello@cannalogic.in</a>
                </p>
            </div>
        </div>
    );
};

export default OrderSuccess;

