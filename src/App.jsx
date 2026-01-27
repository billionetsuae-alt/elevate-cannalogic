import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import Hero from './components/Hero'
import VideoSection from './components/VideoSection'
import ProblemSection from './components/ProblemSection'
import BenefitsSection from './components/BenefitsSection'
import TruthSection from './components/TruthSection'
import ScienceSection from './components/ScienceSection'
import PartnersMarquee from './components/PartnersMarquee'
import LegalitySection from './components/LegalitySection'
import Mentors from './components/Mentors'
import QualificationSection from './components/QualificationSection'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import BottomStickyBar from './components/BottomStickyBar'
import AssessmentModal from './components/AssessmentModal'
import ProductPage from './components/ProductPage'
import ThankYouPage from './components/ThankYouPage'
import ScrollProgress from './components/ScrollProgress'

// Admin Components
import AdminLayout from './components/admin/AdminLayout'
import AdminLogin from './components/admin/AdminLogin'
import DeepAnalyticsView from './components/admin/DeepAnalyticsView'
import AnalyticsView from './components/admin/AnalyticsView'
import OrdersView from './components/admin/OrdersView'
import InvoicesView from './components/admin/InvoicesView'
import LeadsView from './components/admin/LeadsView'
import PaymentAttemptsView from './components/admin/PaymentAttemptsView'
import ExitIntentView from './components/admin/ExitIntentView'

// Security: Clean up expired localStorage data (30-day expiry)
const SESSION_EXPIRY_DAYS = 30;
const cleanupExpiredData = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('elevate_'));
    const now = Date.now();
    const expiryMs = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    keys.forEach(key => {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            if (data?.createdAt && (now - new Date(data.createdAt).getTime()) > expiryMs) {
                localStorage.removeItem(key);
            }
        } catch {
            // Invalid JSON, remove it
            localStorage.removeItem(key);
        }
    });
};

// Run cleanup on app load
cleanupExpiredData();


// Landing Page Component
function LandingPage({ onOpenAssessment }) {
    // Track Page View and Time on Page
    useEffect(() => {
        // Track Page View
        import('./utils/tracker').then(({ trackEvent, EVENTS }) => {
            trackEvent(EVENTS.PAGEVIEW, 'landing');
        });

        const startTime = Date.now();

        // Track Time on Page when component unmounts
        return () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            import('./utils/tracker').then(({ trackEvent, EVENTS }) => {
                trackEvent(EVENTS.TIME_ON_PAGE, 'landing', null, timeSpent);
            });
        };
    }, []);

    const scrollToVideo = () => {
        const videoSection = document.querySelector('.video-section')
        if (videoSection) {
            videoSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }

    // Scroll Depth Tracking for Landing Page
    useEffect(() => {
        const scrollDepths = { 25: false, 50: false, 75: false, 100: false };

        const handleScroll = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            [25, 50, 75, 100].forEach(depth => {
                if (scrollPercent >= depth && !scrollDepths[depth]) {
                    scrollDepths[depth] = true;
                    import('./utils/tracker').then(({ trackEvent, EVENTS }) => {
                        trackEvent(EVENTS.CLICK, 'landing', `scroll_${depth}_percent`);
                    });
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Section Visibility Tracking
    useEffect(() => {
        const sections = [
            { selector: '.hero', name: 'hero_section' },
            { selector: '.video-section', name: 'video_section' },
            { selector: '.problem-section', name: 'problem_section' },
            { selector: '.benefits-section', name: 'benefits_section' },
            { selector: '.partners-marquee', name: 'partners_section' },
            { selector: '.qualification-section', name: 'qualification_section' },
            { selector: '.faq-section', name: 'faq_section' }
        ];

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const section = sections.find(s => entry.target.matches(s.selector));
                        if (section) {
                            import('./utils/tracker').then(({ trackEvent, EVENTS }) => {
                                trackEvent(EVENTS.CLICK, 'landing', `viewed_${section.name}`);
                            });
                            observer.unobserve(entry.target);
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );

        sections.forEach(section => {
            const element = document.querySelector(section.selector);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="App">
            <ScrollProgress />
            <main>
                <Hero onOpenAssessment={onOpenAssessment} onWatchVideo={scrollToVideo} />
                <VideoSection />
                <ProblemSection onOpenAssessment={onOpenAssessment} />
                <BenefitsSection />
                <TruthSection />
                <ScienceSection />
                <PartnersMarquee />
                <LegalitySection />
                <Mentors />
                <QualificationSection onOpenAssessment={onOpenAssessment} />
                <FAQ />
            </main>
            <Footer onOpenAssessment={onOpenAssessment} />
            <BottomStickyBar onOpenAssessment={onOpenAssessment} />
        </div>
    )
}

// ProductPageWrapper with hybrid localStorage + Airtable loading
function ProductPageWrapper() {
    const navigate = useNavigate()
    const { recordId } = useParams() // Get recordId from URL (could be tempId or Airtable ID)

    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Track Page View
        import('./utils/tracker').then(({ trackEvent, EVENTS }) => {
            trackEvent(EVENTS.PAGEVIEW, 'product');
        });

        const startTime = Date.now();

        // Track Time on Page when component unmounts
        return () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            import('./utils/tracker').then(({ trackEvent, EVENTS }) => {
                trackEvent(EVENTS.TIME_ON_PAGE, 'product', null, timeSpent);
            });
        };
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)

            // STEP 1: Try localStorage first (instant load)
            // Check for data stored under this specific ID
            if (recordId) {
                const storedById = localStorage.getItem(`elevate_assessment_${recordId}`)
                if (storedById) {
                    try {
                        setUserData(JSON.parse(storedById))
                        setLoading(false)
                        return // Found in localStorage, done!
                    } catch (e) {
                        console.error('Error parsing stored data:', e)
                    }
                }
            }

            // Also try the default storage key
            const defaultStored = localStorage.getItem('elevate_user_data')
            if (defaultStored) {
                try {
                    const parsed = JSON.parse(defaultStored)
                    // If this matches the current tempId or recordId, use it
                    if (parsed.tempId === recordId || parsed.recordId === recordId || !recordId) {
                        setUserData(parsed)
                        setLoading(false)

                        // If we have recordId but URL uses tempId, that's fine - URL will update when Airtable responds
                        if (parsed.recordId && recordId && recordId.startsWith('local_')) {
                            // URL is using tempId but we already have recordId - update URL
                            navigate(`/product/${parsed.recordId}`, { replace: true })
                        }
                        return
                    }
                } catch (e) {
                    console.error('Error parsing default stored data:', e)
                }
            }

            // STEP 2: If not in localStorage AND recordId looks like Airtable ID (starts with 'rec'), fetch from Airtable
            if (recordId && recordId.startsWith('rec')) {
                try {
                    const response = await fetch(`https://n8n-642200223.kloudbeansite.com/webhook/get-assessment?id=${recordId}`)
                    if (response.ok) {
                        const data = await response.json()


                        // Handle if n8n returns an array (common)
                        let rawData = data
                        if (Array.isArray(data) && data.length > 0) {

                            rawData = data[0]
                        }
                        // Handle if data is wrapped in 'fields' (Airtable format)
                        rawData = rawData.fields || rawData



                        // Normalize Airtable field names to camelCase for frontend
                        const normalizedData = {
                            name: rawData.Name || rawData.name || '',
                            email: rawData.Email || rawData.email || '',
                            phone: rawData.Phone || rawData.phone || '',
                            age: rawData.Age || rawData.age || '',
                            sex: rawData.Sex || rawData.sex || '',
                            weight: rawData.Weight || rawData.weight || '',
                            totalScore: rawData.Total_Score || rawData.totalScore || 24,
                            maxScore: rawData.Max_Score || rawData.maxScore || 32,
                            readinessLevel: rawData.Readiness_Level || rawData.readinessLevel || 'Ready',
                            recordId: data.id || recordId
                        }

                        // Store in localStorage for future fast loads
                        localStorage.setItem(`elevate_assessment_${recordId}`, JSON.stringify(normalizedData))
                        localStorage.setItem('elevate_user_data', JSON.stringify(normalizedData))

                        setUserData(normalizedData)
                    } else {
                        throw new Error('Airtable fetch failed')
                    }
                } catch (err) {
                    console.error('Error fetching from Airtable:', err)
                    // Show default if all else fails
                }
            }

            setLoading(false)
        }

        loadData()
    }, [recordId, navigate])

    // Listen for Airtable record ready event (to update URL after background submission)
    useEffect(() => {
        const handleRecordReady = (event) => {
            const { recordId: newRecordId, tempId } = event.detail

            // If current URL uses tempId and we now have recordId, update URL
            if (newRecordId && window.location.pathname.includes(tempId)) {
                navigate(`/product/${newRecordId}`, { replace: true })
            }
        }

        window.addEventListener('airtableRecordReady', handleRecordReady)
        return () => window.removeEventListener('airtableRecordReady', handleRecordReady)
    }, [navigate])

    const handleClose = () => {
        navigate('/home')
    }

    // Default user data
    const defaultUserData = {
        name: '',
        totalScore: 24,
        maxScore: 32
    }

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#111',
                color: '#4caf50',
                fontSize: '1.2rem'
            }}>
                Loading your personalized plan...
            </div>
        )
    }

    const handlePaymentSuccess = (paymentData) => {
        // Store payment data and navigate to thank you page
        localStorage.setItem('elevate_payment_data', JSON.stringify(paymentData))
        navigate('/thank-you')
    }

    return (
        <ProductPage
            userData={userData || defaultUserData}
            onClose={handleClose}
            onPaymentSuccess={handlePaymentSuccess}
        />
    )
}

// ThankYouPage Wrapper
function ThankYouPageWrapper() {
    const navigate = useNavigate()

    const [userData, setUserData] = useState(null)
    const [paymentData, setPaymentData] = useState(null)

    useEffect(() => {
        // Load data from localStorage
        const storedUserData = localStorage.getItem('elevate_user_data')
        const storedPaymentData = localStorage.getItem('elevate_payment_data')

        if (storedUserData) {
            setUserData(JSON.parse(storedUserData))
        }
        if (storedPaymentData) {
            setPaymentData(JSON.parse(storedPaymentData))
        }
    }, [])

    const handleGoHome = () => {
        // Clear payment data
        localStorage.removeItem('elevate_payment_data')
        navigate('/')
    }

    return (
        <ThankYouPage
            userData={userData}
            paymentData={paymentData}
            onGoHome={handleGoHome}
        />
    )
}

// Main App Router Component
function AppRouter() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const navigate = useNavigate()

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    // Called when quiz is completed - navigate immediately with tempId
    const handleQuizComplete = (data) => {
        // Data is already saved to localStorage by AssessmentModal
        setIsModalOpen(false)

        // Navigate immediately with tempId (URL will update to recordId after Airtable responds)
        if (data.tempId) {
            navigate(`/product/${data.tempId}`)
        } else if (data.recordId) {
            navigate(`/product/${data.recordId}`)
        } else {
            // Fallback to simple /product route (will load from localStorage)
            navigate('/product')
        }
    }

    return (
        <>
            <Routes>
                <Route path="/" element={<ProductPageWrapper />} />
                <Route path="/home" element={<LandingPage onOpenAssessment={openModal} />} />
                <Route path="/product" element={<ProductPageWrapper />} />
                <Route path="/product/:recordId" element={<ProductPageWrapper />} />
                <Route path="/thank-you" element={<ThankYouPageWrapper />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AnalyticsView />} />
                    <Route path="deep" element={<DeepAnalyticsView />} />
                    <Route path="orders" element={<OrdersView />} />
                    <Route path="invoices" element={<InvoicesView />} />
                    <Route path="leads" element={<LeadsView />} />
                    <Route path="exit-intent" element={<ExitIntentView />} />
                    <Route path="payment-attempts" element={<PaymentAttemptsView />} />
                </Route>

                {/* Default route */}
            </Routes>

            <AssessmentModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onQuizComplete={handleQuizComplete}
            />
        </>
    )
}

// Root App Component with BrowserRouter
function App() {
    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    )
}

export default App
