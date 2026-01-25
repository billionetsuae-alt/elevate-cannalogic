import React, { useState, useEffect } from 'react';
import { X, MapPin, User, Phone, Home, Loader2, ChevronLeft, Check, ShieldCheck, Lock } from 'lucide-react';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, userData, selectedPack: initialPack, packOptions, onProceedToPayment }) => {
    const [step, setStep] = useState(1);
    const [selectedPackId, setSelectedPackId] = useState(initialPack?.id || null);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        pincode: '',
        city: '',
        state: '',
        country: 'India',
        address: ''
    });
    const [pincodeLoading, setPincodeLoading] = useState(false);
    const [pincodeError, setPincodeError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Track modal open/close and time in checkout
    useEffect(() => {
        if (isOpen) {
            import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
                trackEvent(EVENTS.CLICK, 'checkout', 'checkout_opened');
            });
            setStep(1); // Reset to step 1 on open
        }
    }, [isOpen]);

    // Autofill from userData
    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                fullName: userData.name || '',
                phone: userData.phone || ''
            }));
        }
    }, [userData]);

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
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFieldFocus = (fieldName) => {
        import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
            trackEvent(EVENTS.CLICK, 'checkout', `focus_${fieldName}`);
        });
    };

    const isFormValid = () => {
        return formData.fullName &&
            formData.phone &&
            formData.pincode.length === 6 &&
            formData.city &&
            formData.state &&
            formData.country &&
            formData.address;
    };

    const handleNextStep = async (e) => {
        e.preventDefault();
        if (!isFormValid()) return;

        setIsSubmitting(true);

        // Save address to Airtable via webhook (async but don't block too long)
        try {
            if (userData?.recordId) {
                fetch('https://n8n-642200223.kloudbeansite.com/webhook/update-address', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        recordId: userData.recordId,
                        address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country} - ${formData.pincode}`,
                        pincode: formData.pincode,
                        city: formData.city,
                        state: formData.state
                    })
                });
            }
        } catch (error) {
            console.error('Address save error:', error);
        }

        setTimeout(() => {
            setIsSubmitting(false);
            setStep(2);
            import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
                trackEvent(EVENTS.CLICK, 'checkout', 'step_1_complete');
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

                {/* Header Navigation - Purely for Controls */}
                <div className="checkout-header-nav">
                    {step === 2 ? (
                        <button className="checkout-back" onClick={handleBack}>
                            <ChevronLeft size={24} />
                        </button>
                    ) : (
                        <div style={{ width: '36px' }}></div> /* Spacer for balance */
                    )}

                    <button className="checkout-close" onClick={() => onClose()}>
                        <X size={24} />
                    </button>
                </div>

                {/* Progress Steps - Dedicated Row */}
                <div className="checkout-steps">
                    <div className={`step-dot ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        {step > 1 ? <Check size={16} /> : '1'}
                    </div>
                    <div className={`step-line ${step > 1 ? 'active' : ''}`}></div>
                    <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                </div>

                {step === 1 ? (
                    <>
                        <div className="checkout-header">
                            <h2>Guest Checkout</h2>
                            <p>Shipping Address • Estimated Delivery: 3-5 Days</p>
                        </div>

                        <form onSubmit={handleNextStep} className="checkout-form">
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
                                    placeholder="+91 XXXXXXXXXX"
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

                            <button
                                type="submit"
                                className="checkout-submit"
                                disabled={!isFormValid() || isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="spin" size={18} /> : 'Next: Select Pack'}
                            </button>

                            <p className="checkout-secure">🔒 Secure info handling</p>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="checkout-header">
                            <h2>Select Your Pack</h2>
                            <p>Choose the best plan for your needs</p>
                        </div>

                        <div className="checkout-packs-list">
                            {packOptions?.map(pack => (
                                <div
                                    key={pack.id}
                                    className={`checkout-pack-card ${selectedPackId === pack.id ? 'selected' : ''} ${pack.best ? 'featured' : ''}`}
                                    onClick={() => handlePackSelection(pack)}
                                >
                                    {pack.best && <div className="pack-ribbon">{pack.best}</div>}
                                    <div className="pack-info">
                                        <h4>{pack.label}</h4>
                                        <p>{pack.subLabel}</p>
                                    </div>
                                    <div className="pack-price">
                                        <span>₹{pack.price.toLocaleString()}</span>
                                        {pack.save && <span className="pack-save-badge">{pack.save}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {isSubmitting && (
                            <div className="processing-overlay">
                                <Loader2 className="spin" size={32} color="#4caf50" />
                                <p>Processing Payment...</p>
                            </div>
                        )}

                        {/* Trust Footer to fill empty space */}
                        <div className="checkout-step-2-footer">
                            <div className="cs-trust-row">
                                <div className="cs-trust-item">
                                    <ShieldCheck size={18} className="cs-icon" />
                                    <span>30-Day Money Back Guarantee</span>
                                </div>
                                <div className="cs-trust-item">
                                    <Lock size={18} className="cs-icon" />
                                    <span>256-Bit Secure Payment</span>
                                </div>
                            </div>
                            <div className="cs-payment-row">
                                <span>We Accept:</span>
                                <div className="cs-pay-icons">
                                    <span>UPI</span>
                                    <span>Cards</span>
                                    <span>NetBanking</span>
                                    <span>COD</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;
