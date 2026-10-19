import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';

const PHOTOGRAPHY_PHOTOS = [
  {
    id: 'carriage',
    src: '/assets/about me/image 242.png',
    alt: 'Sunset horse carriage on the beach',
    desktopStyle: {
      left: '24.53%',
      top: '6.75%',
      width: '16.17%',
      aspectRatio: '207 / 241',
    },
  },
  {
    id: 'flower',
    src: '/assets/about me/image 245.png',
    alt: 'Orange flower against the sky and green trees',
    desktopStyle: {
      left: '51.33%',
      top: '17.38%',
      width: '18.36%',
      aspectRatio: '235 / 157',
    },
  },
  {
    id: 'lantern',
    src: '/assets/about me/WhatsApp Image 2026-10-07 at 2.55.46 PM 1.png',
    alt: 'Pink lantern suspended on festive string against clear sky',
    desktopStyle: {
      left: '4.14%',
      top: '44.25%',
      width: '19.53%',
      aspectRatio: '250 / 167',
    },
  },
  {
    id: 'dslr-bird',
    src: '/assets/about me/WhatsApp Image 2026-10-07 at 2.55.47 PM 1.png',
    alt: 'Hands holding DSLR camera with bird on screen',
    desktopStyle: {
      left: '19.06%',
      top: '71.88%',
      width: '16.41%',
      aspectRatio: '210 / 187',
    },
  },
  {
    id: 'branch-bird',
    src: '/assets/about me/image 244.png',
    alt: 'Common myna bird perched on leafy tree branch',
    desktopStyle: {
      left: '46.72%',
      top: '72.88%',
      width: '18.44%',
      aspectRatio: '236 / 167',
    },
  },
  {
    id: 'girl-camera',
    src: '/assets/about me/image 246.png',
    alt: 'Girl holding camera photographing nature by the water',
    desktopStyle: {
      left: '75.63%',
      top: '39.50%',
      width: '18.20%',
      aspectRatio: '233 / 268',
    },
  },
];

export default function AboutPage({ onNavigate }) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (typeof IntersectionObserver === 'undefined') return true;
    return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  });
  const paragraphRef = useRef(null);

  // Section 3: Shared Sticky Stage & Scroll Crossfade state
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    photoOpacity: 1,
    poetryOpacity: 0,
    trackHeight: null,
  });

  // Photography pop-up animation state & shuffled order
  const [isPhotographyPopped, setIsPhotographyPopped] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (typeof IntersectionObserver === 'undefined') return true;
    return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  });

  const [photoOrder] = useState(() => {
    const indices = [0, 1, 2, 3, 4, 5];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const rankMap = {};
    indices.forEach((photoIdx, orderRank) => {
      rankMap[photoIdx] = orderRank;
    });
    return rankMap;
  });

  // Track prefers-reduced-motion dynamically
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Section 2: Story paragraph observer
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

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  // Section 3: Photography random pop-up observer on entering viewport
  useEffect(() => {
    if (isPhotographyPopped) return;

    const element = trackRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsPhotographyPopped(true);
            observer.unobserve(entry.target);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isPhotographyPopped]);

  // Section 3: Continuous scroll progress calculation for photography traversal & sticky crossfade
  useEffect(() => {
    let rafId = null;

    const updateScrollProgress = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();

      // Dynamically get exact header height matching Navbar breakpoints
      let headerH = 72;
      const w = window.innerWidth;
      if (w >= 1280) headerH = 113;
      else if (w >= 1024) headerH = 96;
      else if (w >= 768) headerH = 88;
      else if (w >= 640) headerH = 80;

      const availableH = window.innerHeight - headerH;

      // Section distance stages:
      // 1. Photography stage: generous distance to enjoy the complete photography composition (100% visible throughout)
      const photoStageDist = Math.max(1200, Math.round(availableH * 1.5));

      // 2. Crossfade transition: smooth hermite ease-in-out transition from photography to poetry
      const crossfadeDist = Math.max(650, Math.round(availableH * 0.8));

      // 3. Poetry stage: generous distance to enjoy the complete poetry layout (100% visible throughout)
      const poetryStageDist = Math.max(1200, Math.round(availableH * 1.5));

      const totalScrollDist = photoStageDist + crossfadeDist + poetryStageDist;
      // Generous track height so poetry remains fully pinned and visible even at the very bottom of the page
      const requiredTrackH = availableH + totalScrollDist + Math.round(availableH * 0.5);

      const scrolled = headerH - rect.top;

      let photoOpacity = 1;
      let poetryOpacity = 0;

      if (scrolled <= photoStageDist) {
        // Stage 1: Photography section
        // Keep photography content 100% visible throughout its section.
        // It does NOT fade out or hide when scrolling.
        photoOpacity = 1;
        poetryOpacity = 0;
      } else if (scrolled <= photoStageDist + crossfadeDist) {
        // Stage 2: Scroll-driven crossfade transition
        // Replaces photography with poetry ONLY at the intended transition point
        const t = (scrolled - photoStageDist) / crossfadeDist;
        const smoothT = t * t * (3 - 2 * t);
        photoOpacity = 1 - smoothT;
        poetryOpacity = smoothT;
      } else {
        // Stage 3: Poetry section
        // Keep poetry content 100% visible throughout its section.
        // It does NOT fade away or disappear.
        photoOpacity = 0;
        poetryOpacity = 1;
      }

      setScrollState({
        photoOpacity,
        poetryOpacity,
        trackHeight: requiredTrackH,
      });
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        updateScrollProgress();
        rafId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateScrollProgress(); // Initial measurement

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, []);

  const { photoOpacity, poetryOpacity, trackHeight } = scrollState;

  return (
    <div className="min-h-screen w-full bg-[#1e1e1e] text-white flex flex-col font-['Afacad_Flux',sans-serif] selection:bg-white/20 overflow-x-clip relative">
      {/* Fixed Dark Checkerboard Backdrop: Stationary relative to viewport across all scrolling */}
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

      {/* 2. Scrolling Content: Transparent body scrolling smoothly over fixed checkerboard */}
      <div className="w-full relative z-10 flex flex-col bg-transparent">
        {/* Section 1: Hero Section */}
        <section className="min-h-[calc(100vh-72px)] sm:min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-88px)] lg:min-h-[calc(100vh-96px)] xl:min-h-[calc(100vh-113px)] w-full relative flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-16 xl:px-[101px] py-12 lg:py-0">
          <div className="relative z-10 w-full max-w-[1080px] xl:max-w-[1100px] flex flex-col lg:flex-row items-start justify-between gap-10 sm:gap-12 lg:gap-16 xl:gap-24">
            
            {/* Left Column: Heading & Introductory Text matching reference screenshot */}
            <div className="flex flex-col items-start w-full min-w-0 lg:max-w-[520px] xl:max-w-[540px] pt-1">
              {/* Heading */}
              <h1 className="font-['Afacad_Flux',sans-serif] font-normal text-white text-[32px] sm:text-[36px] md:text-[38px] lg:text-[40px] leading-tight mb-6 sm:mb-8 tracking-tight">
                How Did I Get Here?
              </h1>

              {/* Introductory Text matching reference line breaks */}
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

        {/* Section 2: Large Introductory Paragraph Section with scroll-triggered fade-in animation */}
        <section id="story" className="min-h-screen w-full relative flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-16 xl:px-[101px] py-20 lg:py-0">
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

        {/* Section 3: Shared Sticky Stage with Scroll Crossfade from Photography to Poetry */}
        <section
          id="creative-work"
          ref={trackRef}
          className="w-full relative min-h-[480vh] [--header-height:72px] sm:[--header-height:80px] md:[--header-height:88px] lg:[--header-height:96px] xl:[--header-height:113px]"
          style={{ minHeight: trackHeight ? `${trackHeight}px` : undefined }}
        >
          {/* Sticky Viewport Stage beneath Navigation/Header */}
          <div
            ref={stageRef}
            className="sticky top-[var(--header-height)] w-full h-[calc(100vh-var(--header-height))] flex items-center justify-center overflow-hidden px-4 sm:px-6 md:px-8"
          >
            {/* Desktop & Tablet Shared Stage Container (Restored original proportions & dimensions) */}
            <div 
              className="hidden md:block relative mx-auto aspect-[1440/1024]"
              style={{
                width: 'min(100%, calc((100vh - var(--header-height) - 40px) * (1440 / 1024)))',
                maxWidth: '1440px',
              }}
            >
              {/* Layer 1: Photography Constellation Layout */}
              <div
                data-layer="photography"
                className="absolute inset-0 size-full will-change-[opacity] flex items-center justify-center select-none"
                style={{
                  opacity: photoOpacity,
                  pointerEvents: photoOpacity > 0.5 ? 'auto' : 'none',
                  visibility: photoOpacity <= 0 ? 'hidden' : 'visible',
                }}
              >
                <div className="relative w-full aspect-[1280/800] max-h-full">
                  {/* Central Heading & Supporting Text */}
                  <div
                    className={`absolute z-10 transition-all duration-[800ms] ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${
                      isPhotographyPopped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{
                      left: '34.38%',
                      top: '48.38%',
                      width: '38%',
                      maxWidth: '460px',
                      transitionDuration: '800ms',
                      transitionDelay: '150ms',
                    }}
                  >
                    <h2 className="font-['Afacad_Flux',sans-serif] font-normal text-white text-[20px] sm:text-[24px] md:text-[26px] lg:text-[30px] xl:text-[34px] leading-[1.18] tracking-tight mb-1.5 sm:mb-2">
                      <span className="block whitespace-nowrap">Everyday things through a</span>
                      <span className="block whitespace-nowrap">different perspective</span>
                    </h2>
                    <p className="font-['Afacad_Flux',sans-serif] font-normal text-[#b3a3a3] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] leading-normal whitespace-nowrap">
                      Noticing unnoticed details, compositions & frames
                    </p>
                  </div>

                  {/* All Six Photos with randomized individual spring pop-up */}
                  {PHOTOGRAPHY_PHOTOS.map((photo, index) => {
                    const delay = (photoOrder[index] ?? index) * 130;
                    return (
                      <div
                        key={photo.id}
                        className="absolute overflow-hidden select-none"
                        style={{
                          ...photo.desktopStyle,
                          transition: prefersReducedMotion
                            ? 'opacity 200ms ease'
                            : 'opacity 600ms cubic-bezier(0.34, 1.4, 0.64, 1), transform 600ms cubic-bezier(0.34, 1.4, 0.64, 1)',
                          transitionDelay: prefersReducedMotion ? '0ms' : `${delay}ms`,
                          opacity: isPhotographyPopped ? 1 : 0,
                          transform: isPhotographyPopped || prefersReducedMotion ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(18px)',
                          willChange: 'transform, opacity',
                        }}
                      >
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          className="w-full h-full object-cover block select-none pointer-events-none"
                          draggable={false}
                          loading="eager"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Layer 2: Poetry & Anthologies Constellation Layout */}
              <div
                data-layer="poetry"
                className="absolute inset-0 size-full will-change-[opacity] select-none"
                style={{
                  opacity: poetryOpacity,
                  pointerEvents: poetryOpacity > 0.5 ? 'auto' : 'none',
                  visibility: poetryOpacity <= 0 ? 'hidden' : 'visible',
                }}
              >
                {/* Top-Left Image: Sand Castles & Paper Boats Anthology Cover */}
                <div
                  className="absolute overflow-hidden select-none"
                  style={{
                    left: '11.04%',
                    top: '9.47%',
                    width: '26.88%',
                    aspectRatio: '387 / 290',
                  }}
                >
                  <img
                    src="/assets/about me/sand castles and paper boats.png"
                    alt="Sand Castles & Paper Boats anthology cover"
                    className="w-full h-full object-cover block select-none pointer-events-none"
                    draggable={false}
                    loading="eager"
                  />
                </div>

                {/* Top-Right Caption: Snippets - poem: “How do you write your poem” */}
                <div
                  className="absolute select-none"
                  style={{
                    left: '61.39%',
                    top: '7.52%',
                  }}
                >
                  <p className="font-['Afacad_Flux',sans-serif] font-normal text-[#b3a3a3] text-[15px] sm:text-[16px] md:text-[17px] leading-normal tracking-normal whitespace-nowrap">
                    Snippets - poem: “How do you write your poem”
                  </p>
                </div>

                {/* Top-Right Poem: "How do you write your poem" */}
                <div
                  className="absolute overflow-hidden select-none"
                  style={{
                    left: '63.13%',
                    top: '11.43%',
                    width: '23.89%',
                    aspectRatio: '344 / 270',
                  }}
                >
                  <img
                    src="/assets/about me/how do you write your poem.png"
                    alt="Poem excerpt - How do you write your poem"
                    className="w-full h-full object-cover block select-none pointer-events-none"
                    draggable={false}
                    loading="eager"
                  />
                </div>

                {/* Center: Heading & Supporting Text */}
                <div
                  className="absolute z-10"
                  style={{
                    left: '34.58%',
                    top: '48.63%',
                    width: '30.21%',
                    maxWidth: '440px',
                  }}
                >
                  <h2 className="font-['Afacad_Flux',sans-serif] font-normal text-white text-[28px] sm:text-[34px] md:text-[38px] lg:text-[40px] leading-tight tracking-tight mb-2 sm:mb-3 whitespace-nowrap">
                    Co-authored 2 anthologies
                  </h2>
                  <p className="font-['Afacad_Flux',sans-serif] font-normal text-[#b3a3a3] text-[18px] sm:text-[20px] md:text-[21px] lg:text-[22px] leading-[1.38] tracking-normal">
                    Seeing the world through people’s eyes
                    <br />
                    and what they feel
                  </p>
                </div>

                {/* Bottom-Left Poem: "cursed" */}
                <div
                  className="absolute overflow-hidden select-none"
                  style={{
                    left: '11.39%',
                    top: '66.60%',
                    width: '23.19%',
                    aspectRatio: '334 / 261',
                  }}
                >
                  <img
                    src="/assets/about me/poem cursed.png"
                    alt="Poem excerpt - cursed"
                    className="w-full h-full object-cover block select-none pointer-events-none"
                    draggable={false}
                    loading="eager"
                  />
                </div>

                {/* Bottom-Left Caption: Snippets - poem: cursed */}
                <div
                  className="absolute select-none"
                  style={{
                    left: '14.44%',
                    top: '93.65%',
                  }}
                >
                  <p className="font-['Afacad_Flux',sans-serif] font-normal text-[#b3a3a3] text-[15px] sm:text-[16px] md:text-[17px] leading-normal tracking-normal whitespace-nowrap">
                    Snippets - poem: cursed
                  </p>
                </div>

                {/* Bottom-Right Image: Surreal Moments Anthology Cover */}
                <div
                  className="absolute overflow-hidden select-none"
                  style={{
                    left: '61.18%',
                    top: '60.55%',
                    width: '27.78%',
                    aspectRatio: '400 / 296',
                  }}
                >
                  <img
                    src="/assets/about me/surreal moments.png"
                    alt="Surreal Moments anthology cover"
                    className="w-full h-full object-cover block select-none pointer-events-none"
                    draggable={false}
                    loading="eager"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Shared Stage Container (< md screens) */}
            <div className="md:hidden relative w-full max-w-[600px] mx-auto px-5 sm:px-8 py-8 grid grid-cols-1 grid-rows-1 items-center select-none">
              {/* Layer 1: Photography Mobile Layout */}
              <div
                className="col-start-1 row-start-1 w-full flex flex-col items-center justify-center will-change-[opacity]"
                style={{
                  opacity: photoOpacity,
                  pointerEvents: photoOpacity > 0.5 ? 'auto' : 'none',
                  visibility: photoOpacity <= 0 ? 'hidden' : 'visible',
                }}
              >
                {/* Central Heading & Subtitle on mobile */}
                <div
                  className={`mb-6 sm:mb-8 text-center transition-all duration-[800ms] ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${
                    isPhotographyPopped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <h2 className="font-['Afacad_Flux',sans-serif] font-normal text-white text-[24px] sm:text-[28px] leading-tight mb-2">
                    Everyday things through a <br />
                    different perspective
                  </h2>
                  <p className="font-['Afacad_Flux',sans-serif] font-normal text-[#b3a3a3] text-[15px] sm:text-[17px] leading-normal">
                    Noticing unnoticed details, compositions & frames
                  </p>
                </div>

                {/* 2-column collage of photos on mobile */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                  {PHOTOGRAPHY_PHOTOS.map((photo, index) => {
                    const delay = (photoOrder[index] ?? index) * 130;
                    return (
                      <div
                        key={photo.id}
                        className="w-full overflow-hidden select-none"
                        style={{
                          aspectRatio: photo.desktopStyle.aspectRatio,
                          transition: prefersReducedMotion
                            ? 'opacity 200ms ease'
                            : 'opacity 600ms cubic-bezier(0.34, 1.4, 0.64, 1), transform 600ms cubic-bezier(0.34, 1.4, 0.64, 1)',
                          transitionDelay: prefersReducedMotion ? '0ms' : `${delay}ms`,
                          opacity: isPhotographyPopped ? 1 : 0,
                          transform: isPhotographyPopped || prefersReducedMotion ? 'scale(1) translateY(0)' : 'scale(0.82) translateY(18px)',
                          willChange: 'transform, opacity',
                        }}
                      >
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          className="w-full h-full object-cover block select-none pointer-events-none"
                          draggable={false}
                          loading="eager"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Layer 2: Poetry Mobile Layout */}
              <div
                className="col-start-1 row-start-1 w-full flex flex-col items-center justify-center will-change-[opacity]"
                style={{
                  opacity: poetryOpacity,
                  pointerEvents: poetryOpacity > 0.5 ? 'auto' : 'none',
                  visibility: poetryOpacity <= 0 ? 'hidden' : 'visible',
                }}
              >
                {/* Central Heading & Supporting Text on mobile */}
                <div className="mb-8 sm:mb-10 text-center flex flex-col items-center">
                  <h2 className="font-['Afacad_Flux',sans-serif] font-normal text-white text-[28px] sm:text-[32px] leading-tight mb-2 sm:mb-3">
                    Co-authored 2 anthologies
                  </h2>
                  <p className="font-['Afacad_Flux',sans-serif] font-normal text-[#b3a3a3] text-[18px] sm:text-[20px] leading-[1.38]">
                    Seeing the world through people’s eyes
                    <br />
                    and what they feel
                  </p>
                </div>

                {/* 2-Column Responsive Layout for Anthologies & Poems on mobile */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full items-start">
                  {/* Left Column: Sand Castles (top) & Cursed Poem + Caption below (bottom) */}
                  <div className="flex flex-col gap-6 sm:gap-8">
                    <div className="w-full overflow-hidden select-none" style={{ aspectRatio: '387 / 290' }}>
                      <img
                        src="/assets/about me/sand castles and paper boats.png"
                        alt="Sand Castles & Paper Boats anthology cover"
                        className="w-full h-full object-cover block select-none pointer-events-none"
                        draggable={false}
                        loading="eager"
                      />
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="w-full overflow-hidden select-none" style={{ aspectRatio: '334 / 261' }}>
                        <img
                          src="/assets/about me/poem cursed.png"
                          alt="Poem excerpt - cursed"
                          className="w-full h-full object-cover block select-none pointer-events-none"
                          draggable={false}
                          loading="eager"
                        />
                      </div>
                      <p className="font-['Afacad_Flux',sans-serif] font-normal text-[#b3a3a3] text-[13px] sm:text-[14px] text-center leading-tight">
                        Snippets - poem: cursed
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Caption above + How do you write poem (top) & Surreal Moments (bottom) */}
                  <div className="flex flex-col gap-6 sm:gap-8">
                    <div className="flex flex-col items-center gap-2">
                      <p className="font-['Afacad_Flux',sans-serif] font-normal text-[#b3a3a3] text-[13px] sm:text-[14px] text-center leading-tight">
                        Snippets - poem: “How do you write your poem”
                      </p>
                      <div className="w-full overflow-hidden select-none" style={{ aspectRatio: '344 / 270' }}>
                        <img
                          src="/assets/about me/how do you write your poem.png"
                          alt="Poem excerpt - How do you write your poem"
                          className="w-full h-full object-cover block select-none pointer-events-none"
                          draggable={false}
                          loading="eager"
                        />
                      </div>
                    </div>

                    <div className="w-full overflow-hidden select-none" style={{ aspectRatio: '400 / 296' }}>
                      <img
                        src="/assets/about me/surreal moments.png"
                        alt="Surreal Moments anthology cover"
                        className="w-full h-full object-cover block select-none pointer-events-none"
                        draggable={false}
                        loading="eager"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
