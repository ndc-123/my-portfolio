/**
 * Interactive Vinyl CDs / Records Exhibition Data
 * 
 * To replace placeholder audio with your own music:
 * 1. Place your audio files (e.g. mp3 or wav) in /public/assets/audio/
 * 2. Update the audioSrc, title, subtitle, and genre details below.
 */

export const VINYL_EXHIBITION_TRACKS = [
  {
    id: 'cd-01',
    wallIndex: 2, // Back Wall
    order: 0,
    title: 'Serenade in Solitude',
    prefix: 'Serenade in Solitude',
    text: '· Soft Acoustic Instrumental',
    genre: 'Soft Instrumental',
    textureSrc: '/assets/museum/vinyl/cd1-relaxing.png',
    audioSrc: '/assets/audio/cd1-relaxing-instrumental.wav',
    duration: '03:45',
    rpm: '33 ⅓ RPM',
    color: '#d97736',
    glowColor: 'rgba(217, 119, 54, 0.55)',
    description: 'A soothing, peaceful instrumental featuring gentle acoustic plucks and warm ambient harmonies.',
  },
  {
    id: 'cd-02',
    wallIndex: 2, // Back Wall
    order: 1,
    title: 'Midnight Reverie',
    prefix: 'Midnight Reverie',
    text: '· Mellow Lo-Fi Instrumental',
    genre: 'Mellow Lo-Fi',
    textureSrc: '/assets/museum/vinyl/cd2-lofi.png',
    audioSrc: '/assets/audio/cd2-lofi-instrumental.wav',
    duration: '04:12',
    rpm: '33 ⅓ RPM',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.55)',
    description: 'A nostalgic, mellow lo-fi instrumental with warm Rhodes electric piano and vintage vinyl character.',
  },
  {
    id: 'cd-03',
    wallIndex: 2, // Back Wall
    order: 2,
    title: 'Electric Bloom',
    prefix: 'Electric Bloom',
    text: '· Upbeat Playful Instrumental',
    genre: 'Upbeat Groove',
    textureSrc: '/assets/museum/vinyl/cd3-upbeat.png',
    audioSrc: '/assets/audio/cd3-upbeat-instrumental.wav',
    duration: '03:18',
    rpm: '45 RPM',
    color: '#14b8a6',
    glowColor: 'rgba(20, 184, 166, 0.55)',
    description: 'A lively, upbeat instrumental filled with bouncy marimba melodies and playful rhythm.',
  },
];
