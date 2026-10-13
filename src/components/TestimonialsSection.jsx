import React from 'react';

export default function TestimonialsSection() {
  return (
    <section className="w-full bg-[#1e1e1e] py-[70px] sm:py-[90px] md:py-[120px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-[117px] overflow-hidden">
      <div className="max-w-[1244px] xl:max-w-[1320px] 2xl:max-w-[1440px] mx-auto flex flex-col gap-8 sm:gap-10 md:gap-[60px]">
        
        {/* Section Heading */}
        <h2 className="font-['Afacad_Flux'] font-normal text-white text-[28px] sm:text-[36px] md:text-[48px] tracking-wide">
          Testimonials
        </h2>

        {/* Testimonial Card 1: James Andy Hopkins */}
        <div className="relative bg-[#c4b2fb] border-[1px] border-white rounded-[9.2px] p-5 pb-8 sm:p-8 sm:pb-10 md:p-12 lg:p-16 text-[#080808] shadow-xl overflow-hidden">
          
          {/* Top Left Playing Card Rank */}
          <span 
            className="absolute left-[12px] sm:left-[16px] top-[8px] sm:top-[10px] font-['Bodoni_Moda'] font-normal text-[28px] sm:text-[35px] leading-none select-none text-[#080808]"
            aria-hidden="true"
          >
            A
          </span>

          {/* Bottom Right Playing Card Rank (Inverted) */}
          <span 
            className="absolute right-[14px] sm:right-[20px] bottom-[10px] sm:bottom-[14px] font-['Bodoni_Moda'] font-normal text-[32px] sm:text-[41px] leading-none rotate-180 select-none text-[#080808]"
            aria-hidden="true"
          >
            A
          </span>

          {/* Quote Body */}
          <blockquote className="font-['Afacad_Flux'] font-normal text-[16px] sm:text-[18px] md:text-[21px] lg:text-[23.1px] leading-relaxed mb-6 sm:mb-8 max-w-[1150px] pt-4 sm:pt-0">
            <p className="mb-4">
              “Based on her performance during her internship, I am confident that Neha will be a valuable asset to any organization seeking a talented UX professional. Her combination of design expertise, strong work ethic, attention to detail, and ability to deliver meaningful results under deadlines sets her apart from her peers. I recommend her without reservation for opportunities in user experience design, product design, customer experience, and related fields. I am confident that she will bring the same level of dedication, creativity, and professionalism to any future role. I am sure you will be as impressed as we were.”
            </p>
            <footer className="font-['Afacad_Flux'] text-[15px] sm:text-[18px] md:text-[21px] lg:text-[23.1px] leading-normal not-italic">
              ~ <strong className="font-bold">James Andy Hopkins</strong> | CEO &amp; President: Terrace Finance Corp
            </footer>
          </blockquote>

          {/* "Read Full LOR" Button */}
          <a
            href="https://drive.google.com/file/d/1Z7hzMRanHUUx0qT_3lQYUDlgqFl6qkOV/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#f1eefa] py-1 px-3 sm:py-[4px] sm:px-[6px] rounded-[7.8px] shadow-sm hover:bg-white transition-colors custom-orange-cursor no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
          >
            <div className="size-[44px] sm:size-[53.7px] rounded overflow-hidden shrink-0 shadow-sm">
              <img 
                src="/assets/testimonial-hopkins.png" 
                alt="Letter of Recommendation thumbnail" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-['Afacad_Flux'] font-normal text-[#080808] text-[15px] sm:text-[18.6px] pr-3">
              Read Full LOR
            </span>
          </a>

        </div>

        {/* Testimonial Card 2: Anup Palikondawar */}
        <div className="relative bg-[#f1dabe] border-[1px] border-[#b4c8be] rounded-[9.2px] p-5 pb-8 sm:p-8 sm:pb-10 md:p-12 lg:p-16 text-[#080808] shadow-xl overflow-hidden">
          
          {/* Top Left Playing Card Rank */}
          <span 
            className="absolute left-[12px] sm:left-[16px] top-[8px] sm:top-[10px] font-['Bodoni_Moda'] font-normal text-[28px] sm:text-[35px] leading-none select-none text-[#7d0f0f]"
            aria-hidden="true"
          >
            A
          </span>

          {/* Bottom Right Playing Card Rank (Inverted) */}
          <span 
            className="absolute right-[14px] sm:right-[20px] bottom-[10px] sm:bottom-[14px] font-['Bodoni_Moda'] font-normal text-[32px] sm:text-[41px] leading-none rotate-180 select-none text-[#7d0f0f]"
            aria-hidden="true"
          >
            A
          </span>

          {/* Quote Body */}
          <blockquote className="font-['Afacad_Flux'] font-normal text-[16px] sm:text-[18px] md:text-[21px] lg:text-[23.1px] leading-relaxed max-w-[1150px] pt-4 sm:pt-0">
            <p className="mb-4">
              “Neha demonstrated strong ownership of the screen design activities, taking responsibility for delivering quality outcomes and driving tasks to completion. She works effectively with cross-functional teams, actively seeking and incorporating feedback to continuously improve the user experience. She communicates clearly with business stakeholders and consistently considers both business needs and end-user experience while designing solutions.”
            </p>
            <footer className="font-['Afacad_Flux'] text-[15px] sm:text-[18px] md:text-[21px] lg:text-[23.1px] leading-normal not-italic">
              ~ <strong className="font-bold">Anup Palikondawar</strong> | Senior QA Lead: Athneo Digital Innovations
            </footer>
          </blockquote>

        </div>

      </div>
    </section>
  );
}
