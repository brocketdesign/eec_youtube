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

// Pages
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiePage from './pages/CookiePage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import CareersPage from './pages/CareersPage';
import GuidesPage from './pages/GuidesPage';
import TemplatesPage from './pages/TemplatesPage';
import WebinarsPage from './pages/WebinarsPage';

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
      {/* Legal */}
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/cookies" element={<CookiePage />} />
      {/* Product */}
      <Route path="/case-studies" element={<CaseStudiesPage />} />
      <Route path="/testimonials" element={<TestimonialsPage />} />
      {/* Company */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/careers" element={<CareersPage />} />
      {/* Resources */}
      <Route path="/guides" element={<GuidesPage />} />
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/webinars" element={<WebinarsPage />} />
    </Routes>
  );
}

export default App;
