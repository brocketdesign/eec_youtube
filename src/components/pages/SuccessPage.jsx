import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Download, BookOpen, ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn, Mail } from 'lucide-react';
import Button from '../ui/Button';
import { api } from '../../lib/api';

// Configure the total number of ebook pages here.
// Place images named page-1.png, page-2.png, etc. in /public/ebook/pages/
// Place the zip file as /public/ebook/download/eec-playbook.zip
const TOTAL_PAGES = 12;

const SuccessPage = () => {
  const [showViewer, setShowViewer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});

  // Get email from URL params (optional, for personalization)
  const params = new URLSearchParams(window.location.search);
  const email = params.get('email') || '';

  const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => `/ebook/pages/page-${i + 1}.png`);

  useEffect(() => {
    // Preload first few pages
    pages.slice(0, 5).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Track ebook download/access
  useEffect(() => {
    if (email) {
      api.trackEbookDownload(email).catch(() => {});
    }
  }, [email]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showViewer) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentPage((p) => Math.min(p + 1, TOTAL_PAGES));
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentPage((p) => Math.max(p - 1, 1));
      }
      if (e.key === 'Escape') {
        if (isFullscreen) setIsFullscreen(false);
        else setShowViewer(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showViewer, isFullscreen]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4aa]/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-20 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to EEC</span>
          </a>
          <div className="text-lg font-bold">
            <span className="text-[#00ff88]">EEC</span> Gaming
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10">
        {!showViewer ? (
          /* ===== SUCCESS VIEW ===== */
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl mx-auto text-center">
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="mb-8"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-[#00ff88]/10 border-2 border-[#00ff88] flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                  >
                    <CheckCircle className="w-12 h-12 text-[#00ff88]" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                  You're <span className="text-gradient">All Set!</span> 🎮
                </h1>
                <p className="text-lg sm:text-xl text-[#a0a0a0] mb-2">
                  Your EEC Playbook is ready to view and download.
                </p>
                {email && (
                  <div className="inline-flex items-center gap-2 text-sm text-[#00ff88] bg-[#00ff88]/10 rounded-full px-4 py-2 mt-2">
                    <Mail className="w-4 h-4" />
                    <span>We also sent a copy to <strong>{decodeURIComponent(email)}</strong></span>
                  </div>
                )}
              </motion.div>

              {/* Playbook Preview Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-12 bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden"
              >
                {/* Book Cover Preview */}
                <div className="relative aspect-[16/10] bg-gradient-to-br from-[#1a2a1a] to-[#0a0a0a] flex items-center justify-center overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/5 to-transparent" />
                  
                  {/* Try to show the first page as cover */}
                  <img 
                    src="/ebook/pages/page-1.png" 
                    alt="EEC Playbook Cover"
                    className="absolute inset-0 w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  
                  {/* Fallback cover design */}
                  <div className="relative z-10 text-center p-8">
                    <div className="text-6xl mb-4">📖</div>
                    <h3 className="text-2xl font-bold mb-2">The EEC Playbook</h3>
                    <p className="text-[#a0a0a0] text-sm">12 Pages of Actionable Gaming Creator Strategies</p>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                    <div className="flex items-center gap-2 text-white font-semibold bg-[#00ff88]/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-[#00ff88]/30">
                      <BookOpen className="w-5 h-5" />
                      Click to Preview
                    </div>
                  </div>

                  <button 
                    onClick={() => { setShowViewer(true); setCurrentPage(1); }}
                    className="absolute inset-0 z-30 cursor-pointer"
                    aria-label="Open ebook viewer"
                  />
                </div>

                {/* Action Buttons */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg" 
                      className="flex-1"
                      onClick={() => { setShowViewer(true); setCurrentPage(1); }}
                    >
                      <BookOpen className="w-5 h-5" />
                      View Playbook Online
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="flex-1"
                      href="/ebook/download/eec-playbook.zip"
                    >
                      <Download className="w-5 h-5" />
                      Download ZIP
                    </Button>
                  </div>

                  <p className="text-xs text-[#666] mt-4 text-center">
                    The ZIP contains all {TOTAL_PAGES} pages as high-resolution images.
                  </p>
                </div>
              </motion.div>

              {/* What's Next Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {[
                  { emoji: '📖', title: 'Read the Playbook', desc: 'Go through all 12 pages and take notes' },
                  { emoji: '🚀', title: 'Pick One Strategy', desc: 'Choose the strategy that fits your channel' },
                  { emoji: '📞', title: 'Book a Free Call', desc: 'Get a personalized plan from our team' },
                ].map((step, i) => (
                  <div 
                    key={i}
                    className="bg-[#1a1a1a] rounded-xl border border-white/10 p-6 text-center hover:border-[#00ff88]/30 transition-colors"
                  >
                    <div className="text-3xl mb-3">{step.emoji}</div>
                    <h4 className="font-semibold mb-1">{step.title}</h4>
                    <p className="text-sm text-[#a0a0a0]">{step.desc}</p>
                  </div>
                ))}
              </motion.div>

              {/* CTA to book call */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-12"
              >
                <Button 
                  variant="orange" 
                  size="lg"
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book a Free 15-Min Strategy Call
                </Button>
              </motion.div>
            </div>
          </div>
        ) : (
          /* ===== EBOOK VIEWER ===== */
          <div className="flex flex-col h-[calc(100vh-65px)]">
            {/* Viewer Toolbar */}
            <div className="bg-[#111] border-b border-white/10 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <button 
                onClick={() => setShowViewer(false)} 
                className="flex items-center gap-2 text-sm text-[#a0a0a0] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Overview
              </button>

              <div className="flex items-center gap-4">
                <span className="text-sm text-[#a0a0a0]">
                  Page <span className="text-white font-semibold">{currentPage}</span> of {TOTAL_PAGES}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-lg hover:bg-white/10 text-[#a0a0a0] hover:text-white transition-colors"
                  title="Toggle fullscreen"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <Button 
                  variant="outline" 
                  size="sm"
                  href="/ebook/download/eec-playbook.zip"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </div>
            </div>

            {/* Page Display */}
            <div className="flex-1 relative overflow-hidden bg-[#050505]">
              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage <= 1}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, TOTAL_PAGES))}
                disabled={currentPage >= TOTAL_PAGES}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image */}
              <div className={`h-full flex items-center justify-center p-4 ${isFullscreen ? 'p-0' : ''}`}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPage}
                    src={pages[currentPage - 1]}
                    alt={`Page ${currentPage}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                    className={`max-h-full rounded-lg shadow-2xl ${isFullscreen ? 'max-w-full object-contain' : 'max-w-full sm:max-w-3xl object-contain'}`}
                    onLoad={() => setImagesLoaded((prev) => ({ ...prev, [currentPage]: true }))}
                    onError={(e) => {
                      e.target.src = '';
                      e.target.alt = `Page ${currentPage} — Image not found. Add page-${currentPage}.png to /public/ebook/pages/`;
                    }}
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Page Scrubber */}
            <div className="bg-[#111] border-t border-white/10 px-4 py-3 flex-shrink-0">
              <div className="max-w-2xl mx-auto">
                <input
                  type="range"
                  min={1}
                  max={TOTAL_PAGES}
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-[#333] cursor-pointer accent-[#00ff88]"
                  style={{
                    background: `linear-gradient(to right, #00ff88 0%, #00ff88 ${((currentPage - 1) / (TOTAL_PAGES - 1)) * 100}%, #333 ${((currentPage - 1) / (TOTAL_PAGES - 1)) * 100}%, #333 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-[#666] mt-1">
                  <span>Page 1</span>
                  <span>Page {TOTAL_PAGES}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setIsFullscreen(false)}>
          <button 
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="w-5 h-5" />
          </button>
          <img 
            src={pages[currentPage - 1]} 
            alt={`Page ${currentPage}`}
            className="max-h-screen max-w-screen object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default SuccessPage;
