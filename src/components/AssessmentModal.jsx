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

// Quiz questions data with point values and icons
const quizQuestions = [
    {
        id: 1,
        question: "What do you want to become?",
        options: [
            { text: "A consciously living and purpose-led individual", points: 4, icon: Sparkles },
            { text: "A clear-minded and thoughtful individual", points: 3, icon: Brain },
            { text: "A more stable, balanced version of who I am now", points: 2, icon: Scale },
            { text: "I haven't yet connected with a future identity", points: 1, icon: HelpCircle }
        ]
    },
    {
        id: 2,
        question: "What inner state do you want to be in?",
        options: [
            { text: "Deep inner peace and presence", points: 4, icon: Flower2 },
            { text: "Emotional balance and steady flow", points: 3, icon: Waves },
            { text: "General mental calm and clarity", points: 2, icon: Cloud },
            { text: "I haven't thought much about this", points: 1, icon: MessageCircleQuestion }
        ]
    },
    {
        id: 3,
        question: "Why is this transformation important to you now?",
        options: [
            { text: "I feel a strong inner calling for change", points: 4, icon: Flame },
            { text: "I feel ready for meaningful personal growth", points: 3, icon: Sprout },
            { text: "I think change could be helpful", points: 2, icon: Lightbulb },
            { text: "I'm just casually exploring ideas", points: 1, icon: Eye }
        ]
    },
    {
        id: 4,
        question: "How do you usually approach personal growth?",
        options: [
            { text: "I actively and consistently work on myself", points: 4, icon: Target },
            { text: "I engage in growth when something resonates", points: 3, icon: Star },
            { text: "I think about growth but act inconsistently", points: 2, icon: FileText },
            { text: "I haven't really focused on it yet", points: 1, icon: Moon }
        ]
    },
    {
        id: 5,
        question: "How open are you to natural, plant-based tools?",
        options: [
            { text: "Very open and already informed", points: 4, icon: Leaf },
            { text: "Open with the right guidance and context", points: 3, icon: Handshake },
            { text: "Neutral or mildly curious", points: 2, icon: Search },
            { text: "Not open to this approach", points: 1, icon: Ban }
        ]
    },
    {
        id: 6,
        question: "How do you view consciousness and awareness in transformation?",
        options: [
            { text: "They are the foundation of real change", points: 4, icon: Zap },
            { text: "They play an important role", points: 3, icon: Compass },
            { text: "I see some value but don't focus on them much", points: 2, icon: Search },
            { text: "I don't really see their relevance yet", points: 1, icon: CircleHelp }
        ]
    },
    {
        id: 7,
        question: "How committed are you to becoming this version of yourself?",
        options: [
            { text: "Fully committed and ready to act", points: 4, icon: Dumbbell },
            { text: "Committed but still clarifying the path", points: 3, icon: Map },
            { text: "Interested but not fully committed", points: 2, icon: CircleDashed },
            { text: "Not ready to commit right now", points: 1, icon: Pause }
        ]
    },
    {
        id: 8,
        question: "When do you want to begin this journey?",
        options: [
            { text: "Now — I feel ready", points: 4, icon: Rocket },
            { text: "Soon — within the coming weeks", points: 3, icon: Calendar },
            { text: "Later — in a few months", points: 2, icon: CalendarDays },
            { text: "No clear timeline yet", points: 1, icon: Hourglass }
        ]
    }
];

const TOTAL_STEPS = 12; // intro + personal + 8 questions + contact + results

const AssessmentModal = ({ isOpen, onClose, onQuizComplete }) => {
    const [step, setStep] = useState(0); // 0=intro, 1=personal, 2-9=questions, 10=contact, 11=results
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
        // Auto-advance after selection with a small delay for visual feedback
        setTimeout(() => {
            if (step < 9) {
                setStep(prev => prev + 1);
            } else {
                setStep(10); // Go to contact step
            }
        }, 400);
    };

    const calculateScore = () => {
        return Object.values(formData.answers).reduce((sum, val) => sum + val, 0);
    };

    const getScoreInterpretation = () => {
        const score = calculateScore();
        if (score >= 28) {
            return {
                level: "Highly Ready",
                message: "You show exceptional readiness for profound inner transformation. Your clarity, commitment, and openness position you perfectly for this journey.",
                color: "#4caf50",
                recommendation: "We recommend starting with our complete transformation protocol."
            };
        } else if (score >= 21) {
            return {
                level: "Ready",
                message: "You have strong foundations for transformation. With the right guidance, you're well-positioned to begin this meaningful journey.",
                color: "#8bc34a",
                recommendation: "Our guided approach will help accelerate your transformation."
            };
        } else if (score >= 14) {
            return {
                level: "Approaching Readiness",
                message: "You're developing the awareness needed for transformation. A guided approach can help you clarify your path forward.",
                color: "#ffc107",
                recommendation: "Start gently with our introductory support system."
            };
        } else {
            return {
                level: "Exploring",
                message: "You're at the beginning of your exploration. This is a beautiful place to start building awareness and understanding.",
                color: "#ff9800",
                recommendation: "Begin with education and awareness building."
            };
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const totalScore = calculateScore();

        // Get UTM parameters and source tracking
        const urlParams = new URLSearchParams(window.location.search);
        const getReadinessLevel = (score) => {
            if (score >= 28) return 'Highly Ready';
            if (score >= 21) return 'Ready';
            if (score >= 14) return 'Approaching';
            return 'Exploring';
        };

        // Get actual answer texts instead of just scores
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
            q7: getAnswerText(7, formData.answers.q7),
            q8: getAnswerText(8, formData.answers.q8)
        };

        // Generate a temporary local ID for instant navigation
        const tempId = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        // Prepare user data for localStorage and product page
        const userData = {
            name: formData.name,
            age: formData.age,
            sex: formData.sex,
            weight: formData.weight,
            phone: formData.phone,
            email: formData.email,
            totalScore: totalScore,
            maxScore: 32,
            readinessLevel: getReadinessLevel(totalScore),
            tempId: tempId
        };

        // Store in localStorage immediately for instant load
        localStorage.setItem(`elevate_assessment_${tempId}`, JSON.stringify(userData));
        localStorage.setItem('elevate_user_data', JSON.stringify(userData)); // Also store as default

        // Navigate IMMEDIATELY to product page with temp ID
        if (onQuizComplete) {
            onQuizComplete({
                ...userData,
                tempId: tempId
            });
        }

        // Now send to Airtable in the background (user already sees product page)
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
            maxScore: 32,
            tempId: tempId, // Include tempId so we can link it later
            // Source tracking
            source: urlParams.get('utm_source') || urlParams.get('ref') || document.referrer || 'Direct',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || '',
            // Auto-set fields
            status: 'Lead',
            readinessLevel: getReadinessLevel(totalScore),
            submittedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            pageUrl: window.location.href
        };

        // Background Airtable submission
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
                // Update localStorage with the Airtable recordId
                userData.recordId = recordId;
                localStorage.setItem(`elevate_assessment_${recordId}`, JSON.stringify(userData));
                localStorage.setItem('elevate_user_data', JSON.stringify(userData));

                // Dispatch custom event to notify App to update URL
                window.dispatchEvent(new CustomEvent('airtableRecordReady', {
                    detail: { recordId, tempId }
                }));
            }
        } catch (error) {
            console.error('Background Airtable submission error:', error);
            // User already on product page, so just log the error
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

                {/* Progress Bar - shown during quiz flow */}
                {step > 0 && step < 11 && (
                    <div className="assessment-progress">
                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{ width: `${getProgress()}%` }}
                            />
                        </div>
                        <span className="progress-text">
                            {step <= 1 ? 'Getting Started' :
                                step <= 9 ? `Question ${step - 1} of 8` :
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
                            <h2>Discover Your Readiness</h2>
                            <p className="intro-subtitle">
                                A short self-assessment designed to understand your readiness for inner transformation.
                            </p>
                            <div className="intro-details">
                                <div className="detail-item">
                                    <Clock size={18} />
                                    <span>Takes 2–3 minutes</span>
                                </div>
                                <div className="detail-item">
                                    <Sprout size={18} />
                                    <span>Plant-based support journey</span>
                                </div>
                                <div className="detail-item">
                                    <Check size={18} />
                                    <span>No right or wrong answers</span>
                                </div>
                            </div>
                            <p className="intro-note">Answer honestly. This helps us see if this journey is right for you.</p>
                            <button className="btn-start" onClick={nextStep}>
                                Begin Assessment
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    )}

                    {/* STEP 1: PERSONAL INFO */}
                    {step === 1 && (
                        <div className="step-content personal-step">
                            <h2>Let's Get To Know You</h2>
                            <p className="step-hint">This helps us personalize your journey</p>

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

                    {/* STEPS 2-9: QUIZ QUESTIONS */}
                    {step >= 2 && step <= 9 && currentQuestion && (
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
                                            {formData.answers[`q${currentQuestion.id}`] === option.points && (
                                                <span className="option-check">
                                                    <Check size={14} strokeWidth={3} />
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <button className="btn-back-small" onClick={prevStep}>
                                <ChevronLeft size={16} /> Back
                            </button>
                        </div>
                    )}

                    {/* STEP 10: CONTACT INFO */}
                    {step === 10 && (
                        <div className="step-content contact-step">
                            <div className="contact-icon">
                                <Mail size={40} strokeWidth={1.5} />
                            </div>
                            <h2>Get Your FREE Action Plan</h2>
                            <p className="step-hint">Enter your details to receive a personalized transformation roadmap</p>

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
                                            Analyzing...
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

