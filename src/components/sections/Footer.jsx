import { Link, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features', anchor: true },
      { label: 'Pricing', href: '#pricing', anchor: true },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Testimonials', href: '/testimonials' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '#cta', anchor: true },
    ],
    resources: [
      { label: 'Playbook', href: '#cta', anchor: true },
      { label: 'Guides', href: '/guides' },
      { label: 'Templates', href: '/templates' },
      { label: 'Webinars', href: '/webinars' },
    ],
    legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
    ],
  };

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00d4aa] flex items-center justify-center">
                <span className="text-[#0a0a0a] font-bold text-xl">E</span>
              </div>
              <span className="font-bold text-xl">EEC</span>
            </Link>
            <p className="text-[#a0a0a0] text-sm mb-6 max-w-xs">
              Helping gaming creators own their audience and build sustainable
              businesses beyond the algorithm.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={isHomePage ? '#cta' : '/#cta'}
                aria-label="Contact us"
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#a0a0a0] hover:bg-[#00ff88]/10 hover:text-[#00ff88] transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4 capitalize">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.anchor ? (
                      <a
                        href={isHomePage ? link.href : `/${link.href}`}
                        className="text-sm text-[#a0a0a0] hover:text-[#00ff88] transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-[#a0a0a0] hover:text-[#00ff88] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#666]">
            © {currentYear} EEC - Email Engagement Community. All rights reserved.
          </p>
          <p className="text-sm text-[#666]">
            Built for creators, by creators. 🎮
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
