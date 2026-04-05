// Sound effects using Web Audio API

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

export function playSlotTick() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.value = 400 + Math.random() * 200;
    gain.gain.value = 0.08;
    osc.start(ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.stop(ctx.currentTime + 0.05);
  } catch {}
}

export function playSlotWin() {
  try {
    const ctx = getAudioContext();
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0.15;
      const startTime = ctx.currentTime + i * 0.12;
      osc.start(startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
      osc.stop(startTime + 0.3);
    });
  } catch {}
}

export function playCountdownWarning() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.12;
    osc.start(ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
}

export function playTimerFinished() {
  try {
    const ctx = getAudioContext();
    // Three-tone alarm
    const pattern = [
      { freq: 880, time: 0 },
      { freq: 1100, time: 0.15 },
      { freq: 880, time: 0.3 },
      { freq: 1100, time: 0.5 },
      { freq: 880, time: 0.65 },
      { freq: 1320, time: 0.8 },
    ];
    pattern.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.value = 0.15;
      const startTime = ctx.currentTime + time;
      osc.start(startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
      osc.stop(startTime + 0.12);
    });
  } catch {}
}
