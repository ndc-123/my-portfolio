import React, { useState } from 'react';

export default function FooterSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('nehadc9d@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+91 7517306689');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <footer 
      id="connect" 
      className="w-full bg-[#1e1e1e] pt-[60px] sm:pt-[75px] md:pt-[90px] xl:pt-[105px] pb-[70px] sm:pb-[85px] md:pb-[100px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-[95px] relative overflow-hidden"
    >
      <div className="max-w-[1200px] xl:max-w-[1280px] 2xl:max-w-[1380px] mx-auto flex flex-col lg:flex-row items-start justify-between gap-8 sm:gap-10 lg:gap-8 relative">
        
        {/* Left Heading & Neha Cursor Badge */}
        <div className="flex flex-col items-start relative">
          <h2 className="font-['Afacad_Flux'] font-normal text-white text-[28px] sm:text-[36px] md:text-[44px] leading-tight mb-5 sm:mb-6 max-w-[460px]">
            You’ve come too far to not connect :)
          </h2>

          {/* Multiplayer Cursor Badge 1: Neha (image 234) */}
          <div className="select-none mt-1">
            <img 
              src="/assets/cursor-neha-badge.png" 
              alt="Neha cursor" 
              className="w-[72px] sm:w-[82px] h-auto object-contain drop-shadow"
            />
          </div>
        </div>

        {/* Right Contact Buttons Grid (2x2) */}
        <div className="w-full lg:w-auto flex flex-col gap-3.5 sm:gap-4 relative">
          
          {/* Row 1: Email & Phone */}
          <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4">
            {/* Email Button */}
            <button
              type="button"
              onClick={handleCopyEmail}
              className="w-full sm:w-[245px] xl:w-[265px] h-[46px] sm:h-[48px] bg-white border border-white rounded-[7.5px] px-3.5 sm:px-4 flex items-center justify-between shadow-sm hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              title="Click to copy email"
            >
              <span className="font-['Afacad_Flux'] font-normal text-[#080808] text-[14px] sm:text-[17px] truncate sm:whitespace-nowrap">
                {copiedEmail ? 'Copied to clipboard!' : 'nehadc9d@gmail.com'}
              </span>
              <img src="/assets/copy-icon-email.svg" alt="Copy" className="size-[14px] shrink-0 ml-2" />
            </button>

            {/* Phone Button */}
            <button
              type="button"
              onClick={handleCopyPhone}
              className="w-full sm:w-[245px] xl:w-[265px] h-[46px] sm:h-[48px] bg-transparent border border-white rounded-[7.5px] px-3.5 sm:px-4 flex items-center justify-between shadow-sm hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              title="Click to copy phone"
            >
              <span className="font-['Afacad_Flux'] font-normal text-white text-[14px] sm:text-[17px] whitespace-nowrap">
                {copiedPhone ? 'Copied to clipboard!' : '+91 7517306689'}
              </span>
              <img src="/assets/copy-icon-phone.svg" alt="Copy" className="size-[14px] shrink-0 ml-2" />
            </button>
          </div>

          {/* Row 2: Behance & LinkedIn */}
          <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4">
            {/* Behance Button */}
            <a
              href="https://www.behance.net/nehachaware"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-[245px] xl:w-[265px] h-[46px] sm:h-[48px] bg-transparent border border-white rounded-[7.5px] px-3.5 sm:px-4 flex items-center justify-between shadow-sm hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <span className="font-['Afacad_Flux'] font-normal text-white text-[14.5px] sm:text-[17px]">
                Behance
              </span>
              <img src="/assets/arrow-behance.svg" alt="Arrow" className="size-[19px] shrink-0 ml-2 transform -rotate-45" />
            </a>

            {/* LinkedIn Button Container */}
            <div className="relative w-full sm:w-[245px] xl:w-[265px]">
              <a
                href="https://www.linkedin.com/in/neha-chaware-749b26217/?isSelfProfile=true"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-[46px] sm:h-[48px] bg-white border border-white rounded-[7.5px] px-3.5 sm:px-4 flex items-center justify-between shadow-sm hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <span className="font-['Afacad_Flux'] font-normal text-[#1e1e1e] text-[14.5px] sm:text-[17px]">
                  Linkedin
                </span>
                <img src="/assets/arrow-linkedin.svg" alt="Arrow" className="size-[19px] shrink-0 ml-2 transform -rotate-45" />
              </a>

              {/* Multiplayer Cursor Badge 2: You (image 235) */}
              <div className="connect-you-badge hidden sm:block select-none absolute left-0 bottom-[-60px] pointer-events-none">
                <img 
                  src="/assets/cursor-you-badge.png" 
                  alt="You cursor" 
                  className="w-[72px] h-[53px] object-contain drop-shadow"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
