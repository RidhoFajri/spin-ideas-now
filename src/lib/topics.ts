export async function generateTopics(): Promise<string[]> {
  try {
    const res = await fetch(
      "https://vjhobelyephrazusmcps.supabase.co/functions/v1/generate-topics",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqaG9iZWx5ZXBocmF6dXNtY3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NTUyMzAsImV4cCI6MjA5MTAzMTIzMH0.5a6XxXeeXuNfraD3edeW0c9q0b1hMhrVGYJXe7qHB5I",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
      }
    );

    const data = await res.json();

    console.log("🔥 RESPONSE:", data);

    if (data?.topics) {
      console.log("✅ AI BERHASIL");
      return data.topics;
    }

    throw new Error("Invalid response");
  } catch (e) {
    console.warn("❌ FALLBACK KEPAKAI:", e);

    return [
      "Hal kecil apa yang bikin kamu overthinking belakangan ini?",
      "Kapan terakhir kali kamu ngerasa 'ini gue banget'?",
      "Kebiasaan aneh apa yang kamu sembunyiin dari orang lain?",
      "Menurut kamu kerja sekarang makin capek atau biasa aja?",
      "Hal random apa yang sering kamu pikirin sebelum tidur?",
    ];
  }
}
