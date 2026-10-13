import React from 'react';

export default function HeroSection() {
  return (
    <section className="w-full bg-[#1e1e1e] pt-[20px] md:pt-[40px] lg:pt-[55px] xl:pt-[70px] pb-[60px] md:pb-[80px] lg:pb-[110px] xl:pb-[140px] px-4 sm:px-6 md:px-12 lg:px-14 xl:px-[100px] 2xl:px-[118px] overflow-hidden">
      <div className="max-w-[1240px] xl:max-w-[1320px] 2xl:max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-12 lg:gap-8 xl:gap-[60px] 2xl:gap-[140px]">
        
        {/* Left Column - Auto Layout (Frame 2147226205) */}
        <div className="w-full lg:flex-1 lg:max-w-[554px] flex flex-col gap-8 sm:gap-10 md:gap-[48px] items-start shrink-0">
          
          {/* Top text block (Frame 2147226204) */}
          <div className="w-full flex flex-col gap-[21px] items-start">
            
            {/* Badge & Title group (Frame 2147226203) */}
            <div className="w-full sm:w-[355px] flex flex-col gap-4 sm:gap-[20px] items-start">
              
              {/* Badge: Hi, Neha here */}
              <div className="flex h-[35.69px] items-center justify-center">
                <div className="rotate-[-0.22deg]">
                  <div className="bg-[#ddc197] shadow-[0px_4px_2px_rgba(0,0,0,0.25)] flex h-[35px] items-center justify-center px-[12.2px] py-[7px] rounded-tl-[10px] rounded-br-[10px] w-[185.2px]">
                    <span className="font-['Afacad_Flux'] font-normal text-[#080808] text-[18px] sm:text-[20px] leading-tight whitespace-nowrap">
                      Hi, Neha here
                    </span>
                  </div>
                </div>
              </div>

              {/* Heading: UX Designer & Storyteller */}
              <h1 className="font-['Afacad_Flux'] font-normal text-white text-[28px] sm:text-[35px] leading-tight flex items-center">
                UX Designer &amp; Storyteller
              </h1>
            </div>

            {/* Tagline Paragraph */}
            <p className="font-['Afacad_Flux'] font-normal text-white text-[19px] sm:text-[24px] md:text-[27px] leading-[1.25] sm:leading-[1.18] max-w-[554px]">
              From <strong className="font-bold">whys</strong> to <strong className="font-bold">what ifs</strong> I’m curious about people, systems, technology and learning whats new out there to create experiences that mean something.
            </p>
          </div>

          {/* CTA Button: skip to work → */}
          <a
            href="#work"
            className="inline-flex items-center justify-center border-2 border-[#f0e7e7] rounded-[10px] w-full max-w-[245px] h-[50px] sm:h-[57.65px] font-['Literata'] font-normal text-white text-[19px] sm:text-[22.56px] hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            skip to work →
          </a>
        </div>

        {/* Right Column - Layered Polaroid Photo Stack & Pin (Group 6) */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end shrink-0 max-w-full">
          <div 
            className="relative shrink-0 select-none w-[clamp(255px,75vw,360px)] lg:w-[clamp(310px,26vw,380px)] xl:w-[440.11px] h-[calc(clamp(255px,75vw,360px)*1.11376)] lg:h-[calc(clamp(310px,26vw,380px)*1.11376)] xl:h-[490.18px]"
          >
            <div 
              className="absolute top-0 left-0 w-[440.11px] h-[490.18px] origin-top-left pointer-events-none scale-[calc(clamp(255px,75vw,360px)/440.11)] lg:scale-[calc(clamp(310px,26vw,380px)/440.11)] xl:scale-100"
            >
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
                  alt="Neha Chaware portrait" 
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

      </div>
    </section>
  );
}
