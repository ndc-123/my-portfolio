import React, { useState, useEffect } from 'react';

export default function JumpToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button once the user scrolls down 350px
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label="Jump to top"
      title="Jump to top"
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-12 h-12 sm:w-[50px] sm:h-[50px] rounded-full bg-[#1e1e1e]/90 hover:bg-[#2c2c2c] active:scale-95 text-white border border-white/20 hover:border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.7)] backdrop-blur-md flex items-center justify-center transition-all duration-300 ease-out group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-75 pointer-events-none'
      }`}
    >
      <svg
        className="w-5 h-5 text-white transform group-hover:-translate-y-1 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
