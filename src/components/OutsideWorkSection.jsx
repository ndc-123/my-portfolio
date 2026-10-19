import React, { useState, useRef, useEffect, useCallback } from 'react';

// Exact 7 collage photo definitions loading from public/assets/cards/
// All cards are preserved complete and fully visible with natural aspect ratios, borders, rounded corners & shadows
const COLLAGE_PHOTOS = [
  {
    id: 'photo-1-upper-left',
    src: '/assets/cards/Playing card-5.png',
    alt: 'Stage keyboard performance',
    origW: 263,
    origH: 335,
    cx: 0.105,
    cy: 0.330,
    defaultZ: 10,
  },
  {
    id: 'photo-2-top-center-left',
    src: '/assets/cards/Playing card-6.png',
    alt: 'Keyboard performance with star trophy',
    origW: 295,
    origH: 363,
    cx: 0.395,
    cy: 0.178,
    defaultZ: 11,
  },
  {
    id: 'photo-3-top-center-right',
    src: '/assets/cards/Playing card.png',
    alt: 'Beach sunset horse buggy ride',
    origW: 276,
    origH: 343,
    cx: 0.645,
    cy: 0.190,
    defaultZ: 10,
  },
  {
    id: 'photo-4-upper-right',
    src: '/assets/cards/Playing card-2.png',
    alt: 'Sand Castles and Paper Boats book',
    origW: 234,
    origH: 308,
    cx: 0.900,
    cy: 0.340,
    defaultZ: 11,
  },
  {
    id: 'photo-5-lower-left',
    src: '/assets/cards/Playing card-1.png',
    alt: 'Surreal Moments book of poems',
    origW: 237,
    origH: 318,
    cx: 0.180,
    cy: 0.820,
    defaultZ: 12,
  },
  {
    id: 'photo-6-lower-center',
    src: '/assets/cards/Playing card-3.png',
    alt: 'Homemade Tiramisu scoop',
    origW: 243,
    origH: 310,
    cx: 0.520,
    cy: 0.850,
    defaultZ: 11,
  },
  {
    id: 'photo-7-lower-right',
    src: '/assets/cards/Playing card-4.png',
    alt: 'Senior home keyboard performance and Seva Aarogya children',
    origW: 268,
    origH: 339,
    cx: 0.830,
    cy: 0.820,
    defaultZ: 10,
  },
];

// Optimized layout parameters for mobile viewports (< 768px)
const MOBILE_LAYOUT = {
  'photo-1-upper-left': { relX: 0.02, relY: 0.04, relW: 0.38, relH: 0.22 },
  'photo-2-top-center-left': { relX: 0.28, relY: 0.01, relW: 0.42, relH: 0.24 },
  'photo-3-top-center-right': { relX: 0.56, relY: 0.03, relW: 0.40, relH: 0.24 },
  'photo-4-upper-right': { relX: 0.60, relY: 0.18, relW: 0.36, relH: 0.22 },
  'photo-5-lower-left': { relX: 0.02, relY: 0.74, relW: 0.38, relH: 0.23 },
  'photo-6-lower-center': { relX: 0.30, relY: 0.76, relW: 0.36, relH: 0.22 },
  'photo-7-lower-right': { relX: 0.58, relY: 0.73, relW: 0.38, relH: 0.23 },
};

// Amazon links for the two published anthologies
const AMAZON_LINKS = {
  surrealMoments:
    'https://www.amazon.in/dp/939537425X?&linkCode=sl1&tag=storymirror-21&linkId=562994aecca64e568aed581bc659d0f2&language=en_IN&ref_=as_li_ss_tl',
  sandCastles:
    'https://www.amazon.in/dp/B0BHTHTQJ6?&linkCode=sl1&tag=storymirror-21&linkId=da11e8f2f739e85ef60ab876d9b4a5e9&language=en_IN&ref_=as_li_ss_tl',
};

// Default center heading content when not hovering or tapping any photo
const DEFAULT_HEADING = 'Outside of work you’ll always find me creating';

// Dynamic text and action mapping for each photo card
const PHOTO_CONTENT_MAP = {
  'photo-1-upper-left': {
    text: 'Performing on stage since 2012',
    amazonLink: null,
  },
  'photo-2-top-center-left': {
    text: 'Playing instruments when I’m not working',
    amazonLink: null,
  },
  'photo-3-top-center-right': {
    text: 'Capturing moments before they escape in time',
    amazonLink: null,
  },
  'photo-4-upper-right': {
    text: 'Co-author of an anthology',
    amazonLink: AMAZON_LINKS.sandCastles,
  },
  'photo-5-lower-left': {
    text: 'Co-author of an anthology',
    amazonLink: AMAZON_LINKS.surrealMoments,
  },
  'photo-6-lower-center': {
    text: 'Always bringing dessert to the party',
    amazonLink: null,
  },
  'photo-7-lower-right': {
    text: 'Volunteering for people',
    amazonLink: null,
  },
};

export default function OutsideWorkSection() {
  const boardRef = useRef(null);
  const [boardDims, setBoardDims] = useState({ width: 1440, height: 800 });
  const [positions, setPositions] = useState({});
  const [zIndices, setZIndices] = useState({});
  const [draggingId, setDraggingId] = useState(null);

  // Dynamic heading & interaction states
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [displayedHeading, setDisplayedHeading] = useState(DEFAULT_HEADING);
  const [fadeState, setFadeState] = useState('in');

  const leaveTimerRef = useRef(null);
  const wasDraggedRef = useRef(false);
  const topZIndexRef = useRef(20);
  const activeDragRef = useRef(null);

  // Measure board width & height responsively
  const updateDims = useCallback(() => {
    if (boardRef.current) {
      const w = boardRef.current.offsetWidth || window.innerWidth;
      const h = boardRef.current.offsetHeight || window.innerHeight;
      setBoardDims({ width: w, height: h });
    } else if (typeof window !== 'undefined') {
      setBoardDims({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  useEffect(() => {
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, [updateDims]);

  // Calculate default position for each photo to be completely visible within the section
  const getCardDefaultPos = useCallback(
    (cardId) => {
      const card = COLLAGE_PHOTOS.find((c) => c.id === cardId);
      if (!card) return { x: 0, y: 0, cardW: 0, cardH: 0 };

      const { width: bW, height: bH } = boardDims;
      const isMobile = bW < 768;

      if (isMobile) {
        const m = MOBILE_LAYOUT[cardId];
        const cardW = bW * m.relW;
        const cardH = bH * m.relH;
        let cardX = bW * m.relX;
        let cardY = bH * m.relY;
        cardX = Math.max(8, Math.min(bW - cardW - 8, cardX));
        cardY = Math.max(8, Math.min(bH - cardH - 8, cardY));
        return { x: cardX, y: cardY, cardW, cardH };
      }

      // Desktop & Laptop: Fluid scaling keeping all cards fully within the visible frame
      const scale = (bH * 0.36) / 363;
      const fitW = Math.min(bW, bH * 1.55);
      const offsetX = (bW - fitW) / 2;

      const cardW = card.origW * scale;
      const cardH = card.origH * scale;

      const centerX = offsetX + fitW * card.cx;
      const centerY = bH * card.cy;

      let cardX = centerX - cardW / 2;
      let cardY = centerY - cardH / 2;

      // Safe bounds to guarantee 100% complete visibility with zero clipping
      const padX = 14;
      const padY = 12;
      cardX = Math.max(padX, Math.min(bW - cardW - padX, cardX));
      cardY = Math.max(padY, Math.min(bH - cardH - padY, cardY));

      return { x: cardX, y: cardY, cardW, cardH };
    },
    [boardDims]
  );

  // Interactive dragging support
  const handlePointerDown = (cardId, e) => {
    if (e.button !== undefined && e.button !== 0) return;

    topZIndexRef.current += 1;
    setZIndices((prev) => ({
      ...prev,
      [cardId]: topZIndexRef.current,
    }));

    const cardInfo = getCardDefaultPos(cardId);
    const currentPos = positions[cardId] || { x: cardInfo.x, y: cardInfo.y };

    wasDraggedRef.current = false;
    activeDragRef.current = {
      cardId,
      pointerId: e.pointerId,
      startPointerX: e.clientX,
      startPointerY: e.clientY,
      startCardX: currentPos.x,
      startCardY: currentPos.y,
      hasMoved: false,
    };

    setDraggingId(cardId);

    const onPointerMove = (moveEvt) => {
      if (!activeDragRef.current || activeDragRef.current.cardId !== cardId) return;
      const drag = activeDragRef.current;
      const dx = moveEvt.clientX - drag.startPointerX;
      const dy = moveEvt.clientY - drag.startPointerY;

      if (!drag.hasMoved && Math.hypot(dx, dy) > 4) {
        drag.hasMoved = true;
        wasDraggedRef.current = true;
      }

      setPositions((prev) => ({
        ...prev,
        [drag.cardId]: {
          x: drag.startCardX + dx,
          y: drag.startCardY + dy,
        },
      }));
    };

    const onPointerUp = () => {
      activeDragRef.current = null;
      setDraggingId(null);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // Derive active heading from hovered card or tapped/selected card
  const activeCardId = hoveredCardId || selectedCardId || null;
  const targetHeading = activeCardId
    ? PHOTO_CONTENT_MAP[activeCardId]?.text || DEFAULT_HEADING
    : DEFAULT_HEADING;

  // Smooth fade transition between heading texts
  useEffect(() => {
    if (targetHeading === displayedHeading) {
      return;
    }

    const fadeOutTimer = setTimeout(() => {
      setFadeState('out');
    }, 0);

    const swapTimer = setTimeout(() => {
      setDisplayedHeading(targetHeading);
      setFadeState('in');
    }, 90);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(swapTimer);
    };
  }, [targetHeading, displayedHeading]);

  // Leave timer management for smooth hover experience
  const clearLeaveTimer = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const handleCardMouseEnter = (cardId) => {
    if (draggingId && draggingId !== cardId) return;
    clearLeaveTimer();
    setHoveredCardId(cardId);
  };

  const handleCardMouseLeave = () => {
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => {
      setHoveredCardId(null);
    }, 280);
  };

  const handleCenterMouseEnter = () => {
    clearLeaveTimer();
  };

  const handleCenterMouseLeave = () => {
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => {
      setHoveredCardId(null);
    }, 280);
  };

  const handleCardClick = (cardId, e) => {
    e.stopPropagation();
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      return;
    }
    clearLeaveTimer();
    setSelectedCardId((prev) => (prev === cardId ? null : cardId));

    // If an anthology photo is clicked or tapped, open its Amazon URL in a new browser tab
    const photoInfo = PHOTO_CONTENT_MAP[cardId];
    if (photoInfo?.amazonLink) {
      window.open(photoInfo.amazonLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleBackgroundClick = (e) => {
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    clearLeaveTimer();
    setHoveredCardId(null);
    setSelectedCardId(null);
  };

  const handleSectionMouseLeave = () => {
    clearLeaveTimer();
    setHoveredCardId(null);
    setSelectedCardId(null);
  };

  useEffect(() => {
    return () => clearLeaveTimer();
  }, []);

  const getCardStyle = (photo) => {
    const cardInfo = getCardDefaultPos(photo.id);
    const pos = positions[photo.id] || { x: cardInfo.x, y: cardInfo.y };
    const zIndex = zIndices[photo.id] || photo.defaultZ;
    const isDragging = draggingId === photo.id;

    return {
      width: `${cardInfo.cardW}px`,
      height: `${cardInfo.cardH}px`,
      left: 0,
      top: 0,
      transform: `translate3d(${pos.x}px, ${pos.y}px, 0px)${isDragging ? ' scale(1.03)' : ''}`,
      zIndex,
      cursor: isDragging ? 'grabbing' : 'grab',
      touchAction: 'none',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      transition: isDragging
        ? 'box-shadow 150ms ease, transform 100ms ease-out'
        : 'box-shadow 250ms ease, transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
    };
  };

  return (
    <section 
      id="about" 
      ref={boardRef}
      style={{
        height: '100dvh',
        minHeight: '560px',
        maxHeight: '1080px',
      }}
      className="w-full relative overflow-hidden select-none z-20 m-0 p-0"
      aria-label="Outside of work photo collage"
      onClick={handleBackgroundClick}
      onMouseLeave={handleSectionMouseLeave}
    >
      {/* Dark Charcoal Repeating Checkerboard Pattern (#1d1d1d & #222222) */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ 
          backgroundColor: '#1d1d1d',
          backgroundImage: `conic-gradient(
            #222222 90deg, 
            #1d1d1d 90deg 180deg, 
            #222222 180deg 270deg, 
            #1d1d1d 270deg
          )`,
          backgroundSize: '64px 64px',
        }}
        aria-hidden="true"
      />

      {/* Floating Photo Collage: 7 intact photo prints fully visible within cards */}
      {COLLAGE_PHOTOS.map((photo) => {
        const photoInfo = PHOTO_CONTENT_MAP[photo.id];
        const isAnthology = Boolean(photoInfo?.amazonLink);

        return (
          <div
            key={photo.id}
            data-card="true"
            data-cursor={isAnthology ? 'Buy on Amazon' : undefined}
            onPointerDown={(e) => handlePointerDown(photo.id, e)}
            onMouseEnter={() => handleCardMouseEnter(photo.id)}
            onMouseLeave={handleCardMouseLeave}
            onClick={(e) => handleCardClick(photo.id, e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(photo.id, e);
              }
            }}
            tabIndex={0}
            role={isAnthology ? 'link' : 'button'}
            aria-label={isAnthology ? `${photo.alt} - Buy on Amazon` : photo.alt}
            style={getCardStyle(photo)}
            className="absolute select-none will-change-transform outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            {/* Complete photo card fully visible with object-contain (no cropping/clipping) */}
            <img 
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
              draggable={false}
            />
          </div>
        );
      })}

      {/* Centered Content: Dynamic Heading & Static Button placed cleanly in central space */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 px-4"
        onMouseEnter={handleCenterMouseEnter}
        onMouseLeave={handleCenterMouseLeave}
      >
        {/* Centered Heading with smooth quick fade and stable min-height to eliminate layout shifts */}
        <div className="min-h-[58px] sm:min-h-[66px] md:min-h-[76px] lg:min-h-[86px] flex items-center justify-center w-full px-2 mb-4 sm:mb-5 md:mb-6 max-w-[850px] pointer-events-auto">
          <h2 
            className={`font-['Afacad_Flux'] font-normal text-white text-[22px] sm:text-[26px] md:text-[32px] lg:text-[36px] xl:text-[40px] tracking-normal text-center leading-tight drop-shadow-md select-text transition-opacity duration-150 ease-in-out ${
              fadeState === 'in' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {displayedHeading}
          </h2>
        </div>

        {/* Existing Centered Button: Unchanged appearance, position, styling, and functionality */}
        <a
          href="https://www.instagram.com/nehadc_art/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-['Literata'] font-normal text-white text-[14px] sm:text-[16px] md:text-[17px] bg-[#222222]/90 hover:bg-[#2c2c2c] active:scale-95 border border-white/80 rounded-[8px] px-6 sm:px-7 py-1.5 sm:py-2 transition-all duration-200 shadow-md hover:shadow-lg pointer-events-auto no-underline inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          What I've been creating
        </a>
      </div>
    </section>
  );
}
