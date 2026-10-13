import React, { useState, useRef, useEffect } from 'react';

// Exact initial positions and dimensions of the 8 desktop collage cards (based on 1440px canvas)
const INITIAL_CARDS = [
  { id: 'card-1', initLeft: 35.7, initTop: 36.52, width: 315.5, height: 416, defaultZ: 10 },
  { id: 'card-2', initLeft: 351, initTop: 128, width: 359, height: 441.5, defaultZ: 10 },
  { id: 'card-3', initLeft: 858, initTop: 84, width: 359, height: 443.5, defaultZ: 10 },
  { id: 'card-4', initLeft: 1275, initTop: 156, width: 265.02, height: 372.07, defaultZ: 10 },
  { id: 'card-5', initLeft: 614, initTop: 326, width: 265.02, height: 372.07, defaultZ: 30 }, // About me Hero
  { id: 'card-6', initLeft: 92, initTop: 582, width: 305.5, height: 411, defaultZ: 10 },
  { id: 'card-7', initLeft: 477, initTop: 663, width: 380.8, height: 442.35, defaultZ: 10 },
  { id: 'card-8', initLeft: 1010, initTop: 557, width: 327.68, height: 413.7, defaultZ: 10 },
];

export default function OutsideWorkSection() {
  const boardRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  const [positions, setPositions] = useState({});
  const [zIndices, setZIndices] = useState({});
  const [draggingId, setDraggingId] = useState(null);

  const topZIndexRef = useRef(40);
  const activeDragRef = useRef(null);
  const justDraggedRef = useRef(false);

  // Measure board width responsively
  useEffect(() => {
    const updateSize = () => {
      if (boardRef.current) {
        setContainerWidth(boardRef.current.offsetWidth);
      } else if (typeof window !== 'undefined') {
        setContainerWidth(window.innerWidth);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Scale factor for tablet / desktop board (768px - 1440px+)
  const scale = containerWidth < 1440 ? Math.max(0.53, containerWidth / 1440) : 1;
  const boardHeight = Math.round(1024 * scale);
  const baseOffsetX = Math.max(0, (containerWidth - 1440) / 2);

  // Compute card default position clamped safely inside the visible board
  const getCardDefaultPos = (cardId) => {
    const card = INITIAL_CARDS.find((c) => c.id === cardId);
    if (!card) return { x: 0, y: 0 };

    const cardW = card.width * scale;
    const cardH = card.height * scale;
    const maxX = Math.max(0, containerWidth - cardW - 12);
    const maxY = Math.max(0, boardHeight - cardH - 12);

    const rawX = containerWidth >= 1440 ? card.initLeft + baseOffsetX : card.initLeft * scale;
    const defaultX = Math.max(6, Math.min(rawX, maxX));
    const defaultY = Math.max(6, Math.min(card.initTop * scale, maxY));

    return { x: defaultX, y: defaultY, cardW, cardH, maxX, maxY };
  };

  const handlePointerDown = (cardId, e) => {
    if (e.button !== undefined && e.button !== 0) return;

    // Bring active card to the top
    topZIndexRef.current += 1;
    setZIndices((prev) => ({
      ...prev,
      [cardId]: topZIndexRef.current,
    }));

    const cardInfo = getCardDefaultPos(cardId);
    const currentPos = positions[cardId] || { x: cardInfo.x, y: cardInfo.y };

    activeDragRef.current = {
      cardId,
      pointerId: e.pointerId,
      startPointerX: e.clientX,
      startPointerY: e.clientY,
      startCardX: currentPos.x,
      startCardY: currentPos.y,
      maxX: cardInfo.maxX,
      maxY: cardInfo.maxY,
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
      }

      const targetX = drag.startCardX + dx;
      const targetY = drag.startCardY + dy;
      const clampedX = Math.max(0, Math.min(targetX, drag.maxX));
      const clampedY = Math.max(0, Math.min(targetY, drag.maxY));

      setPositions((prev) => ({
        ...prev,
        [drag.cardId]: { x: clampedX, y: clampedY },
      }));
    };

    const onPointerUp = () => {
      if (activeDragRef.current?.hasMoved) {
        justDraggedRef.current = true;
        setTimeout(() => {
          justDraggedRef.current = false;
        }, 120);
      }
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

  const handleInstagramClick = (e) => {
    if (justDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const getCardStyle = (cardId, defaultZ) => {
    const cardInfo = getCardDefaultPos(cardId);
    const pos = positions[cardId] || { x: cardInfo.x, y: cardInfo.y };
    const zIndex = zIndices[cardId] || defaultZ;
    const isDragging = draggingId === cardId;

    return {
      width: `${cardInfo.cardW}px`,
      height: `${cardInfo.cardH}px`,
      left: 0,
      top: 0,
      transform: `translate3d(${pos.x}px, ${pos.y}px, 0px)${isDragging ? ' scale(1.02)' : ''}`,
      zIndex,
      cursor: isDragging ? 'grabbing' : 'grab',
      touchAction: 'none',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      transition: isDragging ? 'box-shadow 150ms ease, transform 100ms ease-out' : 'box-shadow 200ms ease',
    };
  };

  return (
    <section id="about" className="w-full bg-[#1e1e1e] py-[70px] sm:py-[90px] md:py-[120px] overflow-hidden relative z-20">
      
      {/* Table Background Texture (Checks) - extends 100% width edge-to-edge */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ 
          backgroundImage: `url('/assets/outside-check-tile.png')`, 
          backgroundRepeat: 'repeat',
          backgroundSize: '170.67px 170.67px',
          opacity: 0.02 
        }}
        aria-hidden="true"
      />

      {/* Headings Container */}
      <div className="max-w-[1440px] xl:max-w-[1536px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-[80px] mb-8 md:mb-12 relative z-10">
        <h2 className="font-['Afacad_Flux'] font-normal text-white text-[26px] sm:text-[34px] md:text-[40px] tracking-wide mb-2 leading-tight">
          Outside of work you’ll always find me capturing or creating
        </h2>
        <p className="font-['Afacad_Flux'] font-normal text-[#b3a3a3] text-[17px] md:text-[20px]">
          Drag and hover
        </p>
      </div>

      {/* Interactive Collage Board for Tablet & Desktop (>= 768px) */}
      <div 
        ref={boardRef}
        style={{ height: `${boardHeight}px` }}
        className="hidden md:block relative w-full overflow-hidden select-none"
      >
        
        {/* Card 1 (Top Left Photo) */}
        <div 
          onPointerDown={(e) => handlePointerDown('card-1', e)}
          className="absolute rounded-[16.5px] select-none"
          style={getCardStyle('card-1', 10)}
        >
          <img 
            src="/assets/outside-photo-236.png" 
            alt="Photography" 
            className="w-full h-full object-cover pointer-events-none rounded-[16.5px] shadow-lg"
          />
        </div>

        {/* Card 2 (Mid Left Art) */}
        <div 
          onPointerDown={(e) => handlePointerDown('card-2', e)}
          className="absolute select-none"
          style={getCardStyle('card-2', 10)}
        >
          <img 
            src="/assets/outside-card-7.png" 
            alt="Art & Design creation" 
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>

        {/* Card 3 (Top Right Painting) */}
        <div 
          onPointerDown={(e) => handlePointerDown('card-3', e)}
          className="absolute select-none"
          style={getCardStyle('card-3', 10)}
        >
          <img 
            src="/assets/outside-card-1.png" 
            alt="Painting & art" 
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>

        {/* Card 4 (Far Right Playing Card) */}
        <div 
          onPointerDown={(e) => handlePointerDown('card-4', e)}
          className="absolute bg-[#f6e0c5] border-[10px] border-black rounded-[16.47px] overflow-hidden select-none shadow-lg"
          style={getCardStyle('card-4', 10)}
        >
          <img src="/assets/paper-texture-card.png" alt="" className="absolute inset-0 size-full object-cover pointer-events-none" />
          <img src="/assets/paper-highlights.svg" alt="" className="absolute inset-0 size-full pointer-events-none opacity-80" />
          <img src="/assets/paper-fibers.svg" alt="" className="absolute inset-0 size-full pointer-events-none opacity-80" />

          <div className="absolute left-0 top-[48%] w-full h-[52%] pointer-events-none">
            <img src="/assets/outside-photo-239.png" alt="Artwork collage" className="w-full h-full object-cover pointer-events-none" />
          </div>

          <div className="absolute left-0 top-0 w-full h-[50%] pointer-events-none">
            <img src="/assets/outside-photo-238.png" alt="Artwork" className="w-full h-full object-cover pointer-events-none" />
          </div>

          <img src="/assets/aged-edges-scuffs.svg" alt="" className="absolute inset-0 size-full pointer-events-none" />
        </div>

        {/* Center Hero Card: About me (Ace of Spades) */}
        <div 
          onPointerDown={(e) => handlePointerDown('card-5', e)}
          className="absolute rounded-[16.47px] overflow-hidden bg-[#f6e0c5] border-[8px] lg:border-[10px] border-black shadow-2xl select-none flex flex-col justify-between"
          style={getCardStyle('card-5', 30)}
        >
          <img src="/assets/paper-highlights.svg" alt="" className="absolute inset-0 size-full pointer-events-none opacity-80" />
          <img src="/assets/paper-fibers.svg" alt="" className="absolute inset-0 size-full pointer-events-none opacity-80" />
          <img src="/assets/aged-edges-scuffs.svg" alt="" className="absolute inset-0 size-full pointer-events-none z-20" />

          {/* Top Row: Rank & Title */}
          <div className="relative z-10 pt-2 px-3">
            <span className="font-['Bodoni_Moda'] font-bold text-[36px] lg:text-[45px] text-[#20201d] leading-none pointer-events-none">
              A
            </span>
            <p className="font-['Afacad_Flux'] font-normal text-[#080808] text-[20px] lg:text-[26.2px] text-center -mt-6 pointer-events-none">
              About me
            </p>
          </div>

          {/* Ornamental Ace Emblem */}
          <div className="relative z-10 w-[55%] h-[40%] mx-auto flex items-center justify-center pointer-events-none">
            <img src="/assets/ace-emblem.svg" alt="Ace Emblem" className="size-full object-contain pointer-events-none" />
          </div>

          {/* Bottom Row: Instagram Link & Inverted Rank */}
          <div className="relative z-30 pb-3 px-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 mx-auto">
              <img src="/assets/instagram.svg" alt="Instagram" className="size-[15px] pointer-events-none" />
              <a 
                href="https://www.instagram.com/nehadc_art/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleInstagramClick}
                className="font-['Roboto_Condensed'] font-bold text-[11px] lg:text-[12px] text-[#20201d] underline hover:opacity-80 transition-opacity cursor-pointer"
              >
                Click here to view all creations
              </a>
            </div>
            <span className="font-['Bodoni_Moda'] font-bold text-[36px] lg:text-[45px] text-[#20201d] leading-none rotate-180 pointer-events-none absolute right-3 bottom-2">
              A
            </span>
          </div>
        </div>

        {/* Card 6 (Bottom Left Photo) */}
        <div 
          onPointerDown={(e) => handlePointerDown('card-6', e)}
          className="absolute select-none"
          style={getCardStyle('card-6', 10)}
        >
          <img 
            src="/assets/outside-photo-237.png" 
            alt="Photography" 
            className="w-full h-full object-cover pointer-events-none rounded-[16.5px] shadow-lg"
          />
        </div>

        {/* Card 7 (Bottom Mid Tilted Card) */}
        <div 
          onPointerDown={(e) => handlePointerDown('card-7', e)}
          className="absolute flex items-center justify-center select-none"
          style={getCardStyle('card-7', 10)}
        >
          <div className="rotate-[-21.01deg] pointer-events-none w-[75%] h-[85%]">
            <div className="bg-[#f6e0c5] border-[8px] lg:border-[10px] border-[#7d0f0f] border-solid size-full overflow-hidden relative rounded-[16.47px] shadow-[6px_13px_4px_0px_rgba(0,0,0,0.25)]">
              <img 
                src="/assets/outside-photo-240.png" 
                alt="Artwork card" 
                className="absolute inset-0 size-full object-cover pointer-events-none" 
              />
              <img 
                src="/assets/aged-edges-scuffs.svg" 
                alt="" 
                className="absolute inset-0 size-full pointer-events-none" 
              />
            </div>
          </div>
        </div>

        {/* Card 8 (Bottom Right Lavender Card) */}
        <div 
          onPointerDown={(e) => handlePointerDown('card-8', e)}
          className="absolute flex items-center justify-center select-none"
          style={getCardStyle('card-8', 10)}
        >
          <div className="rotate-[10.37deg] w-[80%] h-[90%] rounded-[16.47px] overflow-hidden bg-[rgba(185,166,244,0.66)] border-[6px] lg:border-[7px] border-[#cfc1f1] shadow-[6px_13px_4px_0px_rgba(0,0,0,0.25)] relative pointer-events-none">
            <img 
              src="/assets/outside-photo-4.png" 
              alt="Creative work" 
              className="absolute inset-0 size-full object-cover pointer-events-none" 
            />
          </div>
        </div>

      </div>

      {/* Mobile Responsive Grid Flow (< 768px): All 8 Cards Present */}
      <div className="md:hidden px-4 grid grid-cols-1 sm:grid-cols-2 gap-7 max-w-[640px] mx-auto relative z-10">
        
        {/* Center Hero Card: About me */}
        <div className="sm:col-span-2 relative w-[265px] max-w-[calc(100vw-2rem)] h-[372px] mx-auto rounded-[16.5px] overflow-hidden bg-[#f6e0c5] border-[10px] border-black shadow-2xl flex flex-col justify-between">
          <img src="/assets/paper-highlights.svg" alt="" className="absolute inset-0 size-full pointer-events-none opacity-80" />
          <img src="/assets/paper-fibers.svg" alt="" className="absolute inset-0 size-full pointer-events-none opacity-80" />
          <img src="/assets/aged-edges-scuffs.svg" alt="" className="absolute inset-0 size-full pointer-events-none z-20" />
          
          <div className="relative z-10 pt-2 px-3">
            <span className="font-['Bodoni_Moda'] font-bold text-[45px] text-[#20201d] leading-none pointer-events-none">A</span>
            <p className="font-['Afacad_Flux'] font-normal text-[#080808] text-[26.2px] text-center -mt-6 pointer-events-none">About me</p>
          </div>

          <div className="relative z-10 w-[137px] h-[160px] mx-auto flex items-center justify-center pointer-events-none">
            <img src="/assets/ace-emblem.svg" alt="Ace Emblem" className="size-full object-contain pointer-events-none" />
          </div>

          <div className="relative z-30 pb-4 px-3 flex items-center justify-between">
            <div className="flex items-center gap-2 mx-auto">
              <img src="/assets/instagram.svg" alt="Instagram" className="size-[17px] pointer-events-none" />
              <a 
                href="https://www.instagram.com/nehadc_art/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Roboto_Condensed'] font-bold text-[12px] text-[#20201d] underline hover:opacity-80 transition-opacity"
              >
                Click here to view all creations
              </a>
            </div>
            <span className="font-['Bodoni_Moda'] font-bold text-[45px] text-[#20201d] leading-none rotate-180 pointer-events-none absolute right-3 bottom-2">A</span>
          </div>
        </div>

        {/* Card 1 (Photo) */}
        <div className="w-[265px] max-w-[calc(100vw-2rem)] h-[372px] mx-auto rounded-[16.5px] overflow-hidden shadow-lg">
          <img src="/assets/outside-photo-236.png" alt="Photography" className="w-full h-full object-cover rounded-[16.5px]" />
        </div>

        {/* Card 2 (Art) */}
        <div className="w-[265px] max-w-[calc(100vw-2rem)] h-[372px] mx-auto rounded-[16.5px] overflow-hidden shadow-lg">
          <img src="/assets/outside-card-7.png" alt="Art and design creation" className="w-full h-full object-contain" />
        </div>

        {/* Card 3 (Painting) */}
        <div className="w-[265px] max-w-[calc(100vw-2rem)] h-[372px] mx-auto rounded-[16.5px] overflow-hidden shadow-lg">
          <img src="/assets/outside-card-1.png" alt="Painting and art" className="w-full h-full object-contain" />
        </div>

        {/* Card 4 (Aged Playing Card Collage) */}
        <div className="w-[265px] max-w-[calc(100vw-2rem)] h-[372px] mx-auto rounded-[16.5px] overflow-hidden bg-[#f6e0c5] border-[10px] border-black shadow-lg relative">
          <img src="/assets/paper-texture-card.png" alt="" className="absolute inset-0 size-full object-cover pointer-events-none" />
          <img src="/assets/paper-highlights.svg" alt="" className="absolute inset-0 size-full pointer-events-none opacity-80" />
          <img src="/assets/paper-fibers.svg" alt="" className="absolute inset-0 size-full pointer-events-none opacity-80" />
          <div className="absolute left-0 top-[186px] w-[265px] h-[245px] pointer-events-none">
            <img src="/assets/outside-photo-239.png" alt="Artwork collage" className="w-full h-full object-cover pointer-events-none" />
          </div>
          <div className="absolute left-0 top-[-2px] w-[248px] h-[186px] pointer-events-none">
            <img src="/assets/outside-photo-238.png" alt="Artwork" className="w-full h-full object-cover pointer-events-none" />
          </div>
          <img src="/assets/aged-edges-scuffs.svg" alt="" className="absolute inset-0 size-full pointer-events-none" />
        </div>

        {/* Card 6 (Photo) */}
        <div className="w-[265px] max-w-[calc(100vw-2rem)] h-[372px] mx-auto rounded-[16.5px] overflow-hidden bg-[#f6e0c5] shadow-lg">
          <img src="/assets/outside-photo-237.png" alt="Photography" className="w-full h-full object-cover rounded-[16.5px]" />
        </div>

        {/* Card 7 (Tilted Artwork Card) */}
        <div className="w-[265px] max-w-[calc(100vw-2rem)] h-[372px] mx-auto rounded-[16.5px] overflow-hidden bg-[#f6e0c5] border-[8px] border-[#7d0f0f] shadow-lg relative">
          <img src="/assets/outside-photo-240.png" alt="Artwork card" className="w-full h-full object-cover" />
          <img src="/assets/aged-edges-scuffs.svg" alt="" className="absolute inset-0 size-full pointer-events-none" />
        </div>

        {/* Card 8 (Lavender Card) */}
        <div className="w-[265px] max-w-[calc(100vw-2rem)] h-[372px] mx-auto rounded-[16.5px] overflow-hidden bg-[rgba(185,166,244,0.66)] border-[6px] border-[#cfc1f1] shadow-lg relative">
          <img src="/assets/outside-photo-4.png" alt="Creative work" className="w-full h-full object-cover" />
        </div>

      </div>

    </section>
  );
}
