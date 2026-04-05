import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

interface CountdownTimerProps {
  topic: string;
}

export function CountdownTimer({ topic }: CountdownTimerProps) {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = timeLeft ?? minutes * 60 + seconds;
  const displayMin = Math.floor(totalSeconds / 60);
  const displaySec = totalSeconds % 60;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const start = () => {
    const total = timeLeft ?? minutes * 60 + seconds;
    if (total <= 0) return;
    setTimeLeft(total);
    setRunning(true);
    setFinished(false);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearTimer();
          setRunning(false);
          setFinished(true);
          // Play alarm sound
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 800;
            gain.gain.value = 0.3;
            osc.start();
            setTimeout(() => { osc.frequency.value = 1000; }, 200);
            setTimeout(() => { osc.frequency.value = 800; }, 400);
            setTimeout(() => { osc.stop(); ctx.close(); }, 600);
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    clearTimer();
    setRunning(false);
  };

  const reset = () => {
    clearTimer();
    setRunning(false);
    setFinished(false);
    setTimeLeft(null);
  };

  const isStarted = timeLeft !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-xl mx-auto"
    >
      {/* Selected Topic */}
      <div className="text-center mb-6">
        <p className="font-display text-[10px] md:text-xs text-muted-foreground mb-2">TOPIK TERPILIH</p>
        <motion.h3
          className="font-body font-extrabold text-xl md:text-3xl text-primary gold-glow leading-tight"
          animate={finished ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5, repeat: finished ? Infinity : 0 }}
        >
          {topic}
        </motion.h3>
      </div>

      {/* Timer Display */}
      <div className="bg-card rounded-2xl border border-border p-6 md:p-8 box-gold-glow">
        {!isStarted ? (
          /* Duration Input */
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex flex-col items-center">
              <label className="font-display text-[8px] text-muted-foreground mb-1">MIN</label>
              <input
                type="number"
                min={0}
                max={99}
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
                className="w-20 h-16 text-center text-4xl font-body font-bold bg-background border-2 border-border rounded-xl text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <span className="text-3xl font-bold text-primary mt-4">:</span>
            <div className="flex flex-col items-center">
              <label className="font-display text-[8px] text-muted-foreground mb-1">SEC</label>
              <input
                type="number"
                min={0}
                max={59}
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-20 h-16 text-center text-4xl font-body font-bold bg-background border-2 border-border rounded-xl text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        ) : (
          /* Countdown Display */
          <div className="text-center mb-6">
            <motion.p
              className={`font-body font-black text-6xl md:text-8xl tabular-nums ${
                finished ? "text-accent red-glow" : totalSeconds <= 10 ? "text-accent" : "text-primary gold-glow"
              }`}
              animate={totalSeconds <= 10 && running ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {String(displayMin).padStart(2, "0")}:{String(displaySec).padStart(2, "0")}
            </motion.p>
            {finished && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display text-xs text-accent mt-3 red-glow"
              >
                ⏰ WAKTU HABIS!
              </motion.p>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {!running && !finished && (
            <button
              onClick={start}
              disabled={!isStarted && minutes === 0 && seconds === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-body font-bold text-sm
                gold-gradient text-primary-foreground hover:opacity-90 transition-opacity
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              {isStarted ? "RESUME" : "START"}
            </button>
          )}
          {running && (
            <button
              onClick={pause}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-body font-bold text-sm
                bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity"
            >
              <Pause className="w-4 h-4" />
              PAUSE
            </button>
          )}
          {isStarted && (
            <button
              onClick={reset}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-body font-bold text-sm
                bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              RESET
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
