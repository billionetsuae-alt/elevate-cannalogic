import React, { useState } from 'react';
import './AssessmentModal.css';
import {
    Sparkles, Brain, Scale, HelpCircle,
    Flower2, Waves, Cloud, MessageCircleQuestion,
    Flame, Sprout, Lightbulb, Eye,
    Target, Star, FileText, Moon,
    Leaf, Handshake, Search, Ban,
    Zap, Compass, CircleHelp,
    Dumbbell, Map, CircleDashed, Pause,
    Rocket, Calendar, CalendarDays, Hourglass,
    Clock, Heart, Check, ArrowRight,
    ChevronLeft, Mail, Phone, User,
    Package, ShieldCheck, Award, Truck
} from 'lucide-react';

// Quiz questions data with updated 1-5 scoring (Low to High Vibration)
const quizQuestions = [
    {
        id: 1,
        question: "How do you usually feel when you wake up in the morning?",
        options: [
            { text: "Heavy, tired, unmotivated", points: 1, icon: Cloud },
            { text: "Slightly stressed or rushed", points: 2, icon: Zap },
            { text: "Neutral, just starting the day", points: 3, icon: CircleDashed },
            { text: "Calm and stable", points: 4, icon: Waves },
            { text: "Peaceful, clear, and positive", points: 5, icon: Flower2 }
        ]
    },
    {
        id: 2,
        question: "How do you generally respond to stress or problems?",
        options: [
            { text: "I feel overwhelmed or shut down", points: 1, icon: Ban },
            { text: "I get anxious or irritated", points: 2, icon: Flame },
            { text: "I manage but feel affected", points: 3, icon: Scale },
            { text: "I stay mostly calm and practical", points: 4, icon: ShieldCheck },
            { text: "I stay centered and observe", points: 5, icon: Eye }
        ]
    },
    {
        id: 3,
        question: "How would you describe your emotional state most days?",
        options: [
            { text: "Drained or hopeless", points: 1, icon: Hourglass },
            { text: "Unsettled or frustrated", points: 2, icon: CircleHelp },
            { text: "Neutral / mixed", points: 3, icon: Scale },
            { text: "Balanced and stable", points: 4, icon: Compass },
            { text: "Light, positive, or joyful", points: 5, icon: Sparkles }
        ]
    },
    {
        id: 4,
        question: "How connected do you feel to yourself?",
        options: [
            { text: "Completely disconnected", points: 1, icon: Cloud },
            { text: "Occasionally aware of myself", points: 2, icon: Search },
            { text: "Somewhat connected", points: 3, icon: Handshake },
            { text: "Mostly aware and present", points: 4, icon: User },
            { text: "Deeply connected and self-aware", points: 5, icon: Heart }
        ]
    },
    {
        id: 5,
        question: "How do you handle challenges or setbacks?",
        options: [
            { text: "I feel stuck or helpless", points: 1, icon: Ban },
            { text: "I struggle and overthink", points: 2, icon: Dumbbell },
            { text: "I manage with effort", points: 3, icon: Check },
            { text: "I learn and adapt", points: 4, icon: Brain },
            { text: "I see challenges as growth", points: 5, icon: Sprout }
        ]
    },
    {
        id: 6,
        question: "How would you describe your overall energy level?",
        options: [
            { text: "Very low or drained", points: 1, icon: Moon },
            { text: "Low but functioning", points: 2, icon: Cloud },
            { text: "Moderate", points: 3, icon: Scale },
            { text: "Energized most days", points: 4, icon: Zap },
            { text: "Consistently high and balanced", points: 5, icon: Rocket }
        ]
    },
    {
        id: 7,
        question: "Which statement feels most true right now?",
        options: [
            { text: "Life feels heavy", points: 1, icon: Package },
            { text: "I’m trying to find stability", points: 2, icon: Scale },
            { text: "I’m figuring things out", points: 3, icon: Map },
            { text: "I’m growing and evolving", points: 4, icon: Sprout },
            { text: "I feel aligned and purposeful", points: 5, icon: Star }
        ]
    }
];

const TOTAL_STEPS = 10; // intro(0) + personal(1) + 7 questions(2-8) + contact(9) = 10 steps

const AssessmentModal = ({ isOpen, onClose, onQuizComplete }) => {
    const [step, setStep] = useState(0); // 0=intro, 1=personal, 2-8=questions, 9=contact
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        sex: '',
        weight: '',
        phone: '',
        email: '',
        answers: {}
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAnswerSelect = (questionId, points) => {
        setFormData(prev => ({
            ...prev,
            answers: { ...prev.answers, [`q${questionId}`]: points }
        }));
        // Auto-advance
        setTimeout(() => {
            if (step < 8) { // Last question is displayed at step 8
                setStep(prev => prev + 1);
            } else {
                setStep(9); // Go to contact step
            }
        }, 400);
    };

    const calculateScore = () => {
        return Object.values(formData.answers).reduce((sum, val) => sum + val, 0);
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const totalScore = calculateScore();

        // Get UTM parameters
        const urlParams = new URLSearchParams(window.location.search);

        // Updated Scoring Thresholds
        const getReadinessLevel = (score) => {
            if (score >= 29) return 'Elevated State';
            if (score >= 22) return 'Growth Phase';
            if (score >= 15) return 'Stabilization Phase';
            return 'Survival Mode';
        };

        // Get actual answer texts
        const getAnswerText = (questionId, score) => {
            const question = quizQuestions.find(q => q.id === questionId);
            if (question) {
                const option = question.options.find(o => o.points === score);
                return option ? option.text : '';
            }
            return '';
        };

        const answerTexts = {
            q1: getAnswerText(1, formData.answers.q1),
            q2: getAnswerText(2, formData.answers.q2),
            q3: getAnswerText(3, formData.answers.q3),
            q4: getAnswerText(4, formData.answers.q4),
            q5: getAnswerText(5, formData.answers.q5),
            q6: getAnswerText(6, formData.answers.q6),
            q7: getAnswerText(7, formData.answers.q7)
        };

        // Generate temp ID
        const tempId = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        // Prepare user data
        const userData = {
            name: formData.name,
            age: formData.age,
            sex: formData.sex,
            weight: formData.weight,
            phone: formData.phone,
            email: formData.email,
            totalScore: totalScore,
            maxScore: 35, // Updated max score
            readinessLevel: getReadinessLevel(totalScore),
            tempId: tempId
        };

        // Store in localStorage
        localStorage.setItem(`elevate_assessment_${tempId}`, JSON.stringify(userData));
        localStorage.setItem('elevate_user_data', JSON.stringify(userData));

        if (onQuizComplete) {
            onQuizComplete({
                ...userData,
                tempId: tempId
            });
        }

        // Background Submission
        const payload = {
            name: formData.name,
            age: parseInt(formData.age),
            sex: formData.sex,
            weight: parseInt(formData.weight),
            phone: formData.phone,
            email: formData.email,
            answers: formData.answers,
            answerTexts: answerTexts,
            totalScore: totalScore,
            maxScore: 35,
            tempId: tempId,
            source: urlParams.get('utm_source') || urlParams.get('ref') || document.referrer || 'Direct',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || '',
            status: 'Lead',
            readinessLevel: getReadinessLevel(totalScore),
            submittedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            pageUrl: window.location.href
        };

        try {
            const response = await fetch('https://n8n-642200223.kloudbeansite.com/webhook/elevate-assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            let recordId = null;
            try {
                const result = await response.json();
                recordId = result.id || result.recordId || (result.fields && result.fields.id);
            } catch (e) {
                console.error('Error parsing webhook response:', e);
            }

            if (recordId) {
                userData.recordId = recordId;
                localStorage.setItem(`elevate_assessment_${recordId}`, JSON.stringify(userData));
                localStorage.setItem('elevate_user_data', JSON.stringify(userData));
                window.dispatchEvent(new CustomEvent('airtableRecordReady', {
                    detail: { recordId, tempId }
                }));
            }
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetAndClose = () => {
        setStep(0);
        setFormData({
            name: '',
            age: '',
            sex: '',
            weight: '',
            phone: '',
            email: '',
            answers: {}
        });
        onClose();
    };

    const getProgress = () => {
        return ((step + 1) / TOTAL_STEPS) * 100;
    };

    const isPersonalInfoValid = () => {
        return formData.name && formData.age && formData.sex && formData.weight;
    };

    const isContactInfoValid = () => {
        return formData.phone && formData.email;
    };

    if (!isOpen) return null;

    const currentQuestionIndex = step - 2;
    const currentQuestion = quizQuestions[currentQuestionIndex];

    return (
        <div className="assessment-overlay" onClick={resetAndClose}>
            <div className="assessment-container" onClick={e => e.stopPropagation()}>
                <button className="assessment-close" onClick={resetAndClose}>×</button>

                {/* Progress Bar */}
                {step > 0 && step < 10 && (
                    <div className="assessment-progress">
                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{ width: `${getProgress()}%` }}
                            />
                        </div>
                        <span className="progress-text">
                            {step <= 1 ? 'Getting Started' :
                                step <= 8 ? `Question ${step - 1} of 7` :
                                    'Almost Done'}
                        </span>
                    </div>
                )}

                <div className="assessment-content">
                    {/* STEP 0: INTRO */}
                    {step === 0 && (
                        <div className="step-content intro-step">
                            <div className="intro-icon">
                                <Leaf size={48} strokeWidth={1.5} />
                            </div>
                            <h2>Frequency Check</h2>
                            <p className="intro-subtitle">
                                A 7-question consciousness check to understand your current vibrational frequency and readiness.
                            </p>
                            <div className="intro-details">
                                <div className="detail-item">
                                    <Clock size={18} />
                                    <span>Takes 2 minutes</span>
                                </div>
                                <div className="detail-item">
                                    <Sprout size={18} />
                                    <span>Vibrational Match</span>
                                </div>
                                <div className="detail-item">
                                    <Check size={18} />
                                    <span>Low to High Vibration</span>
                                </div>
                            </div>
                            <p className="intro-note">Answer honestly based on how you truly feel right now.</p>
                            <button className="btn-start" onClick={nextStep}>
                                Start Check
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {/* STEP 1: PERSONAL INFO */}
                    {step === 1 && (
                        <div className="step-content personal-step">
                            <h2>Let's Get To Know You</h2>
                            <p className="step-hint">This helps us personalize your report</p>

                            <div className="form-grid">
                                <div className="form-field">
                                    <label><User size={14} /> Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your name"
                                        autoFocus
                                    />
                                </div>

                                <div className="form-row-2">
                                    <div className="form-field">
                                        <label>Age</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            placeholder="25"
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Weight (kg)</label>
                                        <input
                                            type="number"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleInputChange}
                                            placeholder="70"
                                        />
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label>Sex</label>
                                    <div className="sex-options">
                                        {['Male', 'Female', 'Other'].map(option => (
                                            <button
                                                key={option}
                                                type="button"
                                                className={`sex-option ${formData.sex === option ? 'selected' : ''}`}
                                                onClick={() => setFormData(prev => ({ ...prev, sex: option }))}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="step-actions">
                                <button className="btn-secondary" onClick={prevStep}>
                                    <ChevronLeft size={18} /> Back
                                </button>
                                <button
                                    className="btn-primary"
                                    onClick={nextStep}
                                    disabled={!isPersonalInfoValid()}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEPS 2-8: QUIZ QUESTIONS */}
                    {step >= 2 && step <= 8 && currentQuestion && (
                        <div className="step-content question-step">
                            <div className="question-number">Q{currentQuestion.id}</div>
                            <h2>{currentQuestion.question}</h2>

                            <div className="options-list">
                                {currentQuestion.options.map((option, index) => {
                                    const IconComponent = option.icon;
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            className={`option-card ${formData.answers[`q${currentQuestion.id}`] === option.points ? 'selected' : ''}`}
                                            onClick={() => handleAnswerSelect(currentQuestion.id, option.points)}
                                        >
                                            <span className="option-icon">
                                                <IconComponent size={22} strokeWidth={1.5} />
                                            </span>
                                            <span className="option-text">{option.text}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <button className="btn-back-small" onClick={prevStep}>
                                <ChevronLeft size={16} /> Back
                            </button>
                        </div>
                    )}

                    {/* STEP 9: CONTACT INFO */}
                    {step === 9 && (
                        <div className="step-content contact-step">
                            <div className="contact-icon">
                                <Mail size={40} strokeWidth={1.5} />
                            </div>
                            <h2>Get Your Analysis</h2>
                            <p className="step-hint">Enter your details to receive your personalized consciousness report</p>

                            <div className="form-grid">
                                <div className="form-field">
                                    <label><Phone size={14} /> Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+91 98765 43210"
                                        autoFocus
                                    />
                                </div>
                                <div className="form-field">
                                    <label><Mail size={14} /> Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="step-actions">
                                <button className="btn-secondary" onClick={prevStep}>
                                    <ChevronLeft size={18} /> Back
                                </button>
                                <button
                                    className="btn-primary btn-submit"
                                    onClick={handleSubmit}
                                    disabled={!isContactInfoValid() || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner"></span>
                                            Analyzing Frequency...
                                        </>
                                    ) : 'See My Results'}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AssessmentModal;

