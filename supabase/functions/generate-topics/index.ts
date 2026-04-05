import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `Kamu adalah generator topik diskusi yang kreatif dan relatable. Tugasmu adalah membuat 20 topik diskusi random dalam Bahasa Indonesia yang ringan, seru, dan memicu percakapan.

ATURAN PENTING:
- Topik harus RINGAN dan FUN, jangan terlalu berat atau filosofis
- Campur berbagai jenis: pengalaman sehari-hari, pop culture, media sosial, kebiasaan generasi sekarang, tren terkini, nostalgia, relatable moments, debat ringan, would you rather, unpopular opinions
- Selipkan topik yang relate dengan kehidupan anak muda/orang dewasa sekarang (kerja, hustle culture, overthinking, self-care, dating, friendship, quarter-life crisis, dll)
- Gunakan bahasa santai dan casual
- Setiap topik harus memancing orang untuk langsung ingin jawab/cerita

Contoh tone yang diinginkan:
- "Apa red flag terbesar yang pernah kamu abaikan?"
- "Kebiasaan apa yang kamu lakukan diam-diam tapi malu kalau ketahuan?"
- "Unpopular opinion: film/series yang semua orang suka tapi menurut kamu biasa aja?"

PENTING: Balas HANYA dengan JSON array berisi 20 string topik, tanpa penjelasan lain.`
          },
          {
            role: "user",
            content: "Buatkan 20 topik diskusi ringan, seru, dan relatable dengan kehidupan sekarang dalam Bahasa Indonesia."
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_topics",
              description: "Return 20 random discussion topics in Indonesian",
              parameters: {
                type: "object",
                properties: {
                  topics: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 20,
                    maxItems: 20,
                    description: "Array of 20 discussion topics in Bahasa Indonesia"
                  }
                },
                required: ["topics"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "return_topics" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, coba lagi nanti." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Credit habis, silakan top up." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall) {
      const args = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ topics: args.topics }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try parsing content directly
    const content = data.choices?.[0]?.message?.content || "[]";
    const topics = JSON.parse(content);
    return new Response(JSON.stringify({ topics }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-topics error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
