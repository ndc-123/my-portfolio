import React from 'react';

export default function TestimonialsSection() {
  return (
    <section className="w-full bg-[#1e1e1e] py-[60px] sm:py-[75px] md:py-[95px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-[95px] overflow-hidden">
      <div className="max-w-[1200px] xl:max-w-[1280px] 2xl:max-w-[1380px] mx-auto flex flex-col gap-6 sm:gap-8 md:gap-[46px]">
        
        {/* Section Heading */}
        <h2 className="font-['Afacad_Flux'] font-normal text-white text-[26px] sm:text-[32px] md:text-[38px] tracking-wide">
          Testimonials
        </h2>

        {/* Testimonial Card 1: James Andy Hopkins */}
        <div className="relative bg-[#c4b2fb] border-[1px] border-white rounded-[9.2px] p-5 pb-7 sm:p-7 sm:pb-8 md:p-10 lg:p-12 text-[#080808] shadow-xl overflow-hidden">
          
          {/* Top Left Playing Card Rank */}
          <span 
            className="absolute left-[12px] sm:left-[16px] top-[8px] sm:top-[10px] font-['Bodoni_Moda'] font-normal text-[24px] sm:text-[28px] leading-none select-none text-[#080808]"
            aria-hidden="true"
          >
            A
          </span>

          {/* Bottom Right Playing Card Rank (Inverted) */}
          <span 
            className="absolute right-[14px] sm:right-[20px] bottom-[10px] sm:bottom-[14px] font-['Bodoni_Moda'] font-normal text-[26px] sm:text-[32px] leading-none rotate-180 select-none text-[#080808]"
            aria-hidden="true"
          >
            A
          </span>

          {/* Quote Body */}
          <blockquote className="font-['Afacad_Flux'] font-normal text-[15px] sm:text-[16.5px] md:text-[18px] lg:text-[19px] leading-relaxed mb-5 sm:mb-6 max-w-[1020px] pt-3 sm:pt-0">
            <p className="mb-3">
              “Based on her performance during her internship, I am confident that Neha will be a valuable asset to any organization seeking a talented UX professional. Her combination of design expertise, strong work ethic, attention to detail, and ability to deliver meaningful results under deadlines sets her apart from her peers. I recommend her without reservation for opportunities in user experience design, product design, customer experience, and related fields. I am confident that she will bring the same level of dedication, creativity, and professionalism to any future role. I am sure you will be as impressed as we were.”
            </p>
            <footer className="font-['Afacad_Flux'] text-[14px] sm:text-[16px] md:text-[17.5px] lg:text-[18.5px] leading-normal not-italic">
              ~ <strong className="font-bold">James Andy Hopkins</strong> | CEO &amp; President: Terrace Finance Corp
            </footer>
          </blockquote>

          {/* "Read Full LOR" Button */}
          <a
            href="https://drive.google.com/file/d/1Z7hzMRanHUUx0qT_3lQYUDlgqFl6qkOV/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#f1eefa] py-1 px-2.5 sm:py-[3px] sm:px-[5px] rounded-[7.8px] shadow-sm hover:bg-white transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
            data-cursor="view"
          >
            <div className="size-[38px] sm:size-[44px] rounded overflow-hidden shrink-0 shadow-sm">
              <img 
                src="/assets/testimonial-hopkins.png" 
                alt="Letter of Recommendation thumbnail" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-['Afacad_Flux'] font-normal text-[#080808] text-[13.5px] sm:text-[15.5px] pr-2.5">
              Read Full LOR
            </span>
          </a>

        </div>

        {/* Testimonial Card 2: Anup Palikondawar */}
        <div className="relative bg-[#f1dabe] border-[1px] border-[#b4c8be] rounded-[9.2px] p-5 pb-7 sm:p-7 sm:pb-8 md:p-10 lg:p-12 text-[#080808] shadow-xl overflow-hidden">
          
          {/* Top Left Playing Card Rank */}
          <span 
            className="absolute left-[12px] sm:left-[16px] top-[8px] sm:top-[10px] font-['Bodoni_Moda'] font-normal text-[24px] sm:text-[28px] leading-none select-none text-[#7d0f0f]"
            aria-hidden="true"
          >
            A
          </span>

          {/* Bottom Right Playing Card Rank (Inverted) */}
          <span 
            className="absolute right-[14px] sm:right-[20px] bottom-[10px] sm:bottom-[14px] font-['Bodoni_Moda'] font-normal text-[26px] sm:text-[32px] leading-none rotate-180 select-none text-[#7d0f0f]"
            aria-hidden="true"
          >
            A
          </span>

          {/* Quote Body */}
          <blockquote className="font-['Afacad_Flux'] font-normal text-[15px] sm:text-[16.5px] md:text-[18px] lg:text-[19px] leading-relaxed max-w-[1020px] pt-3 sm:pt-0">
            <p className="mb-3">
              “Neha demonstrated strong ownership of the screen design activities, taking responsibility for delivering quality outcomes and driving tasks to completion. She works effectively with cross-functional teams, actively seeking and incorporating feedback to continuously improve the user experience. She communicates clearly with business stakeholders and consistently considers both business needs and end-user experience while designing solutions.”
            </p>
            <footer className="font-['Afacad_Flux'] text-[14px] sm:text-[16px] md:text-[17.5px] lg:text-[18.5px] leading-normal not-italic">
              ~ <strong className="font-bold">Anup Palikondawar</strong> | Senior QA Lead: Athneo Digital Innovations
            </footer>
          </blockquote>

        </div>

      </div>
    </section>
  );
}
