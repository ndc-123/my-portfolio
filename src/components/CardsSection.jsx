import React, { useState } from 'react';

// Reusable Playing Card Front Component
function PlayingCard({
  bg = '#f6e0c5',
  rank = 'K',
  rankColor = '#080808',
  suitIcon = '/assets/club-suit.svg',
  title = '',
  titleColor = '#080808',
  starIcon = null,
  badgeText = null,
  className = '',
}) {
  return (
    <div
      className={`relative w-[265px] h-[372px] rounded-[16.5px] overflow-hidden shrink-0 select-none shadow-md ${className}`}
      style={{ backgroundColor: bg }}
    >
      {/* Paper texture highlights & fibers */}
      <img
        src="/assets/paper-highlights.svg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90"
        aria-hidden="true"
      />
      <img
        src="/assets/paper-fibers.svg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-80"
        aria-hidden="true"
      />

      {/* Top Left Rank or Star */}
      {starIcon ? (
        <div className="absolute left-[12px] top-[15.5px] size-[54px] z-10">
          <img src={starIcon} alt="Star" className="size-full" />
        </div>
      ) : (
        <span
          className="absolute left-[14px] top-[9.7px] font-['Bodoni_Moda'] font-normal text-[40px] leading-none z-10"
          style={{ color: rankColor }}
        >
          {rank}
        </span>
      )}

      {/* Optional Badge (e.g. Coming soon) */}
      {badgeText && (
        <p className="absolute left-[14px] top-[87.6px] font-['Afacad_Flux'] text-[15px] font-normal leading-tight text-[#080808] z-10">
          {badgeText}
        </p>
      )}

      {/* Large Suit Silhouette at Bottom Left */}
      <div className="absolute left-[-48px] top-[151px] w-[189px] h-[220px] pointer-events-none opacity-95">
        <img src={suitIcon} alt="" className="size-full object-contain" />
      </div>

      {/* Vertical Rotated Title on Right Side */}
      <div className="absolute right-[14px] top-[40px] bottom-[40px] w-[60px] flex items-center justify-center z-10 pointer-events-none">
        <span
          className="font-['Literata'] font-normal text-[24px] sm:text-[26px] whitespace-nowrap -rotate-90 origin-center block tracking-wide"
          style={{ color: titleColor }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}

// Reusable Playing Card Back Component based on Figma node 79:11
// With rank letter displaying K instead of Q as requested
function CardBack({
  bg = '#f6e0c5',
  rank = 'K',
  rankColor = '#080808',
  smallSuitIcon = null,
  suitPos = { left: '79px', top: '17px', width: '27px', height: '32px' },
  starIcon = null,
  description = '',
  className = '',
}) {
  return (
    <div
      className={`relative w-[265px] h-[372px] rounded-[16.5px] overflow-hidden shrink-0 select-none shadow-md ${className}`}
      style={{ backgroundColor: bg }}
    >
      {/* Paper texture highlights & fibers */}
      <img
        src="/assets/paper-highlights.svg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90"
        aria-hidden="true"
      />
      <img
        src="/assets/paper-fibers.svg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-80"
        aria-hidden="true"
      />

      {/* Top Left Rank or Star */}
      {starIcon ? (
        <div className="absolute left-[14px] top-[14px] size-[46px] z-10 pointer-events-none">
          <img src={starIcon} alt="Star" className="size-full" />
        </div>
      ) : (
        <>
          <span
            className="absolute left-[14px] top-[9.7px] font-['Bodoni_Moda'] font-normal text-[40px] leading-none z-10 pointer-events-none"
            style={{ color: rankColor }}
          >
            {rank}
          </span>
          {smallSuitIcon && (
            <div
              className="absolute z-10 pointer-events-none"
              style={{
                left: suitPos.left,
                top: suitPos.top,
                width: suitPos.width,
                height: suitPos.height,
              }}
            >
              <img src={smallSuitIcon} alt="" className="size-full object-contain" />
            </div>
          )}
        </>
      )}

      {/* Center Description Text */}
      <div className="absolute inset-x-[32px] top-[100px] bottom-[100px] flex items-center justify-center text-center z-10 pointer-events-none px-2">
        <p className="font-['Afacad_Flux'] text-[16px] sm:text-[17px] font-normal leading-[1.38] text-[#080808] max-w-[195px]">
          {description}
        </p>
      </div>

      {/* Bottom Right Inverted Rank or Star */}
      {starIcon ? (
        <div className="absolute right-[14px] bottom-[14px] size-[46px] z-10 rotate-180 pointer-events-none">
          <img src={starIcon} alt="Star" className="size-full" />
        </div>
      ) : (
        <>
          {smallSuitIcon && (
            <div
              className="absolute z-10 rotate-180 pointer-events-none"
              style={{
                right: suitPos.left,
                bottom: suitPos.top,
                width: suitPos.width,
                height: suitPos.height,
              }}
            >
              <img src={smallSuitIcon} alt="" className="size-full object-contain" />
            </div>
          )}
          <span
            className="absolute right-[14px] bottom-[9.7px] font-['Bodoni_Moda'] font-normal text-[40px] leading-none z-10 rotate-180 pointer-events-none"
            style={{ color: rankColor }}
          >
            {rank}
          </span>
        </>
      )}
    </div>
  );
}

// Reusable 3D Flippable Card Component (for Cards 1–3 and responsive cards)
function FlippableCard({
  front,
  back,
  className = '',
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`group/card relative w-[265px] h-[372px] shrink-0 select-none cursor-pointer [perspective:1000px] ${className}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped((prev) => !prev)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        }
      }}
      aria-label="Interactive flippable card"
    >
      <div
        className="relative w-full h-full rounded-[16.5px]"
        style={{
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 600ms cubic-bezier(0.4, 0.2, 0.2, 1)',
        }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 w-full h-full rounded-[16.5px] overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          {front}
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 w-full h-full rounded-[16.5px] overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}

// Specialized Component for Column 4:
// 1. Hover on Heart card: flips Heart card in place (no position swap).
// 2. Hover directly on hidden card (top 88px peeking area): swaps positions first, then flips hidden card.
function StackedCardColumn4() {
  const [isHeartFlipped, setIsHeartFlipped] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);

  // Hidden card (Joker / Agent) slot styling
  const jokerSlotStyle = {
    transform: isSwapped ? 'translateY(88px)' : 'translateY(0px)',
    zIndex: isSwapped ? 30 : 10,
    transition: isSwapped
      ? 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, z-index 0ms step-start 200ms'
      : 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, z-index 0ms step-end 200ms',
  };

  // Agent card flipper styling (stays facing original front side - no flip)
  const jokerFlipperStyle = {
    transform: 'rotateY(0deg)',
    transformStyle: 'preserve-3d',
    WebkitTransformStyle: 'preserve-3d',
  };

  // Heart card slot styling (swaps to back only when isSwapped is true)
  const heartSlotStyle = {
    transform: isSwapped ? 'translateY(-88px)' : 'translateY(0px)',
    zIndex: isSwapped ? 10 : 20,
    transition: isSwapped
      ? 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, z-index 0ms step-start 200ms'
      : 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, z-index 0ms step-end 200ms',
  };

  // Heart card flipper styling (flips in place when isHeartFlipped is true)
  const heartFlipperStyle = {
    transform: isHeartFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    transformStyle: 'preserve-3d',
    WebkitTransformStyle: 'preserve-3d',
    transition: 'transform 600ms cubic-bezier(0.4, 0.2, 0.2, 1)',
  };

  return (
    <div
      className="relative w-[265px] h-[460px] shrink-0 select-none [perspective:1000px]"
      onMouseLeave={() => {
        setIsSwapped(false);
        setIsHeartFlipped(false);
      }}
      role="region"
      aria-label="Stacked playing cards: Heart and Joker with interactive flip and swap"
    >
      {/* Top Hidden Card (Joker) Slot: starts at top, translates down to bottom slot when swapped */}
      <div
        className="absolute top-0 left-0 w-[265px] h-[372px]"
        style={jokerSlotStyle}
      >
        <div
          className="relative w-full h-full rounded-[16.5px]"
          style={jokerFlipperStyle}
        >
          {/* Joker Front */}
          <div
            className="absolute inset-0 w-full h-full rounded-[16.5px] overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
          >
            <PlayingCard
              bg="#cfb99d"
              starIcon="/assets/eight-pointed-star.svg"
              suitIcon="/assets/joker-symbol.svg"
              title="Design for agents"
              titleColor="#080808"
            />
          </div>

          {/* Joker Back */}
          <div
            className="absolute inset-0 w-full h-full rounded-[16.5px] overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <CardBack
              bg="#cfb99d"
              starIcon="/assets/eight-pointed-star.svg"
              description="Pioneering interfaces for agentic AI, multi-agent collaboration, and human-in-the-loop workflows."
            />
          </div>
        </div>
      </div>

      {/* Dedicated hit area for the exposed top portion of the hidden card (active when not swapped) */}
      {!isSwapped && (
        <div
          className="absolute top-0 left-0 w-full h-[88px] z-30 cursor-pointer"
          onMouseEnter={() => {
            setIsHeartFlipped(false);
            setIsSwapped(true);
          }}
          onClick={() => {
            setIsHeartFlipped(false);
            setIsSwapped(true);
          }}
          aria-label="Hover directly over the hidden card to swap and flip"
        />
      )}

      {/* Bottom Heart Card Slot: starts at y=88px flush with other cards */}
      <div
        className="absolute top-[88px] left-0 w-[265px] h-[372px] cursor-pointer"
        style={heartSlotStyle}
        onMouseEnter={() => {
          if (!isSwapped) {
            setIsHeartFlipped(true);
          }
        }}
        onMouseLeave={() => {
          setIsHeartFlipped(false);
        }}
        onClick={() => {
          if (!isSwapped) {
            setIsHeartFlipped((prev) => !prev);
          }
        }}
      >
        <div
          className="relative w-full h-full rounded-[16.5px]"
          style={heartFlipperStyle}
        >
          {/* Heart Front */}
          <div
            className="absolute inset-0 w-full h-full rounded-[16.5px] overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
          >
            <PlayingCard
              bg="#f6e0c5"
              rank="K"
              rankColor="#7d0f0f"
              suitIcon="/assets/heart-suit.svg"
              title="For the people"
              titleColor="#7d0f0f"
            />
          </div>

          {/* Heart Back (flips in place to reveal back with K rank) */}
          <div
            className="absolute inset-0 w-full h-full rounded-[16.5px] overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <CardBack
              bg="#f6e0c5"
              rank="K"
              rankColor="#7d0f0f"
              smallSuitIcon="/assets/heart-suit.svg"
              suitPos={{ left: '51px', top: '19px', width: '25px', height: '29px' }}
              description="Designing with empathy, focusing on real human behaviors, needs, and motivations."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CardsSection() {
  return (
    <section 
      id="about"
      className="relative w-full bg-[#1e1e1e] py-[80px] lg:py-[114px] px-6 md:px-16 lg:px-[114px] overflow-hidden"
    >
      {/* Background Dust Texture */}
      <div 
        className="absolute inset-0 w-full h-full opacity-60 pointer-events-none bg-repeat"
        style={{ backgroundImage: `url('/assets/dust-bg.png')`, backgroundSize: '218px 163px' }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1240px] mx-auto z-10 flex flex-col gap-[69px] items-start">
        
        {/* Section Heading (Afacad Flux 33.7px) */}
        <h2 className="font-['Afacad_Flux'] font-normal text-white text-[28px] md:text-[33.7px] tracking-wide">
          Cards I bring to the table
        </h2>

        {/* Desktop Layout: Frame 2147226207 (gap-[49px] items-end) */}
        <div className="hidden xl:flex gap-[49px] items-end w-full">
          
          {/* Card 1: Club (Unravelling Complexity) -> Flips on Hover to reveal K back */}
          <FlippableCard
            front={
              <PlayingCard
                bg="#f6e0c5"
                rank="K"
                rankColor="#080808"
                suitIcon="/assets/club-suit.svg"
                title="Unravelling Complexity"
                titleColor="#080808"
              />
            }
            back={
              <CardBack
                bg="#f6e0c5"
                rank="K"
                rankColor="#080808"
                smallSuitIcon="/assets/club-suit.svg"
                suitPos={{ left: '79px', top: '17px', width: '27px', height: '32px' }}
                description="Breaking down complex procceses, mapping dependencies, and streamlining interactions."
              />
            }
          />

          {/* Card 2: Diamond (Better Experiences) -> Flips on Hover to reveal K back */}
          <FlippableCard
            front={
              <PlayingCard
                bg="#f6e0c5"
                rank="K"
                rankColor="#7d0f0f"
                suitIcon="/assets/diamond-suit.svg"
                title="Better Experiences"
                titleColor="#7d0f0f"
              />
            }
            back={
              <CardBack
                bg="#f6e0c5"
                rank="K"
                rankColor="#7d0f0f"
                smallSuitIcon="/assets/diamond-suit.svg"
                suitPos={{ left: '48px', top: '21px', width: '24px', height: '27px' }}
                description="Crafting intuitive, accessible interfaces that delight users and drive real engagement."
              />
            }
          />

          {/* Card 3: Spade (Problem solving) -> Flips on Hover to reveal K back */}
          <FlippableCard
            front={
              <PlayingCard
                bg="#f6e0c5"
                rank="K"
                rankColor="#080808"
                suitIcon="/assets/spade-suit.svg"
                title="Problem solving"
                titleColor="#080808"
              />
            }
            back={
              <CardBack
                bg="#f6e0c5"
                rank="K"
                rankColor="#080808"
                smallSuitIcon="/assets/spade-suit.svg"
                suitPos={{ left: '48px', top: '18px', width: '24px', height: '28px' }}
                description="Approaching product challenges through research, systems thinking, and iterative design."
              />
            }
          />

          {/* 4th Column: Stacked Card Column (Heart flips in place; Hidden card swaps then flips) */}
          <StackedCardColumn4 />

        </div>

        {/* Responsive Layout for Tablets / Mobile: Flippable on hover / tap */}
        <div className="xl:hidden flex flex-wrap md:flex-nowrap gap-6 overflow-x-auto pb-6 scrollbar-thin w-full">
          <FlippableCard
            front={
              <PlayingCard
                bg="#f6e0c5"
                rank="K"
                rankColor="#080808"
                suitIcon="/assets/club-suit.svg"
                title="Unravelling Complexity"
                titleColor="#080808"
              />
            }
            back={
              <CardBack
                bg="#f6e0c5"
                rank="K"
                rankColor="#080808"
                smallSuitIcon="/assets/club-suit.svg"
                suitPos={{ left: '79px', top: '17px', width: '27px', height: '32px' }}
                description="Breaking down complex procceses, mapping dependencies, and streamlining interactions."
              />
            }
          />

          <FlippableCard
            front={
              <PlayingCard
                bg="#f6e0c5"
                rank="K"
                rankColor="#7d0f0f"
                suitIcon="/assets/diamond-suit.svg"
                title="Better Experiences"
                titleColor="#7d0f0f"
              />
            }
            back={
              <CardBack
                bg="#f6e0c5"
                rank="K"
                rankColor="#7d0f0f"
                smallSuitIcon="/assets/diamond-suit.svg"
                suitPos={{ left: '48px', top: '21px', width: '24px', height: '27px' }}
                description="Crafting intuitive, accessible interfaces that delight users and drive real engagement."
              />
            }
          />

          <FlippableCard
            front={
              <PlayingCard
                bg="#f6e0c5"
                rank="K"
                rankColor="#080808"
                suitIcon="/assets/spade-suit.svg"
                title="Problem solving"
                titleColor="#080808"
              />
            }
            back={
              <CardBack
                bg="#f6e0c5"
                rank="K"
                rankColor="#080808"
                smallSuitIcon="/assets/spade-suit.svg"
                suitPos={{ left: '48px', top: '18px', width: '24px', height: '28px' }}
                description="Approaching product challenges through research, systems thinking, and iterative design."
              />
            }
          />

          <FlippableCard
            front={
              <PlayingCard
                bg="#f6e0c5"
                rank="K"
                rankColor="#7d0f0f"
                suitIcon="/assets/heart-suit.svg"
                title="For the people"
                titleColor="#7d0f0f"
              />
            }
            back={
              <CardBack
                bg="#f6e0c5"
                rank="K"
                rankColor="#7d0f0f"
                smallSuitIcon="/assets/heart-suit.svg"
                suitPos={{ left: '51px', top: '19px', width: '25px', height: '29px' }}
                description="Designing with empathy, focusing on real human behaviors, needs, and motivations."
              />
            }
          />

          <FlippableCard
            front={
              <PlayingCard
                bg="#cfb99d"
                starIcon="/assets/eight-pointed-star.svg"
                suitIcon="/assets/joker-symbol.svg"
                title="Design for agents"
                titleColor="#080808"
              />
            }
            back={
              <CardBack
                bg="#cfb99d"
                starIcon="/assets/eight-pointed-star.svg"
                description="Pioneering interfaces for agentic AI, multi-agent collaboration, and human-in-the-loop workflows."
              />
            }
          />
        </div>

      </div>
    </section>
  );
}
