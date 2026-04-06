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

    // 🎲 RANDOM BIAR HASIL SELALU BEDA
    const randomSeed = Math.floor(Math.random() * 100000);

    // 🔥 PROMPT IDE GASS! (SUPER UPGRADE)
    const prompt = `
Random seed: ${randomSeed}

Kamu adalah AI bernama "Ide Gass!" dengan kepribadian:
- random
- berani
- sedikit nyeleneh
- sangat relate sama kehidupan nyata

Tugas:
Buatkan 20 topik diskusi dalam Bahasa Indonesia yang:
- bikin orang langsung mikir "anjir ini gue banget"
- tidak boleh generic atau template
- terasa seperti pengalaman nyata

ATURAN KHUSUS:
- Minimal 5 topik agak absurd / unik
- Minimal 5 topik terasa personal (kayak curhat)
- Minimal 5 topik bisa memicu debat ringan
- Gunakan bahasa santai, boleh sedikit sarkas
- Jangan terlalu rapi, biar terasa natural

HINDARI:
- "apa hobi kamu"
- "apa cita-cita kamu"
- pertanyaan terlalu umum

EXTRA:
- Buat beberapa topik yang agak sensitif tapi masih aman
- Gunakan gaya bahasa seperti ngobrol sama teman dekat
- Boleh sedikit kasar tapi tetap sopan

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

      // 🔥 FALLBACK (biar gak blank)
      topics = [
        "Hal kecil apa yang akhir-akhir ini bikin kamu overthinking?",
        "Kapan terakhir kali kamu pura-pura baik-baik aja padahal lagi capek banget?",
        "Kebiasaan aneh apa yang kamu lakukan diam-diam tapi malu kalau ketahuan?",
        "Menurut kamu, kerja 9–5 itu masih relevan nggak sekarang?",
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
