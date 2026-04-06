import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured in Supabase Secrets");
    }

    const randomSeed = Math.floor(Math.random() * 100000);

    // 🔥 PROMPT SUPERCHARGED: Fokus ke Storytelling & Overthinking
    const prompt = `
Random seed: ${randomSeed}

Kamu adalah AI "Ide Gass!" (santai, berani, relatable, agak nyeleneh).

TUGAS UTAMA:
Buat 20 topik diskusi/pertanyaan Bahasa Indonesia yang MEMANCING ORANG BERCERITA PANJANG LEBAR (curhat/debat/mikir keras), bukan sekadar jawaban singkat/receh.

KRITERIA WAJIB:
1. HARUS open-ended. Hindari sama sekali pertanyaan yang bisa dijawab dengan "Ya/Tidak" atau satu kata.
2. Gunakan kata pemicu cerita: "Ceritain dong momen saat...", "Kenapa menurut lo...", "Gimana rasanya pas...".
3. Bikin orang mikir keras, flashback, atau overthinking ("anjir ini gue banget").
4. Gaya bahasa tongkrongan (lo/gue, santai, boleh agak sarkas tapi tetap asik).

PEMBAGIAN 20 TOPIK:
- 5 Absurd Berbobot (Contoh: "Kalau besok kiamat zombie dan lo cuma punya barang di sebelah kiri lo sekarang buat bertahan hidup, apa rencananya?")
- 5 Deep Personal / Relatable Traumas (Contoh: "Momen terberat apa di umur 20-an yang bikin lo sadar kalau dunia nyata sekeras itu?")
- 5 Debat Tongkrongan (Contoh: "Menurut lo, selingkuh micro-cheating kayak sering chat temen lawan jenis itu wajar atau udah red flag? Kasih alasannya.")
- 5 Pemicu Overthinking (Contoh: "Hal apa yang paling lo sesalin karena nggak lo lakuin 5 tahun lalu, dan gimana dampaknya sekarang?")

FORMAT:
Kembalikan HANYA JSON array berisi 20 string. Tanpa intro, tanpa markdown, tanpa penjelasan apapun.
`;

    // 🚀 PAKAI VERSI 2.0 (Jangan pakai 2.5 karena belum rilis!)
    const model = "gemini-2.0-flash"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.95, // Suhu dinaikkan sedikit biar ide makin liar dan bervariasi
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error Detail:", result);
      throw new Error(result.error?.message || "Failed to fetch from Gemini API");
    }

    const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    let topics = [];

    try {
      topics = JSON.parse(rawText);
    } catch (err) {
      console.error("JSON parse error:", rawText);
      topics = [
        "Momen terberat apa di hidup lo yang akhirnya ngebentuk kepribadian lo yang sekarang?",
        "Menurut lo, kenapa orang zaman sekarang gampang banget ngerasa kesepian padahal selalu pegang HP?",
        "Kalau lo bisa memutar waktu dan ngasih satu kalimat nasihat buat diri lo di masa SMA, lo bakal bilang apa?",
        "Kebohongan terbesar apa yang pernah lo lakuin demi kelihatan baik-baik aja di depan keluarga/teman?",
        "Ceritain momen di mana lo merasa 'wah, gue udah benar-benar dewasa sekarang'."
      ];
    }

    return new Response(JSON.stringify({ topics }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    console.error("FATAL ERROR:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
