import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '../sections/Footer';

const PageLayout = ({ children, title, subtitle }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00d4aa]/5 rounded-full blur-[120px]" />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-20 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to EEC</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00d4aa] flex items-center justify-center">
              <span className="text-[#0a0a0a] font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-lg">EEC</span>
          </Link>
        </div>
      </nav>

      {/* Page Header */}
      {title && (
        <div className="relative z-10 border-b border-white/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-[#a0a0a0] max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PageLayout;
