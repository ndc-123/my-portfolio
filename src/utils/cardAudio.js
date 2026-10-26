// Audio utility for playing subtle, realistic playing-card flip sound effects

let audioCtx = null;
let cardFlipBuffer = null;
let synthesizedBuffer = null;
let loadPromise = null;

// Track the last time a flip sound was played for each card to prevent duplicate triggers
const lastPlayedTimes = new Map();
const MIN_FLIP_INTERVAL_MS = 240;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

// Realistic playing card flip synthesis (cached for instant fallback)
function getSynthesizedFlipBuffer(ctx) {
  if (synthesizedBuffer) return synthesizedBuffer;

  const sampleRate = ctx.sampleRate;
  const duration = 0.135; // 135ms crisp physical card flick and soft swish
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const channelData = buffer.getChannelData(0);

  let bp_x1 = 0, bp_x2 = 0, bp_y1 = 0, bp_y2 = 0;
  let hp_x1 = 0, hp_y1 = 0;
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const progress = t / duration;
    const white = Math.random() * 2 - 1;

    // Pink noise
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.153852;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;

    const noise = pink * 0.6 + white * 0.4;

    // Gliding Bandpass Filter for the swish (2100Hz -> 1350Hz as card turns through air)
    const fc = 2100 - 750 * progress;
    const Q = 1.8;
    const w0 = (2 * Math.PI * fc) / sampleRate;
    const alpha = Math.sin(w0) / (2 * Q);
    const b_bp0 = alpha;
    const b_bp1 = 0;
    const b_bp2 = -alpha;
    const a_bp0 = 1 + alpha;
    const a_bp1 = -2 * Math.cos(w0);
    const a_bp2 = 1 - alpha;

    const bp_out = (b_bp0 * noise + b_bp1 * bp_x1 + b_bp2 * bp_x2 - a_bp1 * bp_y1 - a_bp2 * bp_y2) / a_bp0;
    bp_x2 = bp_x1;
    bp_x1 = noise;
    bp_y2 = bp_y1;
    bp_y1 = bp_out;

    // High-pass texture for crisp paper surface feel (fc ~ 3200Hz)
    const hp_rc = 1.0 / (2 * Math.PI * 3200);
    const hp_dt = 1.0 / sampleRate;
    const hp_alpha = hp_rc / (hp_rc + hp_dt);
    const hp_out = hp_alpha * (hp_y1 + white - hp_x1);
    hp_x1 = white;
    hp_y1 = hp_out;

    // Soft Swish envelope (peaks at 18ms, smoothly dies out by 115ms)
    let envSwish = 0;
    if (t < 0.018) {
      envSwish = Math.pow(t / 0.018, 1.4);
    } else if (t < 0.115) {
      const p = (t - 0.018) / (0.115 - 0.018);
      envSwish = Math.pow(1 - p, 2.2);
    }

    // Crisp paper flick transient at t=0..14ms
    let flick = 0;
    if (t < 0.014) {
      const flickEnv = Math.exp(-t * 420);
      flick = flickEnv * (0.65 * Math.sin(2 * Math.PI * 2700 * t) + 0.35 * Math.sin(2 * Math.PI * 750 * t));
    }

    // Micro paper scrape (accompanies the flick for tactile paper crispness)
    let scrape = 0;
    if (t < 0.030) {
      const scrapeEnv = Math.exp(-t * 220);
      scrape = scrapeEnv * hp_out * 0.35;
    }

    // Very subtle card-body air settle at t=65..95ms
    let settle = 0;
    if (t > 0.065 && t < 0.095) {
      const dt = t - 0.065;
      const settleEnv = Math.exp(-dt * 300);
      settle = settleEnv * 0.18 * Math.sin(2 * Math.PI * 880 * dt);
    }

    // Combine all components into natural physical card sound
    let sample = (flick * 0.55) + (scrape * 0.4) + (bp_out * envSwish * 0.65) + (settle * 0.35);

    // Subtle volume scaling (peak ~ 0.28)
    sample = Math.max(-1, Math.min(1, sample * 0.7));

    // End-of-sample fade out
    if (t > 0.125) {
      const fadeOut = (duration - t) / (duration - 0.125);
      sample *= Math.max(0, fadeOut);
    }

    channelData[i] = sample;
  }

  synthesizedBuffer = buffer;
  return buffer;
}

// Preload the sound buffer from /assets/card-flip.wav
async function loadCardFlipBuffer(ctx) {
  if (cardFlipBuffer) return cardFlipBuffer;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const res = await fetch('/assets/card-flip.wav');
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        cardFlipBuffer = await ctx.decodeAudioData(arrayBuffer);
        return cardFlipBuffer;
      }
    } catch {
      // Fallback handled below
    }
    cardFlipBuffer = getSynthesizedFlipBuffer(ctx);
    return cardFlipBuffer;
  })();

  return loadPromise;
}

/**
 * Play a subtle, realistic card flip sound effect.
 * Synchronized with the card flip animation on user interaction.
 *
 * @param {string} cardId - Unique identifier for the card to debounce rapid triggers
 */
export function playCardFlipSound(cardId = 'default') {
  if (typeof window === 'undefined') return;

  const now = performance.now();
  const lastTime = lastPlayedTimes.get(cardId) || 0;
  if (now - lastTime < MIN_FLIP_INTERVAL_MS) {
    return; // Avoid overlapping or repeatedly triggering sounds during a single flip
  }

  const ctx = getAudioContext();
  if (!ctx) {
    try {
      lastPlayedTimes.set(cardId, performance.now());
      const audio = new Audio('/assets/card-flip.wav');
      audio.volume = 0.35;
      audio.play().catch(() => {});
    } catch {}
    return;
  }

  // Resume context if suspended (complies with browser autoplay policy on user gesture)
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const playBuffer = (buffer) => {
    try {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gainNode = ctx.createGain();
      // Keep volume subtle and pleasant (not loud or distracting)
      gainNode.gain.value = 0.35;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
      source.start(0);
      lastPlayedTimes.set(cardId, performance.now());
    } catch {}
  };

  if (cardFlipBuffer) {
    playBuffer(cardFlipBuffer);
  } else {
    // Play synthesized buffer immediately so there is 0ms latency on the first flip
    const fallbackBuffer = getSynthesizedFlipBuffer(ctx);
    playBuffer(fallbackBuffer);
    // Asynchronously preload decoded asset for subsequent flips
    loadCardFlipBuffer(ctx);
  }
}
