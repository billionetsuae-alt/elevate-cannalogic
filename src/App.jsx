import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Hero from './components/Hero'
import VideoSection from './components/VideoSection'
import ProblemSection from './components/ProblemSection'
import BenefitsSection from './components/BenefitsSection'
import TruthSection from './components/TruthSection'
import QuoteSection from './components/QuotesSlider'
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
import ScrollProgress from './components/ScrollProgress'

// Landing Page Component
function LandingPage({ onOpenAssessment }) {
    const scrollToVideo = () => {
        const videoSection = document.querySelector('.video-section')
        if (videoSection) {
            videoSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }

    return (
        <div className="App">
            <ScrollProgress />
            <main>
                <Hero onOpenAssessment={onOpenAssessment} onWatchVideo={scrollToVideo} />
                <VideoSection />
                <ProblemSection onOpenAssessment={onOpenAssessment} />
                <BenefitsSection />
                <TruthSection />
                <QuoteSection />
                <ScienceSection />
                <PartnersMarquee />
                <LegalitySection />
                <Mentors />
                <QualificationSection onOpenAssessment={onOpenAssessment} />
                <FAQ />
            </main>
            <Footer />
            <BottomStickyBar onOpenAssessment={onOpenAssessment} />
        </div>
    )
}

// Product Page Wrapper with navigation
function ProductPageWrapper() {
    const navigate = useNavigate()
    const location = useLocation()

    // Get user data from URL params or localStorage
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        // Try to get data from URL search params first
        const searchParams = new URLSearchParams(location.search)
        const urlData = searchParams.get('data')

        if (urlData) {
            try {
                const parsed = JSON.parse(decodeURIComponent(urlData))
                setUserData(parsed)
                // Also save to localStorage for persistence
                localStorage.setItem('elevate_user_data', JSON.stringify(parsed))
            } catch (e) {
                console.error('Error parsing URL data:', e)
            }
        } else {
            // Fallback to localStorage
            const stored = localStorage.getItem('elevate_user_data')
            if (stored) {
                try {
                    setUserData(JSON.parse(stored))
                } catch (e) {
                    console.error('Error parsing stored data:', e)
                }
            }
        }
    }, [location.search])

    const handleClose = () => {
        navigate('/')
    }

    // Default user data if none available
    const defaultUserData = {
        name: 'Friend',
        totalScore: 24,
        maxScore: 32
    }

    return (
        <ProductPage
            userData={userData || defaultUserData}
            onClose={handleClose}
        />
    )
}

// Main App Router Component
function AppRouter() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const navigate = useNavigate()

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    // Called when quiz is completed - navigate to product page with data
    const handleQuizComplete = (data) => {
        // Save to localStorage for persistence
        localStorage.setItem('elevate_user_data', JSON.stringify(data))

        // Close modal and navigate to product page
        setIsModalOpen(false)

        // Create URL-safe data string for shareable links
        const encodedData = encodeURIComponent(JSON.stringify(data))
        navigate(`/product?data=${encodedData}`)
    }

    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage onOpenAssessment={openModal} />} />
                <Route path="/product" element={<ProductPageWrapper />} />
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
