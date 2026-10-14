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
    image: '/assets/project-3-complex.png',
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
    <section id="work" className="w-full bg-[#1e1e1e] py-[70px] sm:py-[90px] md:py-[120px] px-4 sm:px-6 md:px-12 lg:px-16 xl:px-[111px] overflow-hidden">
      <div className="max-w-[1300px] xl:max-w-[1360px] 2xl:max-w-[1440px] mx-auto">
        
        {/* Section Title */}
        <h2 className="font-['Afacad_Flux'] font-normal text-white text-[28px] sm:text-[32px] md:text-[37.24px] tracking-wide mb-8 sm:mb-12 md:mb-[70px]">
          Selected Work
        </h2>

        {/* Project Cards List - Alternating Left & Right on Desktop */}
        <div className="flex flex-col gap-12 sm:gap-16 md:gap-24 lg:gap-[100px]">
          {projects.map((proj) => {
            const isLeft = proj.align === 'left';

            return (
              <div
                key={proj.id}
                className={`flex w-full ${isLeft ? 'justify-start' : 'justify-end'}`}
              >
                {/* Main Project Card Link Container (w-[749.5px]) */}
                <a
                  href={proj.slug}
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate(proj.slug);
                    }
                  }}
                  className="project-card w-full lg:w-[700px] xl:w-[749.5px] flex flex-col gap-5 sm:gap-8 md:gap-[50px] shrink-0 custom-black-cursor no-underline text-inherit group origin-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-xl"
                  data-cursor="view"
                >
                  
                  {/* Card Media & Tags */}
                  <div className="w-full flex flex-col items-start gap-0">
                    
                    {/* Tags Row with compact layered overlap */}
                    <div className="flex items-end -space-x-[6px] sm:-space-x-[8.5px] z-10 max-w-full overflow-x-auto no-scrollbar pt-1 pb-0 mb-0">
                      {proj.tags.map((tag, idx) => (
                        <div
                          key={idx}
                          className="h-[30px] sm:h-[38.2px] px-2.5 sm:px-5 flex items-center justify-center rounded-tl-[8.23px] rounded-tr-[8.23px] shadow-sm relative shrink-0"
                          style={{
                            backgroundColor: tag.bg,
                            color: tag.color,
                            zIndex: 10 + idx,
                          }}
                        >
                          <span className="font-['Afacad_Flux'] font-normal text-[12px] sm:text-[14px] md:text-[15.8px] whitespace-nowrap">
                            {tag.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Project Image Box */}
                    <div className="project-card-image-box w-full aspect-[16/10] sm:aspect-[16/9.2] lg:h-[425px] rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] overflow-hidden shadow-[2.2px_2.93px_2.93px_0px_rgba(0,0,0,0.25)] bg-[#2a2a2a] relative">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="project-card-image w-full h-full object-cover object-center pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Project Title */}
                  <h3 className="font-['Afacad_Flux'] font-normal text-white text-[18px] sm:text-[23px] md:text-[30.6px] leading-snug w-full">
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
