import { useState, useEffect } from 'react'
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
import ScrollProgress from './components/ScrollProgress'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // Scroll Animation Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.animate-on-scroll');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []); // Run once on mount

  const scrollToVideo = () => {
    const videoSection = document.querySelector('.video-section')
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className="App">
      <ScrollProgress />
      <main style={{ paddingBottom: '5rem' }}>
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
      <AssessmentModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

export default App
