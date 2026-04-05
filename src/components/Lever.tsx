import { motion } from "framer-motion";

interface LeverProps {
  onPull: () => void;
  disabled: boolean;
  spinning: boolean;
}

export function Lever({ onPull, disabled, spinning }: LeverProps) {
  return (
    <button
      onClick={onPull}
      disabled={disabled}
      className="flex flex-col items-center gap-0 cursor-pointer disabled:cursor-not-allowed group focus:outline-none"
      aria-label="Pull lever to spin"
    >
      {/* Ball */}
      <motion.div
        animate={spinning ? { y: 30 } : { y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full cherry-gradient box-red-glow
          group-hover:scale-110 group-active:scale-95 transition-transform z-10
          group-disabled:opacity-50"
      />

      {/* Stick */}
      <motion.div
        animate={spinning ? { scaleY: 0.6 } : { scaleY: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="w-3 md:w-4 h-20 md:h-28 bg-gradient-to-b from-muted-foreground/60 to-muted-foreground/30 rounded-b-lg origin-top"
      />

      {/* Base */}
      <div className="w-8 md:w-10 h-3 metal-gradient rounded-b-lg" />

      {/* Label */}
      <p className="font-display text-[8px] md:text-[10px] text-muted-foreground mt-2 group-hover:text-primary transition-colors">
        PULL!
      </p>
    </button>
  );
}
