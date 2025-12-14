import React, { useState } from 'react';
import './AssessmentModal.css';

const lifestyleOptions = [
    'Stress & Anxiety',
    'Sleep Issues',
    'Chronic Pain',
    'Mood Imbalance',
    'Low Energy',
    'Focus Problems',
    'Digestive Issues',
    'Other'
];

const AssessmentModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
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
            await fetch('https://n8n.billionets.com/webhook/assesment-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            setIsSubmitted(true);
        } catch (error) {
            console.error('Submission error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetAndClose = () => {
        setStep(1);
        setIsSubmitted(false);
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

                {isSubmitted ? (
                    <div className="modal-success">
                        <div className="success-icon">✓</div>
                        <h2>You're Eligible!</h2>
                        <p>Thank you for completing the assessment. Our team will reach out to you shortly with personalized recommendations.</p>
                        <button className="btn btn-primary" onClick={resetAndClose}>Close</button>
                    </div>
                ) : (
                    <>
                        <div className="modal-header">
                            <h2>Consciousness Assessment</h2>
                            <p>Step {step} of 3</p>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="modal-body">
                            {step === 1 && (
                                <div className="form-step">
                                    <h3>Personal Information</h3>
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
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

                            {step === 2 && (
                                <div className="form-step">
                                    <h3>Health Profile</h3>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Age</label>
                                            <input
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                placeholder="Your age"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Weight (kg)</label>
                                            <input
                                                type="number"
                                                name="weight"
                                                value={formData.weight}
                                                onChange={handleInputChange}
                                                placeholder="Your weight"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="form-step">
                                    <h3>What are you seeking help with?</h3>
                                    <p className="form-hint">Select all that apply</p>
                                    <div className="lifestyle-grid">
                                        {lifestyleOptions.map((issue) => (
                                            <button
                                                key={issue}
                                                type="button"
                                                className={`lifestyle-option ${formData.lifestyleIssues.includes(issue) ? 'selected' : ''}`}
                                                onClick={() => handleLifestyleToggle(issue)}
                                            >
                                                {issue}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            {step > 1 && (
                                <button className="btn btn-outline" onClick={prevStep}>Back</button>
                            )}
                            {step < 3 ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={nextStep}
                                    disabled={step === 1 && (!formData.fullName || !formData.email || !formData.phoneNumber)}
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || formData.lifestyleIssues.length === 0}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Check Eligibility'}
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
