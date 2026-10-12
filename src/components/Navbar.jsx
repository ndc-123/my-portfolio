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

  return (
    <header className={`w-full bg-[#1e1e1e] ${isFixed ? 'sticky top-0 z-50' : 'relative z-30'} ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[101px] h-[80px] md:h-[113px] flex items-center justify-between">
        {/* Monogram Logo */}
        <a 
          href="/" 
          onClick={(e) => handleLinkClick(e, '/')}
          className="font-['Literata'] font-bold text-white text-[22px] md:text-[24.48px] tracking-tight hover:opacity-90 transition-opacity"
        >
          NDC
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-[40px] lg:gap-[64.47px]">
          <a
            href="/#work"
            onClick={(e) => handleLinkClick(e, '/#work')}
            className="font-['Literata'] font-normal text-white text-[18px] lg:text-[20.4px] transition-colors"
          >
            work
          </a>
          <a
            href="/#about"
            onClick={(e) => handleLinkClick(e, '/#about')}
            className="font-['Literata'] font-normal text-white text-[18px] lg:text-[20.4px] transition-colors"
          >
            about
          </a>
          <a
            href="/#resume"
            onClick={(e) => handleLinkClick(e, '/#resume')}
            className="font-['Literata'] font-normal text-white text-[18px] lg:text-[20.4px] transition-colors"
          >
            resume
          </a>
          <a
            href="/#connect"
            onClick={(e) => handleLinkClick(e, '/#connect')}
            className="font-['Literata'] font-normal text-white text-[18px] lg:text-[20.4px] transition-colors"
          >
            connect
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="md:hidden bg-[#1e1e1e] border-b border-white/10 px-6 py-4 flex flex-col gap-4">
          <a
            href="/#work"
            onClick={(e) => handleLinkClick(e, '/#work')}
            className="font-['Literata'] text-white text-[18px]"
          >
            work
          </a>
          <a
            href="/#about"
            onClick={(e) => handleLinkClick(e, '/#about')}
            className="font-['Literata'] text-white text-[18px]"
          >
            about
          </a>
          <a
            href="/#resume"
            onClick={(e) => handleLinkClick(e, '/#resume')}
            className="font-['Literata'] text-white text-[18px]"
          >
            resume
          </a>
          <a
            href="/#connect"
            onClick={(e) => handleLinkClick(e, '/#connect')}
            className="font-['Literata'] text-white text-[18px]"
          >
            connect
          </a>
        </div>
      )}
    </header>
  );
}
