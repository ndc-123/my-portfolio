import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import FooterSection from './FooterSection';
import { CASE_STUDIES } from '../data/caseStudies';

export default function CaseStudyPage({ projectId, onNavigate }) {
  const project = CASE_STUDIES[projectId];
  const [activeSection, setActiveSection] = useState(
    project?.sections?.[0]?.id || 'overview'
  );

  // Measure top offset dynamically for smooth scrolling (no top nav on desktop, mobile has sticky bar)
  const getNavOffset = () => {
    return window.innerWidth >= 1024 ? 20 : 44;
  };

  // Smooth scroll to a target section
  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const offset = getNavOffset();
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
    setActiveSection(sectionId);
  };

  // ScrollSpy to highlight the active section dynamically
  useEffect(() => {
    if (!project) return;

    const handleScroll = () => {

      const offset = getNavOffset() + 20;
      const scrollPos = window.scrollY + offset;

      for (let i = project.sections.length - 1; i >= 0; i--) {
        const sec = project.sections[i];
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col font-['Afacad_Flux']">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center pt-24">
          <h1 className="text-3xl font-normal mb-4">Project Not Found</h1>
          <p className="text-white/60 mb-6">The requested case study does not exist.</p>
          <button
            onClick={() => onNavigate('/')}
            className="px-6 py-2.5 rounded-lg bg-white text-[#1e1e1e] font-medium hover:bg-gray-100 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
        <FooterSection />
      </div>
    );
  }

  // Determine next project for bottom footer link
  const projectKeys = Object.keys(CASE_STUDIES);
  const currentIndex = projectKeys.indexOf(projectId);
  const nextProjectKey = projectKeys[(currentIndex + 1) % projectKeys.length];
  const nextProject = CASE_STUDIES[nextProjectKey];

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white flex flex-col font-['Afacad_Flux'] selection:bg-white/20 overflow-x-clip">
      {/* 1. Non-fixed Top Navigation Bar (scrolls away naturally) */}
      <Navbar onNavigate={onNavigate} isFixed={false} />

      {/* 2. Mobile / Tablet Sticky Section Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#1e1e1e]/95 backdrop-blur-md border-b border-white/10 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onNavigate('/#work')}
          className="shrink-0 text-white/50 hover:text-white text-[13px] flex items-center gap-1 mr-1 pr-2.5 border-r border-white/10"
        >
          ← Selected Work
        </button>
        {project.sections.map((section, idx) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => handleScrollToSection(section.id)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[12.5px] transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-[#1e1e1e] font-medium shadow-sm'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="opacity-60 mr-1">{idx + 1}.</span>
              {section.label}
            </button>
          );
        })}
      </div>

      {/* 2. Main Case Study Layout (Sticky Sidebar + Image Track) */}
      <div className="w-full max-w-[1536px] 2xl:max-w-[1600px] mx-auto pt-3 lg:pt-5 pb-8 px-2 sm:px-4 md:px-6 lg:pl-6 lg:pr-4 xl:pl-8 xl:pr-6 flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-8 relative items-start">
        
        {/* Left Sticky Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-[190px] xl:w-[220px] shrink-0 sticky top-5 self-start py-1 z-30">
          
          {/* Back Link */}
          <button
            onClick={() => onNavigate('/#work')}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-[16px] xl:text-[17px] mb-4 group self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform text-[18px]">←</span>
            <span>Selected Work</span>
          </button>

          {/* Section Navigation Links (Max 5) */}
          <nav className="flex flex-col relative border-l border-white/10 pl-3.5 space-y-1.5" aria-label="Case study sections">
            {project.sections.map((section, idx) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => handleScrollToSection(section.id)}
                  className={`text-left text-[15.5px] xl:text-[16.5px] py-1 transition-all relative flex items-start group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm ${
                    isActive
                      ? 'text-white font-medium'
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  <div className="flex items-baseline gap-2.5">
                    <span
                      className={`text-[12.5px] xl:text-[13px] font-mono shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-white/30 group-hover:text-white/60'
                      }`}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="leading-snug">{section.label}</span>
                  </div>

                  {/* Active Indicator Bar (White) */}
                  {isActive && (
                    <span className="absolute -left-[15px] top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-white rounded-r" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer Hint */}
          <div className="mt-6 pt-3 border-t border-white/10 text-white/30 text-[12px] leading-tight">
            Scroll to read or click to jump
          </div>
        </aside>

        {/* Right Main Content (Full Section Slices) */}
        <main className="flex-1 min-w-0 w-full flex flex-col gap-0 items-stretch">
          {project.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="w-full flex flex-col items-stretch relative scroll-mt-[48px] lg:scroll-mt-5"
            >
              {section.images.map((img, imgIdx) => (
                <div
                  key={`${section.id}-${imgIdx}`}
                  className="w-full relative overflow-hidden bg-transparent"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading={imgIdx === 0 && section.id === 'overview' ? 'eager' : 'lazy'}
                    className="w-full h-auto max-w-full block select-none pointer-events-none rounded-none"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </div>
              ))}
            </section>
          ))}

          {/* Bottom Project Switcher & Back to Top */}
          <div className="w-full mt-8 pt-6 pb-2 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('/#work')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[15px] transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <span>← Selected Work</span>
            </button>

            <button
              onClick={() => {
                onNavigate(`/projects/${nextProject.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white text-[#1e1e1e] hover:bg-gray-100 font-medium text-[15px] transition-colors flex items-center justify-between sm:justify-start gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <span className="truncate">Next Project: {nextProject.title}</span>
              <span className="shrink-0">→</span>
            </button>
          </div>
        </main>

      </div>

      {/* 4. Let's Connect Footer */}
      <FooterSection />
    </div>
  );
}
