import { HfInference } from "@huggingface/inference";

export default async function handler(req, res) {
  const client = new HfInference("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");

  const stream = client.chatCompletionStream({
    model: "Qwen/Qwen2.5-Coder-32B-Instruct",
    messages: [
      {
        role: "user",
        content: req.body.message || "What is the capital of France?"
      }
    ],
    max_tokens: 500
  });

  let out = "";

  // Streaming response
  for await (const chunk of stream) {
    if (chunk.choices && chunk.choices.length > 0) {
      const newContent = chunk.choices[0].delta.content;
      out += newContent;
      console.log(newContent);
    }  
  }

  res.status(200).json({ message: out });
}
