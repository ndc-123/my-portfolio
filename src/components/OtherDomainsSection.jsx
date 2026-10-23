import React, { useState, useEffect, useRef } from 'react';

// The 5 domain cards and their corresponding category mappings
const DOMAIN_CARDS = [
  {
    id: 'krea',
    name: 'Krea',
    title: 'Agentic AI',
    url: 'https://www.behance.net/gallery/255997481/Krea-Making-Space-for-What-Matters',
    image: '/assets/domain-krea.png',
    alt: 'Krea Creativity',
    imageClass: 'absolute h-[100.07%] left-[-21.39%] max-w-none top-[-0.04%] w-[143.07%] object-cover pointer-events-none rounded-[inherit]',
  },
  {
    id: 'ai-chatbots',
    name: 'AI Chatbots',
    title: 'Research Paper',
    url: 'https://drive.google.com/file/d/1aTBdkdGDK4nvsTl1PMGnRa8N7yeqqKPr/view',
    image: '/assets/domain-229.png',
    alt: 'Topic Exploration',
    imageClass: 'absolute inset-0 max-w-none object-cover pointer-events-none rounded-[inherit] size-full',
  },
  {
    id: 'info-vis',
    name: 'Info Vis',
    title: 'Information Visualisation',
    url: 'https://drive.google.com/file/d/1WwJkiVk9lwl07cfe4WrAuaC-ozQK08eu/view',
    image: '/assets/domain-156.png',
    alt: 'Information Visualization',
    imageClass: 'absolute h-[106.8%] left-[-21.39%] max-w-none top-[-4.13%] w-[143.07%] object-cover pointer-events-none rounded-[inherit]',
  },
  {
    id: 'eva',
    name: 'Eva',
    title: 'Agentic AI',
    url: 'https://www.behance.net/gallery/244027267/Eva-Agentic-AI-Companion-Design-(Samsung-Hackathon)',
    image: '/assets/domain-eva.png',
    alt: 'Hey Eva',
    imageClass: 'absolute h-full left-[-19.56%] max-w-none top-0 w-[141.94%] object-cover pointer-events-none rounded-[inherit]',
  },
  {
    id: 'consumer-behaviour',
    name: 'Consumer Behaviour',
    title: 'Behavioral Psychology',
    url: 'https://www.behance.net/gallery/244590121/The-Social-Psychology-of-Intimate-Clothing',
    image: '/assets/domain-227.png',
    alt: 'Consumer Behaviour',
    imageClass: 'absolute inset-0 max-w-none object-cover pointer-events-none rounded-[inherit] size-full',
  },
];

// 5 repeated sets for seamless infinite horizontal carousel scrolling
const TOTAL_SETS = 5;
const REPEATED_CARDS = Array.from({ length: TOTAL_SETS }, () => DOMAIN_CARDS).flat();
const INITIAL_INDEX = 10; // Start at the middle set (Card 0: Krea)

export default function OtherDomainsSection() {
  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);
  const [withTransition, setWithTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(
    typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 1312) : 1312
  );

  // Measure container width responsively
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Faster automatic horizontal carousel progression every 1.3 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setWithTransition(true);
      setCurrentIndex((prev) => prev + 1);
    }, 1300);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Seamless boundary wrap without visual jump
  useEffect(() => {
    if (currentIndex >= 20) {
      const timer = setTimeout(() => {
        setWithTransition(false);
        setCurrentIndex(INITIAL_INDEX + (currentIndex % DOMAIN_CARDS.length));
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setWithTransition(true);
          });
        });
      }, 460);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const activeRealIndex = currentIndex % DOMAIN_CARDS.length;
  const activeCard = DOMAIN_CARDS[activeRealIndex];

  // Dynamic layout calculations for smooth horizontal conveyor centering
  const isSmallMobile = containerWidth < 400;
  const isMobile = containerWidth < 768;
  const cardWidth = isSmallMobile
    ? Math.max(220, Math.round(containerWidth * 0.72))
    : isMobile
    ? Math.min(290, Math.round(containerWidth * 0.75))
    : 305;
  const cardHeight = Math.round(cardWidth * (306 / 381));
  const gap = isMobile ? (isSmallMobile ? 14 : 20) : 26;
  const step = cardWidth + gap;
  const translateX = containerWidth / 2 - (currentIndex * step + cardWidth / 2);

  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isSwipingRef = useRef(false);

  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isSwipingRef.current = false;
  };

  const handleTouchMove = (e) => {
    const deltaX = e.touches[0].clientX - touchStartXRef.current;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isSwipingRef.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    if (isSwipingRef.current) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      if (deltaX < -30) {
        // Swiped left -> advance
        setWithTransition(true);
        setCurrentIndex((prev) => prev + 1);
      } else if (deltaX > 30) {
        // Swiped right -> go back
        setWithTransition(true);
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
    }
    setTimeout(() => setIsPaused(false), 2000);
  };

  const handleCardClick = (index) => {
    setWithTransition(true);
    setCurrentIndex(index);
  };

  return (
    <section className="w-full bg-[#1e1e1e] py-[60px] sm:py-[75px] md:py-[95px] xl:py-[105px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-[52px] overflow-hidden">
      {/* Scoped CSS animation for smooth, flicker-free label cross-fade */}
      <style>{`
        @keyframes domainLabelFade {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-[1200px] xl:max-w-[1280px] 2xl:max-w-[1380px] mx-auto flex flex-col items-center">
        
        {/* Section Heading */}
        <h2 className="w-full text-left font-['Afacad_Flux'] font-normal text-white text-[24px] sm:text-[32px] md:text-[40px] leading-tight mb-6 sm:mb-8 md:mb-[58px]">
          Check out other domains I’ve explored
        </h2>

        {/* Carousel Viewport Container with Touch Swiping */}
        <div 
          ref={containerRef}
          className="relative w-full max-w-[1200px] xl:max-w-[1280px] 2xl:max-w-[1380px] h-[240px] sm:h-[280px] md:h-[310px] lg:h-[330px] xl:h-[345px] select-none flex items-center justify-center overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Continuous Horizontal Moving Track */}
          <div
            className="flex items-center absolute left-0"
            style={{
              gap: `${gap}px`,
              transform: `translateX(${translateX}px)`,
              transition: withTransition
                ? 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1)'
                : 'none',
            }}
          >
            {REPEATED_CARDS.map((card, index) => {
              const distance = Math.abs(index - currentIndex);
              const isCenter = distance === 0;

              return (
                <a
                  key={`${card.id}-${index}`}
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (isSwipingRef.current) {
                      e.preventDefault();
                      return;
                    }
                    handleCardClick(index);
                  }}
                  className={`shrink-0 overflow-hidden bg-[#252525] select-none relative block custom-orange-cursor no-underline ${
                    isCenter ? '' : 'hover:brightness-110'
                  }`}
                  data-cursor="view"
                  style={{
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                    borderRadius: isCenter ? '12.22px' : '8px',
                    border: isCenter ? '1.11px solid #ffffff' : '1.11px solid transparent',
                    boxShadow: isCenter
                      ? '0 25px 50px -12px rgba(0, 0, 0, 0.45)'
                      : '0 10px 15px -3px rgba(0, 0, 0, 0.25)',
                    transform: isCenter
                      ? 'scale(1.08)'
                      : distance === 1
                      ? 'scale(0.88)'
                      : 'scale(0.78)',
                    opacity: isCenter ? 1 : distance === 1 ? 0.78 : 0.45,
                    zIndex: isCenter ? 30 : distance === 1 ? 20 : 10,
                    transition: withTransition
                      ? 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1), opacity 450ms cubic-bezier(0.25, 1, 0.5, 1), border 450ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 450ms cubic-bezier(0.25, 1, 0.5, 1), border-radius 450ms cubic-bezier(0.25, 1, 0.5, 1)'
                      : 'none',
                  }}
                  aria-label={`${card.name} (${card.title})`}
                >
                  <img
                    src={card.image}
                    alt={card.alt}
                    className={card.imageClass}
                  />
                </a>
              );
            })}
          </div>
        </div>

        {/* Domain Label: Synchronized with the currently active featured card */}
        <div className="w-full flex justify-center mt-5 h-[42px] items-center">
          <p
            key={activeCard.id}
            className="font-['Afacad_Flux'] font-normal text-white text-[18px] sm:text-[22px] md:text-[25px] tracking-normal select-none"
            style={{ animation: 'domainLabelFade 280ms ease-out' }}
          >
            {activeCard.title}
          </p>
        </div>

      </div>
    </section>
  );
}
