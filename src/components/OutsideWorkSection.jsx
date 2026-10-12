import React, { useState, useRef, useEffect } from 'react';

// Exact initial positions and dimensions of the 8 desktop collage cards
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
  const [containerWidth, setContainerWidth] = useState(1440);
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
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Centering offset for viewports wider than 1440px
  const baseOffsetX = Math.max(0, (containerWidth - 1440) / 2);

  const handlePointerDown = (cardId, e) => {
    if (e.button !== undefined && e.button !== 0) return;

    // Bring active card to the top
    topZIndexRef.current += 1;
    setZIndices((prev) => ({
      ...prev,
      [cardId]: topZIndexRef.current,
    }));

    const card = INITIAL_CARDS.find((c) => c.id === cardId);
    const currentPos = positions[cardId] || {
      x: card.initLeft + baseOffsetX,
      y: card.initTop,
    };

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
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (cardId, e) => {
    if (!activeDragRef.current || activeDragRef.current.cardId !== cardId) return;

    const drag = activeDragRef.current;
    const dx = e.clientX - drag.startPointerX;
    const dy = e.clientY - drag.startPointerY;

    if (!drag.hasMoved && Math.hypot(dx, dy) > 4) {
      drag.hasMoved = true;
    }

    const card = INITIAL_CARDS.find((c) => c.id === cardId);
    const bWidth = boardRef.current ? boardRef.current.offsetWidth : containerWidth;
    const bHeight = boardRef.current ? boardRef.current.offsetHeight : 1024;
    const maxX = Math.max(0, bWidth - card.width);
    const maxY = Math.max(0, bHeight - card.height);

    const targetX = drag.startCardX + dx;
    const targetY = drag.startCardY + dy;

    const clampedX = Math.max(0, Math.min(targetX, maxX));
    const clampedY = Math.max(0, Math.min(targetY, maxY));

    setPositions((prev) => ({
      ...prev,
      [cardId]: { x: clampedX, y: clampedY },
    }));
  };

  const handlePointerUp = (cardId, e) => {
    if (!activeDragRef.current || activeDragRef.current.cardId !== cardId) return;

    if (activeDragRef.current.hasMoved) {
      justDraggedRef.current = true;
      setTimeout(() => {
        justDraggedRef.current = false;
      }, 100);
    }

    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {}

    activeDragRef.current = null;
    setDraggingId(null);
  };

  const handleInstagramClick = (e) => {
    if (justDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const dragProps = (cardId) => ({
    onPointerDown: (e) => handlePointerDown(cardId, e),
    onPointerMove: (e) => handlePointerMove(cardId, e),
    onPointerUp: (e) => handlePointerUp(cardId, e),
    onPointerCancel: (e) => handlePointerUp(cardId, e),
  });

  const getCardStyle = (cardId, width, height, defaultZ) => {
    const card = INITIAL_CARDS.find((c) => c.id === cardId);
    const pos = positions[cardId] || {
      x: card.initLeft + baseOffsetX,
      y: card.initTop,
    };
    const zIndex = zIndices[cardId] || defaultZ;
    const isDragging = draggingId === cardId;

    return {
      width: `${width}px`,
      height: `${height}px`,
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
    <section id="about" className="w-full bg-[#1e1e1e] py-[90px] md:py-[120px] overflow-hidden relative z-20">
      
      {/* Table Background Texture (Checks) - extends 100% width edge-to-edge across the entire section */}
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
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-[80px] mb-8 md:mb-12 relative z-10">
        <h2 className="font-['Afacad_Flux'] font-normal text-white text-[28px] sm:text-[34px] md:text-[40px] tracking-wide mb-2">
          Outside of work you’ll always find me capturing or creating
        </h2>
        <p className="font-['Afacad_Flux'] font-normal text-[#b3a3a3] text-[18px] md:text-[20px]">
          Drag and hover
        </p>
      </div>

      {/* Collage Board Desktop - 100% width edge-to-edge with interactive draggable cards */}
      <div 
        ref={boardRef}
        className="hidden lg:block relative w-full h-[1024px] overflow-hidden select-none"
      >
        
        {/* Card 1 (Top Left) - image 236 (node 53:493) */}
        <div 
          {...dragProps('card-1')}
          className="absolute rounded-[16.5px] select-none"
          style={getCardStyle('card-1', 315.5, 416, 10)}
        >
          <img 
            src="/assets/outside-photo-236.png" 
            alt="Photography" 
            className="w-full h-full object-cover pointer-events-none rounded-[16.5px] shadow-lg"
          />
        </div>

        {/* Card 2 (Mid Left) - image 230 (node 50:405) */}
        <div 
          {...dragProps('card-2')}
          className="absolute select-none"
          style={getCardStyle('card-2', 359, 441.5, 10)}
        >
          <img 
            src="/assets/outside-card-7.png" 
            alt="Art & Design creation" 
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>

        {/* Card 3 (Top Right) - image 232 (node 50:411) */}
        <div 
          {...dragProps('card-3')}
          className="absolute select-none"
          style={getCardStyle('card-3', 359, 443.5, 10)}
        >
          <img 
            src="/assets/outside-card-1.png" 
            alt="Painting & art" 
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>

        {/* Card 4 (Far Right Playing Card) - node 53:502 with image 238 & 239 */}
        <div 
          {...dragProps('card-4')}
          className="absolute bg-[#f6e0c5] border-[10px] border-black rounded-[16.47px] overflow-hidden select-none shadow-lg"
          style={getCardStyle('card-4', 265.02, 372.07, 10)}
        >
          {/* Paper Texture and highlights */}
          <img 
            src="/assets/paper-texture-card.png" 
            alt="" 
            className="absolute inset-0 size-full object-cover pointer-events-none" 
          />
          <img 
            src="/assets/paper-highlights.svg" 
            alt="" 
            className="absolute inset-0 size-full pointer-events-none opacity-80" 
          />
          <img 
            src="/assets/paper-fibers.svg" 
            alt="" 
            className="absolute inset-0 size-full pointer-events-none opacity-80" 
          />

          {/* Lower image 239 */}
          <div className="absolute left-0 top-[186px] w-[265px] h-[245px] pointer-events-none">
            <img 
              src="/assets/outside-photo-239.png" 
              alt="Artwork collage" 
              className="w-full h-full object-cover pointer-events-none" 
            />
          </div>

          {/* Upper image 238 */}
          <div className="absolute left-0 top-[-2px] w-[248px] h-[186px] pointer-events-none">
            <img 
              src="/assets/outside-photo-238.png" 
              alt="Artwork" 
              className="w-full h-full object-cover pointer-events-none" 
            />
          </div>

          {/* Aged Edges Overlay */}
          <img 
            src="/assets/aged-edges-scuffs.svg" 
            alt="" 
            className="absolute inset-[-8px] w-[280px] h-[391px] pointer-events-none" 
          />
        </div>

        {/* Center Hero Card: About me (Ace of Spades, node 5:261) */}
        <div 
          {...dragProps('card-5')}
          className="absolute rounded-[16.47px] overflow-hidden bg-[#f6e0c5] border-[10px] border-black shadow-2xl select-none"
          style={getCardStyle('card-5', 265.02, 372.07, 30)}
        >
          {/* Highlights & Fibers Texture */}
          <img src="/assets/paper-highlights.svg" alt="" className="absolute inset-0 size-full pointer-events-none opacity-80" />
          <img src="/assets/paper-fibers.svg" alt="" className="absolute inset-0 size-full pointer-events-none opacity-80" />
          <img src="/assets/aged-edges-scuffs.svg" alt="" className="absolute inset-[-8px] w-[280px] h-[391px] pointer-events-none z-20" />

          {/* Top Left Ace Rank */}
          <span className="absolute left-[6px] top-[-2px] font-['Bodoni_Moda'] font-bold text-[45px] text-[#20201d] leading-none z-10 pointer-events-none">
            A
          </span>

          {/* Bottom Right Ace Rank (Inverted) */}
          <span className="absolute right-[6px] bottom-[-2px] font-['Bodoni_Moda'] font-bold text-[45px] text-[#20201d] leading-none rotate-180 z-10 pointer-events-none">
            A
          </span>

          {/* Title: About me */}
          <p className="font-['Afacad_Flux'] font-normal text-[#080808] text-[26.2px] text-center mt-6 pointer-events-none">
            About me
          </p>

          {/* Ornamental Ace Emblem */}
          <div className="w-[137px] h-[160px] mx-auto my-2 flex items-center justify-center pointer-events-none">
            <img src="/assets/ace-emblem.svg" alt="Ace Emblem" className="size-full object-contain pointer-events-none" />
          </div>

          {/* Instagram Link */}
          <div className="absolute bottom-[20px] left-0 right-0 flex items-center justify-center gap-2 z-30">
            <img src="/assets/instagram.svg" alt="Instagram" className="size-[17px] pointer-events-none" />
            <a 
              href="https://www.instagram.com/nehadc_art/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleInstagramClick}
              className="font-['Roboto_Condensed'] font-bold text-[12px] text-[#20201d] underline hover:opacity-80 transition-opacity cursor-pointer"
            >
              Click here to view all creations
            </a>
          </div>
        </div>

        {/* Card 6 (Bottom Left Photo) - image 237 (node 53:499) */}
        <div 
          {...dragProps('card-6')}
          className="absolute select-none"
          style={getCardStyle('card-6', 305.5, 411, 10)}
        >
          <img 
            src="/assets/outside-photo-237.png" 
            alt="Photography" 
            className="w-full h-full object-cover pointer-events-none rounded-[16.5px] shadow-lg"
          />
        </div>

        {/* Card 7 (Bottom Mid Tilted Card) - node 53:538 with image 240 */}
        <div 
          {...dragProps('card-7')}
          className="absolute flex items-center justify-center select-none"
          style={getCardStyle('card-7', 380.8, 442.35, 10)}
        >
          <div className="rotate-[-21.01deg] pointer-events-none">
            <div className="bg-[#f6e0c5] border-[10px] border-[#7d0f0f] border-solid w-[265.02px] h-[372.07px] overflow-hidden relative rounded-[16.47px] shadow-[6px_13px_4px_0px_rgba(0,0,0,0.25)]">
              {/* Rotated image 240 inside */}
              <div className="absolute flex h-[513.43px] items-center justify-center left-[-140px] top-[-69px] w-[489.18px]">
                <div className="flex-none rotate-[-8.76deg]">
                  <div className="w-[425px] h-[454px] relative">
                    <img 
                      src="/assets/outside-photo-240.png" 
                      alt="Artwork card" 
                      className="absolute inset-0 size-full object-cover pointer-events-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Aged Edges Overlay */}
              <img 
                src="/assets/aged-edges-scuffs.svg" 
                alt="" 
                className="absolute inset-[-8px] w-[280px] h-[391px] pointer-events-none" 
              />
            </div>
          </div>
        </div>

        {/* Card 8 (Bottom Right Lavender Card) - node 5:251 with image 222 */}
        <div 
          {...dragProps('card-8')}
          className="absolute flex items-center justify-center select-none"
          style={getCardStyle('card-8', 327.68, 413.7, 10)}
        >
          <div className="rotate-[10.37deg] w-[265.02px] h-[372.07px] rounded-[16.47px] overflow-hidden bg-[rgba(185,166,244,0.66)] border-[7px] border-[#cfc1f1] shadow-[6px_13px_4px_0px_rgba(0,0,0,0.25)] relative pointer-events-none">
            <img 
              src="/assets/outside-photo-4.png" 
              alt="Creative work" 
              className="absolute inset-[-20px_-20px] w-[115%] h-[115%] object-cover pointer-events-none" 
            />
          </div>
        </div>

      </div>

      {/* Tablet & Mobile Layout: Responsive Grid Collage */}
      <div className="lg:hidden px-6 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-[700px] mx-auto relative z-10">
        
        {/* Center Hero Card: About me */}
        <div className="sm:col-span-2 relative w-[265px] h-[372px] mx-auto rounded-[16.5px] overflow-hidden bg-[#f6e0c5] border-[10px] border-black shadow-2xl">
          <img src="/assets/paper-highlights.svg" alt="" className="absolute inset-0 size-full pointer-events-none opacity-80" />
          <img src="/assets/paper-fibers.svg" alt="" className="absolute inset-0 size-full pointer-events-none opacity-80" />
          <img src="/assets/aged-edges-scuffs.svg" alt="" className="absolute inset-0 size-full pointer-events-none z-20" />
          <span className="absolute left-[6px] top-[-2px] font-['Bodoni_Moda'] font-bold text-[45px] text-[#20201d] leading-none z-10">A</span>
          <span className="absolute right-[6px] bottom-[-2px] font-['Bodoni_Moda'] font-bold text-[45px] text-[#20201d] leading-none rotate-180 z-10">A</span>
          <p className="font-['Afacad_Flux'] font-normal text-[#080808] text-[26.2px] text-center mt-6">About me</p>
          <div className="w-[137px] h-[160px] mx-auto my-2 flex items-center justify-center">
            <img src="/assets/ace-emblem.svg" alt="Ace Emblem" className="size-full object-contain" />
          </div>
          <div className="absolute bottom-[20px] left-0 right-0 flex items-center justify-center gap-2 z-30">
            <img src="/assets/instagram.svg" alt="Instagram" className="size-[17px]" />
            <a 
              href="https://www.instagram.com/nehadc_art/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-['Roboto_Condensed'] font-bold text-[12px] text-[#20201d] underline"
            >
              Click here to view all creations
            </a>
          </div>
        </div>

        {/* Card 1 */}
        <div className="w-[265px] h-[372px] mx-auto rounded-[16.5px] overflow-hidden shadow-lg">
          <img src="/assets/outside-card-1.png" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Card 2 */}
        <div className="w-[265px] h-[372px] mx-auto rounded-[16.5px] overflow-hidden bg-[#f6e0c5] shadow-lg">
          <img src="/assets/outside-photo-237.png" alt="" className="w-full h-full object-cover rounded-[16.5px]" />
        </div>

        {/* Card 3 */}
        <div className="w-[265px] h-[372px] mx-auto rounded-[16.5px] overflow-hidden bg-[#f6e0c5] shadow-lg">
          <img src="/assets/outside-photo-236.png" alt="" className="w-full h-full object-cover rounded-[16.5px]" />
        </div>

        {/* Card 4 */}
        <div className="w-[265px] h-[372px] mx-auto rounded-[16.5px] overflow-hidden shadow-lg">
          <img src="/assets/outside-card-7.png" alt="" className="w-full h-full object-contain" />
        </div>

      </div>

    </section>
  );
}
