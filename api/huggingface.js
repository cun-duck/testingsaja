export default async function handler(req, res) {
  const apiKey = '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'; // Ganti dengan HF token kamu
  const model = "Qwen/Qwen2.5-Coder-32B-Instruct";
  
  const url = `https://api-inference.huggingface.co/models/${model}`;
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const { messages } = req.body; // Ambil pesan dari body permintaan

  const body = JSON.stringify({
    messages: messages, // Kirimkan seluruh riwayat percakapan
    parameters: {
      max_tokens: 500,
    },
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    const data = await response.json();
    const message = data?.choices?.[0]?.message || "Tidak ada jawaban dari model.";

    res.status(200).json({ message }); // Kirimkan balasan model ke frontend
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan saat berkomunikasi dengan model." });
  }
}
