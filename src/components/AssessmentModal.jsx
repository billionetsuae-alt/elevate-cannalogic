import React, { useState } from 'react';
import './AssessmentModal.css';

const lifestyleOptions = [
    { label: 'Stress & Anxiety', icon: '😰' },
    { label: 'Sleep Issues', icon: '😴' },
    { label: 'Chronic Pain', icon: '⚡' },
    { label: 'Mood Imbalance', icon: '🌊' },
    { label: 'Low Energy', icon: '🔋' },
    { label: 'Focus Problems', icon: '🧠' },
    { label: 'Digestive Issues', icon: '🔥' },
    { label: 'Other', icon: '✨' }
];

const AssessmentModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        age: '',
        weight: '',
        lifestyleIssues: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLifestyleToggle = (issue) => {
        setFormData(prev => ({
            ...prev,
            lifestyleIssues: prev.lifestyleIssues.includes(issue)
                ? prev.lifestyleIssues.filter(i => i !== issue)
                : [...prev.lifestyleIssues, issue]
        }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                lifestyleIssues: formData.lifestyleIssues.join(', ')
            };

            // Submit to n8n webhook
            const response = await fetch('https://n8n-642200223.kloudbeansite.com/webhook/assesment-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                setAiResponse(data);
                setIsSubmitted(true);
            } else {
                throw new Error('Failed to get response');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert(`Error: ${error.message}. Check console for details.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetAndClose = () => {
        setStep(1);
        setIsSubmitted(false);
        setAiResponse(null);
        setFormData({
            fullName: '',
            email: '',
            phoneNumber: '',
            age: '',
            weight: '',
            lifestyleIssues: []
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={resetAndClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={resetAndClose}>×</button>

                {isSubmitted && aiResponse ? (
                    <div className="modal-success results-page">
                        <div className="success-icon">🌿</div>
                        <h2>Great News, {aiResponse.name?.split(' ')[0] || 'there'}!</h2>
                        <p className="ai-response">{aiResponse.message}</p>
                        <a
                            href="https://calendly.com/cannalogic/consultation"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary cta-button"
                        >
                            Book Your Free Consultation
                        </a>
                        <button className="btn btn-outline" onClick={resetAndClose}>Maybe Later</button>
                    </div>
                ) : (
                    <>
                        <div className="modal-header">
                            {step === 1 && <h2>What brings you here?</h2>}
                            {step === 2 && <h2>Help us understand you</h2>}
                            {step === 3 && <h2>Your Results are Ready</h2>}

                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="modal-body">
                            {/* STEP 1: LIFESTYLE (The Hook) */}
                            {step === 1 && (
                                <div className="form-step slide-in">
                                    <p className="form-hint">Select all that apply to you</p>
                                    <div className="lifestyle-grid">
                                        {lifestyleOptions.map((option) => (
                                            <button
                                                key={option.label}
                                                type="button"
                                                className={`lifestyle-option ${formData.lifestyleIssues.includes(option.label) ? 'selected' : ''}`}
                                                onClick={() => handleLifestyleToggle(option.label)}
                                            >
                                                <span className="option-icon">{option.icon}</span>
                                                <span className="option-label">{option.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: STATS */}
                            {step === 2 && (
                                <div className="form-step slide-in">
                                    <p className="form-hint">This helps us calibrate your dosage.</p>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Age</label>
                                            <input
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                placeholder="ex. 35"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Weight (kg)</label>
                                            <input
                                                type="number"
                                                name="weight"
                                                value={formData.weight}
                                                onChange={handleInputChange}
                                                placeholder="ex. 75"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: CONTACT (The Capture) */}
                            {step === 3 && (
                                <div className="form-step slide-in">
                                    <p className="form-hint">Where should we send your eligibility report?</p>
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            {step > 1 && (
                                <button className="btn btn-outline" onClick={prevStep}>Back</button>
                            )}

                            {step === 1 && (
                                <button
                                    className="btn btn-primary"
                                    onClick={nextStep}
                                    disabled={formData.lifestyleIssues.length === 0}
                                >
                                    Continue
                                </button>
                            )}

                            {step === 2 && (
                                <button
                                    className="btn btn-primary"
                                    onClick={nextStep}
                                    disabled={!formData.age || !formData.weight}
                                >
                                    Continue
                                </button>
                            )}

                            {step === 3 && (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !formData.fullName || !formData.email || !formData.phoneNumber}
                                >
                                    {isSubmitting ? 'Analysing...' : 'Get My Results'}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AssessmentModal;
