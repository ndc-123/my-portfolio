/**
 * Photo Room Exhibition Data
 * 
 * Organized for easy replacement with personal photo collections.
 * Exactly 4 walls with exactly 4 photos each = 16 photos total.
 */

export const PHOTO_ROOM_WALLS = [
  {
    id: 'front',
    name: 'Front Wall',
    subheading: 'Museum Collection & Exhibits',
    normal: [0, 0, 1], // facing towards positive Z (from -Z wall looking into room)
    photos: [
      {
        id: 'museum-01',
        title: 'Skies of culture',
        caption: 'Skies of culture',
        src: '/assets/museum/1.png',
        aspectRatio: 972 / 648,
      },
      {
        id: 'museum-02',
        title: 'Kokan : Frozen horses',
        caption: 'Kokan : Frozen horses',
        src: '/assets/museum/2.png',
        aspectRatio: 807 / 939,
      },
      {
        id: 'museum-03',
        title: 'The world from beneath',
        caption: 'The world from beneath',
        src: '/assets/museum/3.png',
        aspectRatio: 915 / 609,
      },
      {
        id: 'museum-04',
        title: 'City birds of the village',
        caption: 'City birds of the village',
        src: '/assets/museum/4.png',
        aspectRatio: 918 / 651,
      },
    ],
  },
  {
    id: 'right',
    name: 'Right Wall',
    subheading: 'Poetry & Anthologies',
    normal: [-1, 0, 0], // facing towards negative X (from +X wall looking into room)
    photos: [
      {
        id: 'poetry-01',
        title: 'Surreal Moments',
        caption: 'Co-author: Published on Amazon, Flipkart, Googlebooks, kindle',
        prefix: 'Co-author:',
        text: 'Published on Amazon, Flipkart, Googlebooks, kindle',
        src: '/assets/museum/5.png',
        aspectRatio: 600 / 906,
      },
      {
        id: 'poetry-03',
        title: 'Sand Castles & Paper Boats',
        caption: 'Co-author: Published on Amazon, Flipkart, Googlebooks, kindle',
        prefix: 'Co-author:',
        text: 'Published on Amazon, Flipkart, Googlebooks, kindle',
        src: '/assets/museum/7.png',
        aspectRatio: 616 / 888,
        hideWallCaption: true,
      },
      {
        id: 'poetry-02',
        title: 'How do you write your poem?',
        caption: 'Poem: “How do you write your poem”',
        prefix: 'Poem:',
        text: '“How do you write your poem”',
        src: '/assets/museum/6.png',
        aspectRatio: 992 / 775,
      },
      {
        id: 'poetry-04',
        title: 'Cursed',
        caption: 'Poem: “Cursed”',
        prefix: 'Poem:',
        text: '“Cursed”',
        src: '/assets/museum/8.png',
        aspectRatio: 1054 / 827,
      },
    ],
  },
  {
    id: 'back',
    name: 'Back Wall',
    subheading: 'Listening Lounge & Vinyl Collection',
    normal: [0, 0, -1], // facing towards negative Z (from +Z wall looking into room)
    photos: [
      {
        id: 'cd-01',
        title: 'Serenade in Solitude',
        caption: 'Serenade in Solitude · Soft Acoustic Instrumental',
        prefix: 'Serenade in Solitude',
        text: '· Soft Acoustic Instrumental',
        src: '/assets/museum/vinyl/cd1-relaxing.png',
        audioSrc: '/assets/audio/cd1-relaxing-instrumental.wav',
        aspectRatio: 1,
      },
      {
        id: 'cd-02',
        title: 'Midnight Reverie',
        caption: 'Midnight Reverie · Mellow Lo-Fi Instrumental',
        prefix: 'Midnight Reverie',
        text: '· Mellow Lo-Fi Instrumental',
        src: '/assets/museum/vinyl/cd2-lofi.png',
        audioSrc: '/assets/audio/cd2-lofi-instrumental.wav',
        aspectRatio: 1,
      },
      {
        id: 'cd-03',
        title: 'Electric Bloom',
        caption: 'Electric Bloom · Upbeat Playful Instrumental',
        prefix: 'Electric Bloom',
        text: '· Upbeat Playful Instrumental',
        src: '/assets/museum/vinyl/cd3-upbeat.png',
        audioSrc: '/assets/audio/cd3-upbeat-instrumental.wav',
        aspectRatio: 1,
      },
    ],
  },
  {
    id: 'left',
    name: 'Left Wall',
    subheading: 'Community & Volunteering',
    normal: [1, 0, 0], // facing towards positive X (from -X wall looking into room)
    photos: [
      {
        id: 'volunteer-01',
        title: 'Teacher Volunteer',
        prefix: 'Teacher Volunteer',
        text: '@ Seva arogy(a) foundation for underprivileged children',
        caption: 'Teacher Volunteer @ Seva arogy(a) foundation for underprivileged children',
        src: '/assets/museum/9.png',
        aspectRatio: 664 / 614,
      },
      {
        id: 'volunteer-02',
        title: 'Music Therapy',
        prefix: 'Music Therapy',
        text: '@ Niwara Old age home',
        caption: 'Music Therapy @ Niwara Old age home',
        src: '/assets/museum/10.png',
        aspectRatio: 818 / 614,
      },
      {
        id: 'volunteer-03',
        title: 'Bootcamp',
        prefix: 'Bootcamp',
        text: '@ Govitri Village',
        caption: 'Bootcamp @ Govitri Village',
        src: '/assets/museum/11.png',
        aspectRatio: 846 / 612,
      },
    ],
  },
];
