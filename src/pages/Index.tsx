import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, RotateCcw } from "lucide-react";
import { SlotMachine } from "@/components/SlotMachine";
import { CountdownTimer } from "@/components/CountdownTimer";
import { generateTopics } from "@/lib/topics";
import "@fontsource/press-start-2p";

const Index = () => {
  const [topics, setTopics] = useState<string[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  const [isRefilling, setIsRefilling] = useState(false);
  const isFetchingRef = useRef(false); 
  
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const fetchMoreTopics = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setIsRefilling(true);

    try {
      const newTopics = await generateTopics();
      setTopics((prev) => {
        const combined = [...prev, ...newTopics];
        return Array.from(new Set(combined));
      });
    } catch (error) {
      console.error("Gagal generate topik:", error);
    } finally {
      setIsInitialLoading(false);
      setIsRefilling(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchMoreTopics();
  }, [fetchMoreTopics]);

  const handleTopicSelected = (topic: string) => {
    setSelectedTopic(topic);

    setTopics((prev) => {
      const sisaStok = prev.filter((t) => t !== topic);
      // Auto-fetch berjalan diam-diam tanpa mengubah UI
      if (sisaStok.length < 5) {
        fetchMoreTopics();
      }
      return sisaStok;
    });
  };

  const handleBackToSpin = () => {
    setSelectedTopic(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8 md:py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-12"
      >
        <h1 className="font-display text-lg md:text-2xl text-primary gold-glow mb-2">
          RANDOM TOPIC
        </h1>
        <p className="font-body text-sm md:text-base text-muted-foreground">
          Rekam, tarik tuas, dapatkan topik, mulai!
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selectedTopic ? (
          /* Slot Machine View */
          <motion.div
            key="slot"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl flex flex-col items-center"
          >
            <div className="w-full mb-8">
              <SlotMachine
                topics={topics}
                onTopicSelected={handleTopicSelected}
                isLoading={isInitialLoading} 
              />
            </div>

            {/* Generate New Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={fetchMoreTopics}
              disabled={isRefilling}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-semibold text-sm
                bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80
                transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isRefilling ? "animate-spin" : ""}`} />
              {isRefilling ? "Generating Topik..." : "Generate Topik Baru"}
            </motion.button>
          </motion.div>
        ) : (
          /* Topic Selected View */
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl flex flex-col items-center"
          >
            <CountdownTimer topic={selectedTopic} />

            {/* Back to Spin Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={handleBackToSpin}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-semibold text-sm
                bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80
                transition-colors mt-8"
            >
              <RotateCcw className="w-4 h-4" />
              Spin Topik Baru
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-auto pt-12">
        <p className="font-display text-[8px] text-muted-foreground/40">
          ★ SEMUA TOPIK/PERTANYAAN MILIK ALLAH ★
        </p>
      </div>
    </div>
  );
};

export default Index;
