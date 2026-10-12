import React from 'react';

export default function HeroSection() {
  return (
    <section className="w-full bg-[#1e1e1e] pt-[20px] md:pt-[45px] lg:pt-[70px] pb-[60px] md:pb-[90px] lg:pb-[140px] px-6 md:px-16 lg:px-[118px]">
      <div className="max-w-[1240px] mx-auto flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12 lg:gap-[60px] xl:gap-[182px]">
        
        {/* Left Column - Auto Layout (Frame 2147226205) */}
        <div className="w-full lg:w-[554px] flex flex-col gap-[48px] items-start shrink-0">
          
          {/* Top text block (Frame 2147226204) */}
          <div className="w-full flex flex-col gap-[21px] items-start">
            
            {/* Badge & Title group (Frame 2147226203) */}
            <div className="w-full sm:w-[355px] flex flex-col gap-[20px] items-start">
              
              {/* Badge: Hi, Neha here */}
              <div className="flex h-[35.69px] items-center justify-center">
                <div className="rotate-[-0.22deg]">
                  <div className="bg-[#ddc197] shadow-[0px_4px_2px_rgba(0,0,0,0.25)] flex h-[35px] items-center justify-center px-[12.2px] py-[7px] rounded-tl-[10px] rounded-br-[10px] w-[185.2px]">
                    <span className="font-['Afacad_Flux'] font-normal text-[#080808] text-[20px] leading-tight whitespace-nowrap">
                      Hi, Neha here
                    </span>
                  </div>
                </div>
              </div>

              {/* Heading: UX Designer & Storyteller */}
              <h1 className="font-['Afacad_Flux'] font-normal text-white text-[32px] sm:text-[35px] leading-tight h-[46px] flex items-center">
                UX Designer &amp; Storyteller
              </h1>
            </div>

            {/* Tagline Paragraph */}
            <p className="font-['Afacad_Flux'] font-normal text-white text-[24px] sm:text-[27px] leading-[1.18] max-w-[554px]">
              From <strong className="font-bold">whys</strong> to <strong className="font-bold">what ifs</strong> I’m curious about people, systems, technology and learning whats new out there to create experiences that mean something.
            </p>
          </div>

          {/* CTA Button: skip to work → */}
          <a
            href="#work"
            className="inline-flex items-center justify-center border-2 border-[#f0e7e7] rounded-[10px] w-[245px] h-[57.65px] font-['Literata'] font-normal text-white text-[22.56px] hover:bg-white/10 transition-colors"
          >
            skip to work →
          </a>
        </div>

        {/* Right Column - Layered Polaroid Photo Stack & Pin (Group 6) */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end shrink-0">
          <div className="relative w-[310px] h-[360px] sm:w-[370px] sm:h-[420px] md:w-[440.11px] md:h-[490.18px] shrink-0 select-none scale-[0.72] sm:scale-[0.84] md:scale-100 origin-top lg:origin-top-right">
            
            {/* Bottom Layer - Light Grey Card */}
            <div 
              className="absolute left-0 top-[52.4px] w-[412.82px] h-[437.78px] rounded-[8.24px] bg-[#9b9d9c]"
              aria-hidden="true"
            />

            {/* Middle Layer - Dark Card */}
            <div 
              className="absolute left-[10.15px] top-[38.28px] w-[414.65px] h-[439.72px] rounded-[8.28px] bg-[#191f17]"
              aria-hidden="true"
            />

            {/* Top Layer - Main Photo Card */}
            <div 
              className="absolute left-[27.3px] top-[27px] w-[412.82px] h-[437.78px] rounded-[8.24px] bg-[#e3d8d8] overflow-hidden shadow-2xl"
            >
              {/* Photo with exact Figma crop and positioning */}
              <img 
                src="/assets/hero-portrait.png" 
                alt="Neha Chaware" 
                className="absolute pointer-events-none max-w-none"
                style={{
                  width: '798.66px',
                  height: '1198.74px',
                  left: '-195.83px',
                  top: '-372.53px',
                }}
              />

            </div>

            {/* Push Pin (pinned at offset x=226px, top=0) */}
            <div 
              className="absolute left-[226px] top-0 size-[52px] z-20 pointer-events-none drop-shadow-md"
            >
              <img 
                src="/assets/push-pin.svg" 
                alt="Push Pin" 
                className="size-full"
              />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
