import { useState } from 'react'
import Hero from './components/Hero'
import MarqueeAlumni from './components/MarqueeAlumni'
import VennSection from './components/VennSection'
import TargetAudience from './components/TargetAudience'
import AgenticWorkflows from './components/AgenticWorkflows'
import QuotesSlider from './components/QuotesSlider'
import Curriculum from './components/Curriculum'
import ToolsMarquee from './components/ToolsMarquee'
import DemoDay from './components/DemoDay'
import Mentors from './components/Mentors'
import GlobalCommunity from './components/GlobalCommunity'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import BottomStickyBar from './components/BottomStickyBar'
import AssessmentModal from './components/AssessmentModal'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const scrollToVideo = () => {
    const videoSection = document.querySelector('.video-section')
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className="App">
      <main style={{ paddingBottom: '5rem' }}>
        <Hero onOpenAssessment={openModal} onWatchVideo={scrollToVideo} />
        <MarqueeAlumni />
        <VennSection onOpenAssessment={openModal} />
        <TargetAudience />
        <AgenticWorkflows />
        <QuotesSlider />
        <Curriculum />
        <ToolsMarquee />
        <DemoDay />
        <Mentors />
        <GlobalCommunity />
        <Pricing onOpenAssessment={openModal} />
        <FAQ />
      </main>
      <Footer />
      <BottomStickyBar onOpenAssessment={openModal} />
      <AssessmentModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

export default App
