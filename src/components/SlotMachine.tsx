import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Lever } from "./Lever";
import { playSlotTick, playSlotWin } from "@/lib/sounds";

interface SlotMachineProps {
  topics: string[];
  onTopicSelected: (topic: string) => void;
  isLoading: boolean;
}

export function SlotMachine({ topics, onTopicSelected, isLoading }: SlotMachineProps) {
  const [spinning, setSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutChainRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    timeoutChainRef.current.forEach(clearTimeout);
    timeoutChainRef.current = [];
  }, []);

  useEffect(() => () => clearAllTimers(), [clearAllTimers]);

  const spin = useCallback(() => {
    if (spinning || topics.length === 0 || isLoading) return;

    setSpinning(true);
    setSelectedTopic(null);

    let speed = 50;
    let count = 0;
    const totalFastSpins = 30 + Math.floor(Math.random() * 20);
    const finalIndex = Math.floor(Math.random() * topics.length);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % topics.length);
      playSlotTick();
      count++;

      if (count >= totalFastSpins) {
        clearInterval(intervalRef.current!);
        let slowCount = 0;
        const slowSpins = 8 + Math.floor(Math.random() * 5);
        let currentSlow = (count % topics.length);

        const doSlowSpin = () => {
          slowCount++;
          speed = 50 + slowCount * 80;
          currentSlow = (currentSlow + 1) % topics.length;
          setCurrentIndex(currentSlow);
          playSlotTick();

          if (slowCount >= slowSpins) {
            setCurrentIndex(finalIndex);
            setSelectedTopic(topics[finalIndex]);
            setSpinning(false);
            onTopicSelected(topics[finalIndex]);
            playSlotWin();

            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.5 },
              colors: ["#FFD700", "#FF4444", "#FFA500", "#FFFFFF"],
            });
          } else {
            const t = setTimeout(doSlowSpin, speed);
            timeoutChainRef.current.push(t);
          }
        };
        const t = setTimeout(doSlowSpin, speed);
        timeoutChainRef.current.push(t);
      }
    }, speed);
  }, [spinning, topics, isLoading, onTopicSelected, clearAllTimers]);

  const displayTopic = topics.length > 0 ? topics[currentIndex] || "" : "";

  return (
    <div className="flex items-center gap-4 md:gap-6">
      <div className="flex-1 max-w-xl">
        <div className="gold-gradient rounded-t-2xl px-6 py-3 text-center">
          <h2 className="font-display text-xs md:text-sm text-primary-foreground tracking-wider">
            🎰 TOPIC SPINNER 🎰
          </h2>
        </div>

        <div className="metal-gradient border-x-4 border-gold/30 px-4 md:px-8 py-6 md:py-10">
          <div className="relative bg-background rounded-xl overflow-hidden slot-inner-shadow border-2 border-gold/20">
            <div className="absolute inset-0 pointer-events-none opacity-5"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
              }}
            />
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-16 md:h-20 border-y-2 border-gold/40 pointer-events-none z-10" />

            <div className="h-32 md:h-40 flex items-center justify-center px-4 md:px-8">
              {isLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-3 border-gold/30 border-t-gold rounded-full"
                  />
                  <p className="font-display text-[10px] text-muted-foreground">GENERATING...</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={currentIndex + displayTopic}
                    initial={spinning ? { y: -40, opacity: 0 } : { scale: 0.8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={spinning ? { y: 40, opacity: 0 } : { scale: 0.8, opacity: 0 }}
                    transition={{ duration: spinning ? 0.05 : 0.4 }}
                    className={`text-center font-body font-bold text-base md:text-xl leading-tight ${
                      selectedTopic ? "text-primary gold-glow" : "text-foreground"
                    }`}
                  >
                    {displayTopic || "Pull the lever to spin!"}
                  </motion.p>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        <div className="gold-gradient rounded-b-2xl px-6 py-2 flex items-center justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-cherry"
              animate={spinning ? {
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              } : { opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                repeat: spinning ? Infinity : 0,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </div>

      <Lever onPull={spin} disabled={spinning || isLoading || topics.length === 0} spinning={spinning} />
    </div>
  );
}
