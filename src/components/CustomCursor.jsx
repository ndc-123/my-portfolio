import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isHoveringProject, setIsHoveringProject] = useState(false);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Position initially off-screen
    if (cursorRef.current) {
      cursorRef.current.style.transform = 'translate3d(-500px, -500px, 0)';
    }

    const handlePointerMove = (e) => {
      // Discard touch events to preserve native touch interactions on mobile/touchscreens
      if (e.pointerType === 'touch') {
        if (isHoveringRef.current) {
          isHoveringRef.current = false;
          setIsHoveringProject(false);
        }
        return;
      }

      // Update position with zero latency
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check whether target is inside any project card, Other Projects card, or Read Full button
      const target = e.target;
      const isProjectCard = Boolean(
        target &&
        target instanceof Element &&
        target.closest('.project-card, [data-cursor="view"]')
      );

      if (isProjectCard) {
        if (!isHoveringRef.current) {
          isHoveringRef.current = true;
          setIsHoveringProject(true);
        }
      } else {
        if (isHoveringRef.current) {
          isHoveringRef.current = false;
          setIsHoveringProject(false);
        }
      }
    };

    const handlePointerLeave = () => {
      if (isHoveringRef.current) {
        isHoveringRef.current = false;
        setIsHoveringProject(false);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[99999] will-change-transform select-none"
      style={{
        opacity: isHoveringProject ? 1 : 0,
        visibility: isHoveringProject ? 'visible' : 'hidden',
        transition: 'opacity 120ms ease-out',
      }}
      aria-hidden="true"
    >
      <div className="relative pointer-events-none select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
        {/* Orange #FF6A00 pointer icon with tip aligned at hotspot (0, 0) */}
        <svg
          width="21"
          height="22"
          viewBox="7.1 6.18 17.6 18.6"
          fill="none"
          className="absolute top-0 left-0 pointer-events-none shrink-0"
          style={{ display: 'block' }}
        >
          <path
            d="M11.8924 23.7113L7.33378 7.7198C7.0984 6.89408 7.95602 6.18105 8.73584 6.55412L23.8385 13.7792C24.6416 14.1633 24.5812 15.3159 23.7425 15.6131L17.5312 17.8139C17.3056 17.8938 17.1164 18.0511 16.9978 18.2573L13.7318 23.9361C13.2908 24.7029 12.1347 24.5616 11.8924 23.7113Z"
            fill="#FF6A00"
          />
        </svg>

        {/* Orange #FF6A00 rounded pill containing bold white "View" - exact dimensions matching reference */}
        <div
          className="absolute left-[14px] top-[17px] bg-[#FF6A00] rounded-full flex items-center justify-center pointer-events-none shadow-[0_2px_8px_rgba(255,106,0,0.35)] whitespace-nowrap"
          style={{
            padding: '7px 18px',
          }}
        >
          <span className="font-['Afacad_Flux',sans-serif] font-bold text-white text-[15px] sm:text-[16px] leading-none tracking-normal select-none">
            View
          </span>
        </div>
      </div>
    </div>
  );
}
