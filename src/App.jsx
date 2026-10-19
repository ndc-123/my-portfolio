import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CardsSection from './components/CardsSection';
import ProjectsSection from './components/ProjectsSection';
import OtherDomainsSection from './components/OtherDomainsSection';
import TestimonialsSection from './components/TestimonialsSection';
import OutsideWorkSection from './components/OutsideWorkSection';
import FooterSection from './components/FooterSection';
import CaseStudyPage from './components/CaseStudyPage';
import AboutPage from './components/AboutPage';
import CustomCursor from './components/CustomCursor';
import JumpToTopButton from './components/JumpToTopButton';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Sync with browser Back and Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to hash on initial load if present
  useEffect(() => {
    if (window.location.hash && currentPath === '/') {
      const hash = window.location.hash.substring(1);
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [currentPath]);

  // Dynamic document title
  useEffect(() => {
    switch (currentPath) {
      case '/projects/ecosys':
        document.title = 'Ecosys — Neha Chaware';
        break;
      case '/projects/reloom':
        document.title = 'ReLoom — Neha Chaware';
        break;
      case '/projects/strava':
        document.title = 'Strava — Neha Chaware';
        break;
      case '/projects/legacy-system':
        document.title = 'Legacy Operational System Redesign — Neha Chaware';
        break;
      case '/about':
        document.title = 'About Me — Neha Chaware';
        break;
      default:
        document.title = 'Neha Chaware — Portfolio';
        break;
    }
  }, [currentPath]);

  const navigate = (to) => {
    const [path, hash] = to.split('#');
    const targetPath = path || '/';

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', to);
      setCurrentPath(targetPath);
      if (hash) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        const scrollToHash = (attempts = 0) => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else if (attempts < 10) {
            setTimeout(() => scrollToHash(attempts + 1), 50);
          }
        };
        setTimeout(() => scrollToHash(), 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } else {
      if (hash) {
        window.history.pushState({}, '', to);
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Render project case-study pages, about page, or homepage with root-level CustomCursor
  const renderContent = () => {
    if (currentPath === '/projects/ecosys') {
      return <CaseStudyPage projectId="ecosys" onNavigate={navigate} />;
    }
    if (currentPath === '/projects/reloom') {
      return <CaseStudyPage projectId="reloom" onNavigate={navigate} />;
    }
    if (currentPath === '/projects/strava') {
      return <CaseStudyPage projectId="strava" onNavigate={navigate} />;
    }
    if (currentPath === '/projects/legacy-system') {
      return <CaseStudyPage projectId="legacy-system" onNavigate={navigate} />;
    }
    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    // Default: Homepage
    return (
      <div className="min-h-screen w-full bg-[#1e1e1e] text-white flex flex-col font-['Afacad_Flux'] overflow-x-clip">
        {/* 1. Header Navigation */}
        <Navbar onNavigate={navigate} />

        {/* 2. Hero Section: Bio, Tagline & Pinned Photo Stack */}
        <HeroSection />

        {/* 3. Cards I Bring to the Table: Playing Cards & Strengths */}
        <CardsSection />

        {/* 4. Selected Deck: Work & Submitted Projects */}
        <ProjectsSection onNavigate={navigate} />

        {/* 5. Other Domains Explored: Fanned Card Carousel & Agentic AI */}
        <OtherDomainsSection />

        {/* 6. Testimonials: Recommendation Cards */}
        <TestimonialsSection />

        {/* 7. Outside of Work: Art & Creation Photo Collage */}
        <OutsideWorkSection />

        {/* 8. Let's Connect: Contact Buttons & Multiplayer Cursors */}
        <FooterSection />
      </div>
    );
  };

  return (
    <>
      <CustomCursor />
      {renderContent()}
      <JumpToTopButton />
    </>
  );
}
