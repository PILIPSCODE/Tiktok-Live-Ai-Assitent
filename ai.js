import Groq from "groq-sdk";
import fs from "fs";

const groq = new Groq({
  apiKey: "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",
});

async function getGroqChatCompletion(prompt) {
  try {
    const promptpilkunbot = fs.readFileSync(
      "./promptPertanyaanApapun.txt",
      "utf8"
    );
    return await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
            ${promptpilkunbot}
            `,
        },
        {
          role: "user",
          content: `${prompt}`,
        },
      ],
      model: "llama3-70b-8192",
    });
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    return null; // Mengembalikan null atau handling lain jika terjadi error
  }
}

export { getGroqChatCompletion};
