import { Routes, Route } from 'react-router-dom';
import './App.css';
import ParticleBackground from './components/ui/ParticleBackground';
import Navigation from './components/sections/Navigation';
import Hero from './components/sections/Hero';
import Problem from './components/sections/Problem';
import Solution from './components/sections/Solution';
import CaseStudy from './components/sections/CaseStudy';
import Features from './components/sections/Features';
import Pricing from './components/sections/Pricing';
import FAQ from './components/sections/FAQ';
import FinalCTA from './components/sections/FinalCTA';
import Footer from './components/sections/Footer';
import SuccessPage from './components/pages/SuccessPage';

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Background Effects */}
      <ParticleBackground />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main>
        <Hero />
        <Problem />
        <Solution />
        <CaseStudy />
        <Features />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/success" element={<SuccessPage />} />
    </Routes>
  );
}

export default App;
