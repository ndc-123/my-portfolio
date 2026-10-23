import React from 'react';

const projects = [
  {
    id: 1,
    slug: '/projects/ecosys',
    title: '[1/4] Designing an unified system for zoo operations - From manual to digital workflows',
    image: '/assets/project-1-zoo.png',
    tags: [
      { text: 'OOUX', bg: '#bbfcc6', color: '#1e1e1e' },
      { text: 'B2B workflows', bg: '#a0ebb1', color: '#1e1e1e' },
      { text: 'Enterprise UX', bg: '#74b882', color: '#1e1e1e' },
    ],
    align: 'left',
  },
  {
    id: 2,
    slug: '/projects/reloom',
    title: '[2/4] How can we make people choose sustainability?',
    image: '/assets/project-2-sustainability.png',
    tags: [
      { text: 'Sustainability', bg: '#e0d98e', color: '#1e1e1e' },
      { text: 'Interaction Design', bg: '#f8ccbe', color: '#1e1e1e' },
      { text: 'Fashion', bg: '#cfc1f1', color: '#1e1e1e' },
    ],
    align: 'right',
  },
  {
    id: 3,
    slug: '/projects/legacy-system',
    title: '[3/4] How might we enhance user experiences of complex systems?',
    image: '/assets/cover LW.png',
    tags: [
      { text: 'Internship', bg: '#86aab5', color: '#1e1e1e' },
      { text: 'B2B workflows', bg: '#d4e8fb', color: '#1e1e1e' },
      { text: 'Fintech', bg: '#fdfffe', color: '#1e1e1e' },
    ],
    align: 'left',
  },
  {
    id: 4,
    slug: '/projects/strava',
    title: '[4/4] How can we make performance tracking in Strava feel more effortless?',
    image: '/assets/project-3-strava.png',
    tags: [
      { text: 'Cognitive Ergonomics', bg: '#060606', color: '#ffffff' },
      { text: 'Redesign', bg: '#91340d', color: '#ffffff' },
      { text: 'Fitness', bg: '#c8592a', color: '#ffffff' },
    ],
    align: 'right',
  },
];

export default function ProjectsSection({ onNavigate }) {
  return (
    <section id="work" className="w-full bg-[#1e1e1e] py-[60px] sm:py-[75px] md:py-[95px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-[90px] overflow-hidden">
      <div className="max-w-[1200px] xl:max-w-[1260px] 2xl:max-w-[1360px] mx-auto">
        
        {/* Section Title */}
        <h2 className="font-['Afacad_Flux'] font-normal text-white text-[26px] sm:text-[29px] md:text-[31px] tracking-wide mb-6 sm:mb-8 md:mb-[52px]">
          Selected Work
        </h2>

        {/* Project Cards List - Alternating Left & Right on Desktop */}
        <div className="flex flex-col gap-10 sm:gap-14 md:gap-18 lg:gap-[76px]">
          {projects.map((proj) => {
            const isLeft = proj.align === 'left';

            return (
              <div
                key={proj.id}
                className={`flex w-full ${isLeft ? 'justify-start' : 'justify-end'}`}
              >
                {/* Main Project Card Link Container */}
                <a
                  href={proj.slug}
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate(proj.slug);
                    }
                  }}
                  className="project-card w-full lg:w-[580px] xl:w-[615px] 2xl:w-[645px] flex flex-col gap-4 sm:gap-6 md:gap-[36px] shrink-0 custom-black-cursor no-underline text-inherit group origin-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-xl"
                  data-cursor="view"
                >
                  
                  {/* Card Media & Tags */}
                  <div className="w-full flex flex-col items-start gap-0">
                    
                    {/* Tags Row with compact layered overlap */}
                    <div className="flex items-end -space-x-[6px] sm:-space-x-[8px] z-10 max-w-full overflow-x-auto no-scrollbar pt-1 pb-0 mb-0">
                      {proj.tags.map((tag, idx) => (
                        <div
                          key={idx}
                          className="h-[26px] sm:h-[32px] px-2 sm:px-3.5 flex items-center justify-center rounded-tl-[7px] rounded-tr-[7px] shadow-sm relative shrink-0"
                          style={{
                            backgroundColor: tag.bg,
                            color: tag.color,
                            zIndex: 10 + idx,
                          }}
                        >
                          <span className="font-['Afacad_Flux'] font-normal text-[11.5px] sm:text-[13px] md:text-[14px] whitespace-nowrap">
                            {tag.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Project Image Box */}
                    <div className="project-card-image-box w-full aspect-[16/10] sm:aspect-[16/9.2] lg:h-[355px] xl:h-[375px] rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] overflow-hidden shadow-[2.2px_2.93px_2.93px_0px_rgba(0,0,0,0.25)] bg-[#2a2a2a] relative">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="project-card-image w-full h-full object-cover object-center pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Project Title */}
                  <h3 className="font-['Afacad_Flux'] font-normal text-white text-[17px] sm:text-[20px] md:text-[24px] leading-snug w-full">
                    {proj.title}
                  </h3>
                </a>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
