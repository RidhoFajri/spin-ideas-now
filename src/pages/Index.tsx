import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { SlotMachine } from "@/components/SlotMachine";
import { CountdownTimer } from "@/components/CountdownTimer";
import { generateTopics } from "@/lib/topics";
import "@fontsource/press-start-2p";

const Index = () => {
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const loadTopics = useCallback(async () => {
    setLoading(true);
    setSelectedTopic(null);
    const newTopics = await generateTopics();
    setTopics(newTopics);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

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
          Tarik tuas, dapatkan topik, mulai diskusi!
        </p>
      </motion.div>

      {/* Slot Machine */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl mb-8"
      >
        <SlotMachine
          topics={topics}
          onTopicSelected={setSelectedTopic}
          isLoading={loading}
        />
      </motion.div>

      {/* Generate New Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={loadTopics}
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-semibold text-sm
          bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80
          transition-colors disabled:opacity-40 disabled:cursor-not-allowed mb-10"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        Generate Topik Baru
      </motion.button>

      {/* Timer Section */}
      {selectedTopic && (
        <CountdownTimer topic={selectedTopic} />
      )}

      {/* Footer decorations */}
      <div className="mt-auto pt-12">
        <p className="font-display text-[8px] text-muted-foreground/40">
          ★ GOOD LUCK ★
        </p>
      </div>
    </div>
  );
};

export default Index;
