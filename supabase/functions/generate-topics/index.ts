import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const G4F_API_KEY = Deno.env.get("G4F_API_KEY");
    if (!G4F_API_KEY) {
      throw new Error("G4F_API_KEY is not configured");
    }

    // 🎲 RANDOM BIAR HASIL SELALU BEDA
    const randomSeed = Math.floor(Math.random() * 100000);

    // 🔥 PROMPT IDE GASS!
    const prompt = `
Random seed: ${randomSeed}

Kamu adalah AI "Ide Gass!" yang:
- random
- berani
- relatable
- sedikit nyeleneh

Tugas:
Buatkan 20 topik diskusi Bahasa Indonesia yang:
- bikin orang mikir "anjir ini gue banget"
- tidak boleh generic
- terasa real

ATURAN:
- 5 absurd
- 5 personal
- 5 debat ringan
- santai, boleh sarkas
- jangan terlalu formal

FORMAT:
JSON array 20 string tanpa penjelasan
`;

    // 🚀 CALL G4F API
    const response = await fetch("https://api.g4f.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${G4F_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // bisa kamu ganti nanti
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("G4F error:", text);
      throw new Error("Failed to fetch from G4F API");
    }

    const data = await response.json();

    let rawText =
      data.choices?.[0]?.message?.content || "[]";

    let topics = [];

    // 🔥 CLEAN RESPONSE
    rawText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      topics = JSON.parse(rawText);
    } catch (err) {
      console.error("JSON parse error:", rawText);

      // 🔥 FALLBACK
      topics = [
        "Hal kecil apa yang bikin kamu overthinking belakangan ini?",
        "Kapan terakhir kali kamu ngerasa 'ini gue banget'?",
        "Kebiasaan aneh yang kamu sembunyiin dari orang lain?",
        "Menurut kamu kerja sekarang makin capek atau biasa aja?",
        "Hal random apa yang sering kamu pikirin sebelum tidur?",
      ];
    }

    return new Response(JSON.stringify({ topics }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("ERROR:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
