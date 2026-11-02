import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import PhotoRoomSection from './PhotoRoomSection';
import FooterSection from './FooterSection';

export default function AboutPage({ onNavigate }) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (typeof IntersectionObserver === 'undefined') return true;
    return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  });
  const paragraphRef = useRef(null);

  // Dynamic document title
  useEffect(() => {
    document.title = 'About Me — Neha Chaware';
  }, []);

  // Story paragraph observer
  useEffect(() => {
    if (isVisible) return;
    const element = paragraphRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div className="min-h-screen w-full bg-[#1e1e1e] text-white flex flex-col font-['Afacad_Flux',sans-serif] selection:bg-white/20 overflow-x-clip relative">
      {/* Fixed Dark Checkerboard Backdrop */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundColor: '#1d1d1d',
          backgroundImage: `conic-gradient(
            #222222 90deg, 
            #1d1d1d 90deg 180deg, 
            #222222 180deg 270deg, 
            #1d1d1d 270deg
          )`,
          backgroundSize: '160px 160px',
        }}
        aria-hidden="true"
      />

      {/* 1. Header Navigation: Sticky solid charcoal background (#1e1e1e, z-50) */}
      <Navbar onNavigate={onNavigate} isFixed={true} activePage="about" />

      {/* 2. Scrolling Content */}
      <div className="w-full relative z-10 flex flex-col bg-transparent">
        
        {/* Section: 3D Virtual Photo Room Exhibition */}
        <section aria-label="3D Photo Exhibition Room" className="w-full relative z-20">
          <PhotoRoomSection />
        </section>

        {/* Section 1: Hero Section ("How Did I Get Here?") */}
        <section className="min-h-[calc(100vh-72px)] sm:min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-88px)] lg:min-h-[calc(100vh-96px)] xl:min-h-[calc(100vh-113px)] w-full relative flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-16 xl:px-[101px] py-16 lg:py-24">
          <div className="relative z-10 w-full max-w-[1080px] xl:max-w-[1100px] flex flex-col lg:flex-row items-start justify-between gap-10 sm:gap-12 lg:gap-16 xl:gap-24">
            
            {/* Left Column: Heading & Introductory Text */}
            <div className="flex flex-col items-start w-full min-w-0 lg:max-w-[520px] xl:max-w-[540px] pt-1">
              <h1 className="font-['Afacad_Flux',sans-serif] font-normal text-white text-[32px] sm:text-[36px] md:text-[38px] lg:text-[40px] leading-tight mb-6 sm:mb-8 tracking-tight">
                How Did I Get Here?
              </h1>

              <p className="font-['Afacad_Flux',sans-serif] font-normal text-white text-[18px] sm:text-[20px] md:text-[21px] lg:text-[22px] leading-[1.48] sm:leading-[1.52] max-w-[490px]">
                I love understanding why, asking questions and{' '}
                <br className="hidden sm:inline" />
                exploring new stuff that’s coming up. I seek to{' '}
                <br className="hidden sm:inline" />
                understand people, their behaviour and making{' '}
                <br className="hidden sm:inline" />
                experiences meaningful
              </p>
            </div>

            {/* Right Column: Childhood photo on laptop */}
            <div className="shrink-0 flex items-center justify-center w-full sm:w-auto">
              <div className="w-[280px] sm:w-[320px] md:w-[350px] lg:w-[380px] max-w-full rounded-[14px] sm:rounded-[16px] overflow-hidden shadow-2xl">
                <img 
                  src="/laptop.jpg" 
                  alt="Childhood photo working on laptop" 
                  className="w-full h-auto object-contain select-none pointer-events-none block" 
                  draggable={false} 
                />
              </div>
            </div>

          </div>
        </section>

        {/* Section 2: Large Introductory Paragraph Section */}
        <section id="story" className="min-h-[60vh] w-full relative flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-16 xl:px-[101px] py-20 lg:py-24">
          <div className="relative z-10 w-full max-w-[1080px] xl:max-w-[1100px] flex items-center justify-start">
            <p
              ref={paragraphRef}
              className={`font-['Afacad_Flux',sans-serif] font-normal text-[#b3a3a3] text-[22px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] leading-[1.45] sm:leading-[1.48] lg:leading-[1.5] tracking-normal transition-all duration-[800ms] ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-[20px] pointer-events-none'
              }`}
              style={{
                transitionDuration: '800ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              As a kid I was always fascinated by technology. From the{' '}
              <br className="hidden md:inline" />
              customization of the screen saver to the origami bird{' '}
              <br className="hidden md:inline" />
              transition between 2 slides in PowerPoint, every{' '}
              <br className="hidden md:inline" />
              discovery amazed me. I began noticing how baking{' '}
              <br className="hidden md:inline" />
              websites had a jump to recipe button. One day I{' '}
              <br className="hidden md:inline" />
              stopped for the first time to see “skip ad” being replaced{' '}
              <br className="hidden md:inline" />
              by “miss out on your favourite content”. I’ve been drawn{' '}
              <br className="hidden md:inline" />
              to UX before even knowing what it was
            </p>
          </div>
        </section>

        {/* 3. Let's Connect Footer */}
        <FooterSection onNavigate={onNavigate} />
      </div>
    </div>
  );
}
