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
import Scholarships from './components/Scholarships'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import BottomStickyBar from './components/BottomStickyBar'

function App() {
  return (
    <div className="App">
      <main>
        <Hero />
        <MarqueeAlumni />
        <VennSection />
        <TargetAudience />
        <AgenticWorkflows />
        <QuotesSlider />
        <Curriculum />
        <ToolsMarquee />
        <DemoDay />
        <Mentors />
        <GlobalCommunity />
        <Pricing />
        <Scholarships />
        <FAQ />
      </main>
      <Footer />
      <BottomStickyBar />
    </div>
  )
}

export default App
