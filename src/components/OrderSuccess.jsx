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
    const [ebookSent, setEbookSent] = useState(false);

    const orderId = searchParams.get('orderId') || 'N/A';
    const email = searchParams.get('email') || '';

    useEffect(() => {
        // Trigger animation after mount
        setTimeout(() => setShowContent(true), 100);

        // Enhanced confetti effect
        if (window.confetti) {
            // Initial burst
            window.confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#4caf50', '#81c784', '#66bb6a']
            });

            // Delayed second burst
            setTimeout(() => {
                window.confetti({
                    particleCount: 100,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                });
                window.confetti({
                    particleCount: 100,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                });
            }, 400);
        }

        // Fetch order and customer details
        const fetchOrderDetails = async () => {
            if (orderId && orderId !== 'N/A' && orderId !== 'TEST') {
                try {
                    // Fetch order data
                    const { data: order, error: orderError } = await supabase
                        .from('elevate_orders')
                        .select('*')
                        .eq('id', orderId)
                        .single();

                    if (order && !orderError) {
                        setOrderData(order);

                        // Determine if ebook was sent based on order metadata
                        // Check if ebook was included (you may need to add this field to orders table)
                        setEbookSent(order.ebook_included || false);

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

    return (
        <div className="success-page">
            {/* Decorative leaf images */}
            <img src="/cannabis-leaf-spiritual.jpg" alt="" className="leaf-decoration leaf-top-left" />
            <img src="/real-glowing-leaf.png" alt="" className="leaf-decoration leaf-bottom-right" />

            <div className={`success-container ${showContent ? 'show' : ''}`}>
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
                <h1 className="success-title">Thank You for Purchasing</h1>
                <h2 className="success-brand">CannaLogic Elevate</h2>

                {/* Ebook Section - Only show if ebook was sent */}
                {ebookSent && (
                    <div className="ebook-section">
                        <div className="ebook-cover-wrapper">
                            <img src="/ebook.png" alt="Cannabis Transformation Ebook" className="ebook-cover" />
                        </div>
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
                            <h3>Order Details</h3>
                        </div>

                        <div className="order-details-body">
                            <div className="detail-item">
                                <span className="detail-icon">#</span>
                                <div className="detail-content">
                                    <span className="detail-label">Order Number</span>
                                    <span className="detail-value">#{orderId}</span>
                                </div>
                            </div>

                            {customerData?.full_name && (
                                <div className="detail-item">
                                    <span className="detail-icon">👤</span>
                                    <div className="detail-content">
                                        <span className="detail-label">Name</span>
                                        <span className="detail-value">{customerData.full_name}</span>
                                    </div>
                                </div>
                            )}

                            {customerData?.address && (
                                <div className="detail-item">
                                    <MapPin size={18} className="detail-icon-svg" />
                                    <div className="detail-content">
                                        <span className="detail-label">Delivery Address</span>
                                        <span className="detail-value">
                                            {customerData.address}
                                            {customerData.city && `, ${customerData.city}`}
                                            {customerData.state && `, ${customerData.state}`}
                                            {customerData.pincode && ` - ${customerData.pincode}`}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {customerData?.phone && (
                                <div className="detail-item">
                                    <Phone size={18} className="detail-icon-svg" />
                                    <div className="detail-content">
                                        <span className="detail-label">Phone Number</span>
                                        <span className="detail-value">{customerData.phone}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Dispatch Message */}
                <div className="dispatch-message">
                    <div className="dispatch-icon">
                        <Package size={28} />
                    </div>
                    <p>Your order will be dispatched within <strong>24 hours</strong></p>
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
                    Need help? Contact us at{' '}
                    <a href="mailto:hello@cannalogic.in">hello@cannalogic.in</a>
                </p>
            </div>
        </div>
    );
};

export default OrderSuccess;

