import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // 1. Handle preflight CORS request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 🔥 UBAH NAMA SECRET KE GEMINI
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured in Supabase Secrets");
    }

    // 🎲 RANDOM BIAR HASIL SELALU BEDA
    const randomSeed = Math.floor(Math.random() * 100000);

    // 🔥 PROMPT IDE GASS! (Sama persis seperti milikmu)
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
- buat pertanyaan yang akan memberikan sedikit jawaban lebih panjang

FORMAT:
JSON array 20 string tanpa penjelasan
`;

    // 🚀 CALL GEMINI API
    const model = "gemini-2.5-flash"; // Bisa diganti ke gemini-1.5-flash jika perlu
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          // Fitur sakti Gemini biar otomatis mereturn JSON murni tanpa markdown ```json
          response_mime_type: "application/json",
          temperature: 0.9, // Ditinggikan sedikit biar ide yang keluar makin absurd/random
        },
      }),
    });

    const result = await response.json();

    // 🚨 HANDLE ERROR DARI GOOGLE
    if (!response.ok) {
      console.error("Gemini API Error Detail:", result);
      throw new Error(result.error?.message || "Failed to fetch from Gemini API");
    }

    // 🔥 AMBIL DATA TEXT
