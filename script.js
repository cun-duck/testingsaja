let conversationHistory = [];  // Variabel untuk menyimpan riwayat percakapan

document.getElementById('send-btn').addEventListener('click', sendMessage);

async function sendMessage() {
  const userInput = document.getElementById('user-input').value;
  if (!userInput) return;

  // Menampilkan pesan pengguna di chat box
  appendMessage('user', userInput);

  // Menambahkan pesan pengguna ke dalam riwayat percakapan
  conversationHistory.push({ role: 'user', content: userInput });

  // Mengirim pesan ke Hugging Face API
  const response = await getAIResponse(conversationHistory);

  // Menampilkan jawaban dari model di chat box
  appendMessage('ai', response);

  // Menambahkan balasan AI ke dalam riwayat percakapan
  conversationHistory.push({ role: 'assistant', content: response });

  // Mengosongkan input field setelah pesan terkirim
  document.getElementById('user-input').value = '';
}

function appendMessage(role, message) {
  const chatBox = document.getElementById('chat-box');
  const messageElement = document.createElement('div');

  if (role === 'user') {
    messageElement.classList.add('user');
    messageElement.innerText = message;
  } else {
    messageElement.classList.add('ai');
    // Menambahkan deteksi apakah pesan berupa kode
    if (isCode(message)) {
      const codeBlock = document.createElement('div');
      codeBlock.classList.add('code-output');
      codeBlock.innerText = message;
      messageElement.appendChild(codeBlock);
    } else {
      messageElement.innerText = message;
    }
  }

  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll otomatis ke bawah
}

function isCode(message) {
  // Deteksi sederhana: jika pesan dimulai dengan tanda backtick (```) atau karakter kode lainnya
  return message.startsWith('```') || message.includes('\n') && message.trim().split('\n').every(line => line.startsWith('  '));
}

async function getAIResponse(history) {
  const apiKey = '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'; // Ganti dengan HF token kamu
  const model = "Qwen/Qwen2.5-Coder-32B-Instruct";

  const url = `https://api-inference.huggingface.co/models/${model}`;
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    messages: history,  // Mengirimkan seluruh riwayat percakapan
    parameters: {
      max_tokens: 500,
    },
  });

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: body,
  });

  const data = await response.json();
  return data?.choices?.[0]?.message || "Tidak ada jawaban dari model.";
}