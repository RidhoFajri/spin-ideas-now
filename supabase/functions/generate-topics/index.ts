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
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // 🔥 PROMPT IDE GASS! (UPGRADED)
    const prompt = `
Kamu adalah AI bernama "Ide Gass!" — generator ide yang fun, relate, dan bikin orang langsung pengen ikut ngobrol.

Tugas:
Buatkan 20 topik diskusi dalam Bahasa Indonesia.

STYLE:
- Santai, Gen Z banget
- Relatable sama kehidupan sekarang
- Bikin orang mikir: "anjir ini gue banget"

ATURAN:
- HARUS open-ended (bukan ya/tidak)
- Bisa jadi obrolan panjang
- Variatif:
  • pengalaman hidup
  • overthinking
  • kerja & quarter-life crisis
  • hubungan & friendship
  • kebiasaan random
  • nostalgia
  • debat ringan
  • unpopular opinion
- Jangan terlalu generic

FORMAT WAJIB:
Balas HANYA JSON array berisi 20 string
Tanpa penjelasan tambahan
`;

    // 🚀 CALL GEMINI
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Gemini error:", text);
      throw new Error("Failed to fetch from Gemini API");
    }

    const data = await response.json();

    let rawText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    let topics = [];

    // 🔥 CLEAN RESPONSE (kadang Gemini nambah ```json)
    rawText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      topics = JSON.parse(rawText);
    } catch (err) {
      console.error("JSON parse error:", rawText);

      // 🔥 FALLBACK (biar gak blank di frontend)
      topics = [
        "Hal kecil apa yang akhir-akhir ini bikin kamu overthinking?",
        "Kebiasaan aneh apa yang kamu lakukan tapi jarang orang tahu?",
        "Menurut kamu, kerja 9–5 itu masih relevan nggak sekarang?",
        "Hal paling random yang pernah kamu lakukan karena gabut?",
        "Apa momen paling 'ini gue banget' dalam hidup kamu?",
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
