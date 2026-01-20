import React, { useState, useEffect } from 'react';
import { X, MapPin, User, Phone, Home, Loader2 } from 'lucide-react';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, userData, selectedPack, onProceedToPayment }) => {
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
            // Track checkout opened
            import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
                trackEvent(EVENTS.CLICK, 'checkout', 'checkout_opened');
            });

            const startTime = Date.now();

            // Track time in checkout when modal closes
            return () => {
                const timeSpent = Math.round((Date.now() - startTime) / 1000);
                if (timeSpent > 0) {
                    import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
                        trackEvent(EVENTS.TIME_ON_PAGE, 'checkout', null, timeSpent);
                    });
                }
            };
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) return;

        setIsSubmitting(true);

        // Prepare full address string
        const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country} - ${formData.pincode}`;

        // Save address to Airtable via webhook
        try {
            if (userData?.recordId) {
                await fetch('https://n8n-642200223.kloudbeansite.com/webhook/update-address', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        recordId: userData.recordId,
                        address: fullAddress,
                        pincode: formData.pincode,
                        city: formData.city,
                        state: formData.state
                    })
                });
            }
        } catch (error) {
            console.error('Address save error:', error);
            // Continue to payment even if save fails
        }

        setIsSubmitting(false);

        // Proceed to Razorpay with updated data
        onProceedToPayment({
            ...formData,
            fullAddress
        });
    };

    if (!isOpen) return null;

    return (
        <div className="checkout-overlay" onClick={onClose}>
            <div className="checkout-modal" onClick={e => e.stopPropagation()}>
                <button className="checkout-close" onClick={() => {
                    import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
                        trackEvent(EVENTS.CLICK, 'checkout', 'checkout_abandoned');
                    });
                    onClose();
                }}>
                    <X size={20} />
                </button>

                <div className="checkout-header">
                    <h2>Shipping Details</h2>
                    <p>Where should we deliver your Elevate Bundle?</p>
                </div>

                <form onSubmit={handleSubmit} className="checkout-form">
                    {/* Full Name */}
                    <div className="checkout-field">
                        <label>
                            <User size={16} />
                            Full Name
                        </label>
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
                        <label>
                            <Phone size={16} />
                            Phone Number
                        </label>
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

                    {/* Full Address */}
                    <div className="checkout-field">
                        <label>
                            <Home size={16} />
                            Complete Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            onFocus={() => handleFieldFocus('address')}
                            placeholder="House/Flat No., Building, Street, Landmark"
                            rows={3}
                            required
                        />
                    </div>

                    {/* Pincode */}
                    <div className="checkout-field">
                        <label>
                            <MapPin size={16} />
                            Pincode
                        </label>
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

                    {/* City & State (auto-filled, editable) */}
                    <div className="checkout-row">
                        <div className="checkout-field">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                onFocus={() => handleFieldFocus('city')}
                                placeholder="City"
                                className={formData.city ? 'autofilled' : ''}
                                required
                            />
                        </div>
                        <div className="checkout-field">
                            <label>State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                onFocus={() => handleFieldFocus('state')}
                                placeholder="State"
                                className={formData.state ? 'autofilled' : ''}
                                required
                            />
                        </div>
                    </div>

                    {/* Country */}
                    <div className="checkout-field">
                        <label>Country</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            onFocus={() => handleFieldFocus('country')}
                            placeholder="Country"
                            required
                        />
                    </div>



                    {/* Order Summary */}
                    <div className="checkout-summary">
                        <div className="summary-row">
                            <span>{selectedPack ? `Elevate Bundle - ${selectedPack.label}` : 'Elevate Full Spectrum Bundle'}</span>
                            <span>₹{selectedPack ? selectedPack.price.toLocaleString('en-IN') : '3,899'}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{selectedPack ? selectedPack.price.toLocaleString('en-IN') : '3,899'}</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="checkout-submit"
                        disabled={!isFormValid() || isSubmitting}
                        onClick={() => {
                            import('../utils/tracker').then(({ trackEvent, EVENTS }) => {
                                trackEvent(EVENTS.CLICK, 'checkout', 'pay_button_clicked');
                            });
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="spin" size={18} />
                                Processing...
                            </>
                        ) : (
                            <>Pay ₹{selectedPack ? selectedPack.price.toLocaleString('en-IN') : '3,899'}</>
                        )}
                    </button>

                    <p className="checkout-secure">
                        🔒 Secure payment via Razorpay
                    </p>
                </form>
            </div>
        </div>
    );
};

export default CheckoutModal;
