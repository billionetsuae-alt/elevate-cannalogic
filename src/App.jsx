import { useState } from 'react'
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

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showProductPage, setShowProductPage] = useState(false)
    const [userData, setUserData] = useState(null)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    // Called when quiz is completed - transition to product page
    const handleQuizComplete = (data) => {
        setUserData(data)
        setIsModalOpen(false)
        setShowProductPage(true)
        // Scroll to top when showing product page
        window.scrollTo(0, 0)
    }

    // Called when user leaves product page
    const handleProductPageClose = () => {
        setShowProductPage(false)
        setUserData(null)
    }

    const scrollToVideo = () => {
        const videoSection = document.querySelector('.video-section')
        if (videoSection) {
            videoSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }

    // Show standalone product page if quiz is complete
    if (showProductPage) {
        return <ProductPage userData={userData} onClose={handleProductPageClose} />
    }

    // Otherwise show normal landing page
    return (
        <div className="App">
            <ScrollProgress />
            <main>
                <Hero onOpenAssessment={openModal} onWatchVideo={scrollToVideo} />
                <VideoSection />
                <ProblemSection onOpenAssessment={openModal} />
                <BenefitsSection />
                <TruthSection />
                <QuoteSection />
                <ScienceSection />
                <PartnersMarquee />
                <LegalitySection />
                <Mentors />
                <QualificationSection onOpenAssessment={openModal} />
                <FAQ />
            </main>
            <Footer />
            <BottomStickyBar onOpenAssessment={openModal} />
            <AssessmentModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onQuizComplete={handleQuizComplete}
            />
        </div>
    )
}

export default App
