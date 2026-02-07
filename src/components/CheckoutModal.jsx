import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Loader2, X, User, Phone, MapPin, Home, Check, ShieldCheck, Lock, Tag, Mail } from 'lucide-react';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, userData, selectedPack: initialPack, packOptions, onProceedToPayment, offerExpired }) => {
    const [selectedPackId, setSelectedPackId] = useState(initialPack?.id || null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        pincode: '',
        city: '',
        state: '',
        country: 'India',
        address: ''
    });
    const [pincodeLoading, setPincodeLoading] = useState(false);
    const [pincodeError, setPincodeError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [customerId, setCustomerId] = useState(null);

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    // Track modal open/close and time in checkout
    useEffect(() => {
        if (isOpen) {
            import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
                trackEvent(EVENTS.CLICK, 'checkout', 'checkout_opened');
            });
        }
    }, [isOpen]);

    // Autofill from userData
    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                fullName: prev.fullName || userData.name || '',
                phone: prev.phone || userData.phone || ''
            }));
            if (userData.phone) checkCustomer(userData.phone);
        }
    }, [userData]);

    // Check Supabase for existing customer
    const checkCustomer = async (phone) => {
        if (!phone || phone.length < 10) return;
        try {
            const { data, error } = await supabase
                .from('elevate_customers')
                .select('*')
                .eq('phone', phone)
                .maybeSingle();

            if (data) {
                setCustomerId(data.id);
                setFormData(prev => ({
                    ...prev,
                    fullName: data.name || prev.fullName,
                    email: data.email || prev.email,
                    address: data.address || prev.address,
                    city: data.city || prev.city,
                    state: data.state || prev.state,
                    pincode: data.pincode || prev.pincode
                }));
            }
        } catch (err) {
            // No customer found or error - ignore
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        // Client-side check for TEST_BYPASS
        if (couponCode.trim().toUpperCase() === 'TEST_BYPASS') {
            setValidatingCoupon(true);
            // Simulate API delay
            setTimeout(() => {
                const currentPrice = (!offerExpired && initialPack?.discountPrice) ? initialPack.discountPrice : initialPack?.price || 0;
                setDiscountAmount(currentPrice); // 100% discount
                setAppliedCoupon({
                    code: 'TEST_BYPASS',
                    discount_type: 'FIXED',
                    discount_value: currentPrice
                });
                setCouponError('');
                setValidatingCoupon(false);
            }, 500);
            return;
        }

        setValidatingCoupon(true);
        setCouponError('');
        setDiscountAmount(0);
        setAppliedCoupon(null);

        try {
            const { data, error } = await supabase
                .from('elevate_coupons')
                .select('*')
                .eq('code', couponCode.toUpperCase())
                .eq('active', true)
                .single();

            if (error || !data) {
                setCouponError('Invalid or expired coupon code');
                setValidatingCoupon(false);
                return;
            }

            // Check Expiry
            if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
                setCouponError('Coupon has expired');
                setValidatingCoupon(false);
                return;
            }

            // Check Usage Limit
            if (data.usage_limit !== null && data.usage_count >= data.usage_limit) {
                setCouponError('Coupon usage limit reached');
                setValidatingCoupon(false);
                return;
            }

            // Apply Discount
            let discount = 0;
            // Determine base price (discounted or regular)
            const currentPrice = (!offerExpired && initialPack?.discountPrice) ? initialPack.discountPrice : initialPack?.price || 0;

            if (data.discount_type === 'PERCENTAGE') {
                discount = (currentPrice * data.discount_value) / 100;
            } else {
                discount = data.discount_value;
            }

            // Cap discount at total price
            discount = Math.min(discount, currentPrice);

            setDiscountAmount(discount);
            setAppliedCoupon(data);
            setCouponError('');

        } catch (err) {
            console.error(err);
            setCouponError('Error validating coupon');
        } finally {
            setValidatingCoupon(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponCode('');
        setCouponError('');
    };

    // Update selected pack if initialPack changes
    useEffect(() => {
        if (initialPack) {
            setSelectedPackId(initialPack.id);
        }
    }, [initialPack]);

    // Fetch city/state from pincode
    const fetchPincodeDetails = async (pincode) => {
        if (pincode.length !== 6) return;

        setPincodeLoading(true);
        setPincodeError('');

        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();

            if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
                const postOffice = data[0].PostOffice[0];
                setFormData(prev => ({
                    ...prev,
                    city: postOffice.District || postOffice.Block || '',
                    state: postOffice.State || ''
                }));
            } else {
                setPincodeError('Invalid pincode');
                setFormData(prev => ({ ...prev, city: '', state: '' }));
            }
        } catch (error) {
            console.error('Pincode fetch error:', error);
            setPincodeError('Could not fetch details');
        } finally {
            setPincodeLoading(false);
        }
    };

    const handlePincodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setFormData(prev => ({ ...prev, pincode: value }));

        if (value.length === 6) {
            fetchPincodeDetails(value);
        } else {
            setFormData(prev => ({ ...prev, city: '', state: '' }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const numericValue = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, phone: numericValue }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneBlur = () => {
        // Validate phone number length
        if (formData.phone && formData.phone.length > 0 && formData.phone.length !== 10) {
            setPhoneError('Phone number must be exactly 10 digits');
            return;
        }

        // Clear error if valid
        setPhoneError('');

        // Check for existing customer if phone is valid
        if (formData.phone && formData.phone.length === 10) {
            checkCustomer(formData.phone);
        }
    };

    const handleFieldFocus = (fieldName) => {
        import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
            trackEvent(EVENTS.CLICK, 'checkout', `focus_${fieldName}`);
        });
    };

    const isFormValid = () => {
        return formData.fullName &&
            formData.email &&
            formData.phone &&
            formData.phone.length === 10 &&
            formData.pincode.length === 6 &&
            formData.city &&
            formData.state &&
            formData.country &&
            formData.address;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) return;

        setIsSubmitting(true);

        // 1. Upsert Customer to Supabase
        let newCustomerId = customerId;
        try {
            const payload = {
                phone: formData.phone,
                name: formData.fullName,
                email: formData.email, // Use captured email
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode
            };

            const { data, error } = await supabase
                .from('elevate_customers')
                .upsert([payload], { onConflict: 'phone' })
                .select()
                .single();

            if (error) throw error;
            if (data) newCustomerId = data.id;

        } catch (error) {
            console.error('Customer save error:', error);
            // Non-blocking error, allow payment to proceed
        }

        setTimeout(() => {
            setIsSubmitting(false);
            const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country} - ${formData.pincode}`;

            // Proceed directly to payment
            onProceedToPayment({
                ...formData,
                fullAddress,
                selectedPackId: selectedPackId, // Use state variable
                customerId: newCustomerId, // Pass DB ID
                couponCode: appliedCoupon?.code || null,
                discountAmount: discountAmount || 0
            });

            import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
                trackEvent(EVENTS.CLICK, 'checkout', 'form_submitted_pay_now');
            });
        }, 500);
    };

    const handleBack = () => {
        setStep(1);
    }

    const handlePackSelection = (pack) => {
        setSelectedPackId(pack.id);

        // Use timeout to allow UI feedback before triggering payment
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);

            const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country} - ${formData.pincode}`;
            onProceedToPayment({
                ...formData,
                fullAddress,
                selectedPackId: pack.id // Passing this so ProductPage can use it
            });
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <div className="checkout-overlay" onClick={onClose}>
            <div className="checkout-modal" onClick={e => e.stopPropagation()}>

                <div className="checkout-header-nav">
                    <div style={{ width: '36px' }}></div>
                    <button className="checkout-close" onClick={() => onClose()}>
                        <X size={24} />
                    </button>
                </div>

                <div className="checkout-header">
                    <h2>Guest Checkout</h2>
                    <p>Shipping Address • Estimated Delivery: 3-5 Days</p>
                </div>

                <form onSubmit={handleFormSubmit} className="checkout-form">
                    {/* Full Name */}
                    <div className="checkout-field">
                        <label><User size={16} /> Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            onFocus={() => handleFieldFocus('fullName')}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="checkout-field">
                        <label><Phone size={16} /> Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onFocus={() => handleFieldFocus('phone')}
                            onBlur={handlePhoneBlur}
                            placeholder="+91 XXXXXXXXXX"
                            required
                        />
                        {phoneError && <span className="field-error">{phoneError}</span>}
                    </div>

                    {/* Email */}
                    <div className="checkout-field">
                        <label><Mail size={16} /> Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => handleFieldFocus('email')}
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    {/* Pincode & Address */}
                    <div className="checkout-field">
                        <label><MapPin size={16} /> Pincode</label>
                        <div className="pincode-input-wrapper">
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handlePincodeChange}
                                onFocus={() => handleFieldFocus('pincode')}
                                placeholder="6-digit pincode"
                                maxLength={6}
                                required
                            />
                            {pincodeLoading && <Loader2 className="pincode-loader" size={18} />}
                        </div>
                        {pincodeError && <span className="field-error">{pincodeError}</span>}
                    </div>

                    <div className="checkout-field">
                        <label><Home size={16} /> Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            onFocus={() => handleFieldFocus('address')}
                            placeholder="House/Flat No., Street, Landmark"
                            rows={2}
                            required
                        />
                    </div>

                    <div className="checkout-row">
                        <div className="checkout-field">
                            <input type="text" name="city" value={formData.city} readOnly placeholder="City" className="autofilled" />
                        </div>
                        <div className="checkout-field">
                            <input type="text" name="state" value={formData.state} readOnly placeholder="State" className="autofilled" />
                        </div>
                    </div>

                    {/* Coupon Input */}
                    <div className="checkout-field">
                        <label><Tag size={16} /> Coupon Code</label>
                        <div className="flex gap-2" style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                placeholder="Have a coupon?"
                                disabled={!!appliedCoupon}
                                style={{ flex: 1 }}
                            />
                            {!appliedCoupon ? (
                                <button
                                    type="button"
                                    onClick={handleApplyCoupon}
                                    disabled={validatingCoupon || !couponCode}
                                    style={{
                                        background: '#333',
                                        color: '#fff',
                                        border: '1px solid #444',
                                        padding: '0 1rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {validatingCoupon ? <Loader2 className="spin" size={16} /> : 'Apply'}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={removeCoupon}
                                    style={{
                                        background: '#f44336',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '0 1rem',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        {couponError && <span className="field-error" style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{couponError}</span>}
                        {appliedCoupon && <span style={{ color: '#4caf50', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>Coupon applied successfully!</span>}
                    </div>

                    {/* Final Amount Display */}
                    {initialPack && (
                        <div className="checkout-summary" style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}>
                            {/* Coupon/Discount Applied Section */}
                            {!offerExpired && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem',
                                    paddingBottom: '0.5rem',
                                    borderBottom: '1px dashed rgba(255,255,255,0.1)',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4caf50' }}>
                                        <Check size={16} />
                                        {initialPack.id === 1 ? (
                                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Code <b>ELEVATE1000</b> Applied</span>
                                        ) : (
                                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}><b>{initialPack.save}</b> Applied</span>
                                        )}
                                    </div>
                                    <span style={{ color: '#4caf50', fontWeight: '600' }}>
                                        -₹{(initialPack.price - initialPack.discountPrice).toLocaleString()}
                                    </span>
                                </div>
                            )}

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Total Amount ({initialPack.label}):</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>
                                    ₹{(!offerExpired && initialPack.discountPrice) ? initialPack.discountPrice.toLocaleString() : initialPack.price.toLocaleString()}
                                </span>
                            </div>

                            {/* Additional Coupon Discount Display */}
                            {appliedCoupon && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '0.5rem',
                                    paddingTop: '0.5rem',
                                    borderTop: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <span style={{ color: '#4caf50', fontSize: '0.9rem' }}>Extra Discount ({appliedCoupon.code}):</span>
                                    <span style={{ color: '#4caf50', fontWeight: '600' }}>-₹{discountAmount.toLocaleString()}</span>
                                </div>
                            )}

                            {/* Final Total */}
                            {appliedCoupon && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '0.5rem',
                                    paddingTop: '0.5rem',
                                    borderTop: '1px dashed rgba(255,255,255,0.3)'
                                }}>
                                    <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>Final Pay:</span>
                                    <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#4caf50' }}>
                                        ₹{(((!offerExpired && initialPack.discountPrice) ? initialPack.discountPrice : initialPack.price) - discountAmount).toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="checkout-submit"
                        disabled={!isFormValid() || isSubmitting}
                    >
                        {isSubmitting ? <Loader2 className="spin" size={18} /> : 'Proceed to Payment'}
                    </button>

                    <p className="checkout-secure">🔒 Secure info handling</p>

                    {/* Secure Payment Icons */}
                    <div style={{
                        background: '#fff',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        marginTop: '0.5rem',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        <img
                            src="/razorpaySecure.png"
                            alt="100% Secure Payment by Razorpay"
                            style={{ width: '100%', maxWidth: '320px', height: 'auto' }}
                        />
                    </div>

                    {/* Trust Footer - moved here for single step */}
                    <div className="checkout-step-2-footer" style={{ marginTop: '1.5rem' }}>
                        <div className="cs-trust-row">
                            <div className="cs-trust-item">
                                <ShieldCheck size={16} className="cs-icon" />
                                <span>30-Day Guarantee</span>
                            </div>
                            <div className="cs-trust-item">
                                <Lock size={16} className="cs-icon" />
                                <span>Secure Payment</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutModal;
