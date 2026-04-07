import { useState } from "react";
import { motion } from "framer-motion";

interface LeverProps {
  onPull: () => void;
  disabled: boolean;
  spinning: boolean;
}

export function Lever({ onPull, disabled, spinning }: LeverProps) {
  // Kita buat state lokal khusus untuk tuas agar bisa langsung mantul balik
  const [isPulled, setIsPulled] = useState(false);

  const handlePull = () => {
    if (disabled) return;
    
    setIsPulled(true);
    onPull(); // Jalankan fungsi putar mesin slot
    
    // Tuas langsung mantul balik ke atas setelah 150ms!
    setTimeout(() => {
      setIsPulled(false);
    }, 150);
  };

  return (
    <button
      onClick={handlePull}
      disabled={disabled}
      className="flex flex-col items-center gap-0 cursor-pointer disabled:cursor-not-allowed group focus:outline-none"
      aria-label="Pull lever to spin"
    >
      {/* Ball (Bola Tuas) */}
      <motion.div
        animate={isPulled ? { y: 45, scaleY: 0.8 } : { y: 0, scaleY: 1 }}
        // Fisika Pegas yang lebih realistis (bouncy)
        transition={{ type: "spring", stiffness: 600, damping: 10, mass: 1 }}
        className={`w-10 h-10 md:w-12 md:h-12 rounded-full cherry-gradient box-red-glow
          ${!disabled && !isPulled ? "group-hover:scale-110" : ""} z-10
          ${disabled ? "opacity-50" : "opacity-100"}`}
      />

      {/* Stick (Batang Tuas) */}
      <motion.div
        animate={isPulled ? { scaleY: 0.3 } : { scaleY: 1 }}
        transition={{ type: "spring", stiffness: 600, damping: 10, mass: 1 }}
        className="w-3 md:w-4 h-20 md:h-28 bg-gradient-to-b from-muted-foreground/60 to-muted-foreground/30 rounded-b-lg origin-top"
      />

      {/* Base (Pangkal Tuas) */}
      <div className="w-8 md:w-10 h-3 metal-gradient rounded-b-lg z-20" />

      {/* Label */}
      <p className="font-display text-[8px] md:text-[10px] text-muted-foreground mt-2 group-hover:text-primary transition-colors">
        PULL!
      </p>
    </button>
  );
}
