import React, { useState } from 'react';

export default function Navbar({ onNavigate, isFixed = true, className = '' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e, target) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(target);
      setMobileMenuOpen(false);
    }
  };

  // Close mobile menu on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className={`w-full bg-[#1e1e1e] ${isFixed ? 'sticky top-0 z-50' : 'relative z-30'} ${className}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 lg:px-[101px] h-[72px] sm:h-[80px] md:h-[113px] flex items-center justify-between">
        {/* Monogram Logo */}
        <a 
          href="/" 
          onClick={(e) => handleLinkClick(e, '/')}
          className="font-['Literata'] font-bold text-white text-[22px] md:text-[24.48px] tracking-tight hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
        >
          NDC
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-[40px] lg:gap-[64.47px]">
          <a
            href="/#work"
            onClick={(e) => handleLinkClick(e, '/#work')}
            className="font-['Literata'] font-normal text-white text-[18px] lg:text-[20.4px] transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          >
            work
          </a>
          <a
            href="/#about"
            onClick={(e) => handleLinkClick(e, '/#about')}
            className="font-['Literata'] font-normal text-white text-[18px] lg:text-[20.4px] transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          >
            about
          </a>
          <a
            href="/#resume"
            onClick={(e) => handleLinkClick(e, '/#resume')}
            className="font-['Literata'] font-normal text-white text-[18px] lg:text-[20.4px] transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          >
            resume
          </a>
          <a
            href="/#connect"
            onClick={(e) => handleLinkClick(e, '/#connect')}
            className="font-['Literata'] font-normal text-white text-[18px] lg:text-[20.4px] transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          >
            connect
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2.5 -mr-2 rounded-lg hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-colors"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <nav 
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="md:hidden bg-[#1e1e1e]/98 backdrop-blur-md border-b border-white/10 px-6 py-4 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <a
            href="/#work"
            onClick={(e) => handleLinkClick(e, '/#work')}
            className="font-['Literata'] text-white text-[18px] py-2 px-1 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          >
            work
          </a>
          <a
            href="/#about"
            onClick={(e) => handleLinkClick(e, '/#about')}
            className="font-['Literata'] text-white text-[18px] py-2 px-1 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          >
            about
          </a>
          <a
            href="/#resume"
            onClick={(e) => handleLinkClick(e, '/#resume')}
            className="font-['Literata'] text-white text-[18px] py-2 px-1 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          >
            resume
          </a>
          <a
            href="/#connect"
            onClick={(e) => handleLinkClick(e, '/#connect')}
            className="font-['Literata'] text-white text-[18px] py-2 px-1 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          >
            connect
          </a>
        </nav>
      )}
    </header>
  );
}
