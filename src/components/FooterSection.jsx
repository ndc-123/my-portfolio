import React, { useState } from 'react';

export default function FooterSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full bg-[#1e1e1e] pt-[70px] sm:pt-[90px] md:pt-[130px] pb-[75px] sm:pb-[95px] md:pb-[115px] px-4 sm:px-6 md:px-16 lg:px-[118px] relative overflow-hidden ${isHovered ? 'custom-black-cursor' : ''}`}
    >
      <div className="max-w-[1244px] mx-auto flex flex-col lg:flex-row items-start justify-between gap-10 sm:gap-12 lg:gap-8 relative">
        
        {/* Left Heading & Neha Cursor Badge */}
        <div className="flex flex-col items-start relative">
          <h2 className="font-['Afacad_Flux'] font-normal text-white text-[32px] sm:text-[42px] md:text-[54px] leading-tight mb-6 sm:mb-8">
            Lets connect :)
          </h2>

          {/* Multiplayer Cursor Badge 1: Neha (image 234) */}
          <div className="select-none mt-2">
            <img 
              src="/assets/cursor-neha-badge.png" 
              alt="Neha cursor" 
              className="w-[85px] sm:w-[95px] h-auto object-contain drop-shadow"
            />
          </div>
        </div>

        {/* Right Contact Buttons Grid (2x2) */}
        <div className="w-full lg:w-auto flex flex-col gap-4 sm:gap-5 relative">
          
          {/* Row 1: Email & Phone */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
            {/* Email Button */}
            <button
              type="button"
              onClick={handleCopyEmail}
              className="w-full sm:w-[306px] h-[52px] sm:h-[54.5px] bg-white border border-white rounded-[8.3px] px-4 sm:px-5 flex items-center justify-between shadow-sm hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              title="Click to copy email"
            >
              <span className="font-['Afacad_Flux'] font-normal text-[#080808] text-[15px] xs:text-[17px] sm:text-[20.9px] truncate sm:whitespace-nowrap">
                {copiedEmail ? 'Copied to clipboard!' : 'nehadc9d@gmail.com'}
              </span>
              <img src="/assets/copy-icon-email.svg" alt="Copy" className="size-[16px] shrink-0 ml-2" />
            </button>

            {/* Phone Button */}
            <button
              type="button"
              onClick={handleCopyPhone}
              className="w-full sm:w-[306px] h-[52px] sm:h-[54.5px] bg-transparent border border-white rounded-[8.3px] px-4 sm:px-5 flex items-center justify-between shadow-sm hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              title="Click to copy phone"
            >
              <span className="font-['Afacad_Flux'] font-normal text-white text-[16px] sm:text-[20.9px] whitespace-nowrap">
                {copiedPhone ? 'Copied to clipboard!' : '+91 7517306689'}
              </span>
              <img src="/assets/copy-icon-phone.svg" alt="Copy" className="size-[16px] shrink-0 ml-2" />
            </button>
          </div>

          {/* Row 2: Behance & LinkedIn */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
            {/* Behance Button */}
            <a
              href="https://www.behance.net/nehachaware"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-[306px] h-[52px] sm:h-[54.5px] bg-transparent border border-white rounded-[8.3px] px-4 sm:px-5 flex items-center justify-between shadow-sm hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <span className="font-['Afacad_Flux'] font-normal text-white text-[17px] sm:text-[20.9px]">
                Behance
              </span>
              <img src="/assets/arrow-behance.svg" alt="Arrow" className="size-[22.8px] shrink-0 ml-2 transform -rotate-45" />
            </a>

            {/* LinkedIn Button Container */}
            <div className="relative w-full sm:w-[306px]">
              <a
                href="https://www.linkedin.com/in/neha-chaware-749b26217/?isSelfProfile=true"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-[52px] sm:h-[54.5px] bg-white border border-white rounded-[8.3px] px-4 sm:px-5 flex items-center justify-between shadow-sm hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <span className="font-['Afacad_Flux'] font-normal text-[#1e1e1e] text-[17px] sm:text-[20.9px]">
                  Linkedin
                </span>
                <img src="/assets/arrow-linkedin.svg" alt="Arrow" className="size-[22.8px] shrink-0 ml-2 transform -rotate-45" />
              </a>

              {/* Multiplayer Cursor Badge 2: You (image 235) */}
              {!isHovered && (
                <div className="connect-you-badge hidden sm:block select-none absolute left-0 bottom-[-76px] pointer-events-none transition-opacity duration-150">
                  <img 
                    src="/assets/cursor-you-badge.png" 
                    alt="You cursor" 
                    className="w-[84px] h-[62px] object-contain drop-shadow"
                  />
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
