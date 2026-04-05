// Fallback topics for when AI is not available
export const FALLBACK_TOPICS: string[] = [
  "Apakah waktu itu benar-benar ada atau hanya konstruksi manusia?",
  "Kalau bisa makan malam dengan satu tokoh sejarah, siapa dan kenapa?",
  "Teknologi apa yang paling mengubah dunia dalam 10 tahun terakhir?",
  "Apakah alien itu ada? Berikan argumenmu!",
  "Apa skill yang paling underrated tapi super berguna?",
  "Kalau bisa hidup di era mana saja, kapan dan di mana?",
  "Debat: Kucing vs Anjing — mana yang lebih baik?",
  "Apa makanan yang paling overrated menurut kamu?",
  "Kalau besok dunia kiamat, apa yang kamu lakukan hari ini?",
  "Apakah social media lebih banyak manfaat atau mudharatnya?",
  "Apa film/buku yang mengubah cara pandangmu tentang hidup?",
  "Kalau bisa punya satu superpower, apa dan kenapa?",
  "Apakah uang bisa membeli kebahagiaan? Debat!",
  "Fun fact paling aneh yang kamu tahu?",
  "Apa pekerjaan impianmu waktu kecil vs sekarang?",
  "Kalau bisa menghapus satu penemuan dari sejarah, apa itu?",
  "Apakah kita hidup di simulasi? Berikan argumen!",
  "Apa kebiasaan kecil yang mengubah hidupmu?",
  "Debat: Apakah pineapple boleh di pizza?",
  "Apa hal yang paling ingin kamu pelajari tapi belum sempat?",
];

export function generateTopics(): Promise<string[]> {
  // Shuffle and return fallback topics
  const shuffled = [...FALLBACK_TOPICS].sort(() => Math.random() - 0.5);
  return new Promise((resolve) => {
    setTimeout(() => resolve(shuffled), 1500); // Simulate loading
  });
}
