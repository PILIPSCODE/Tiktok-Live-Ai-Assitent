import Groq from "groq-sdk";
import fs from 'fs';
const groq = new Groq({ apiKey:"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"});

async function getGroqChatCompletion(prompt) {
    try {
      const promptpilkunbot = fs.readFileSync('./promptPertanyaanApapun.txt', 'utf8');
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
            content: `Jawab Dengan singkat dan jelas (200 karakter) menggunakan bhs indonesia ${prompt}`,
          },
        ],
        model: "llama3-70b-8192",
      });
    } catch (error) {
      console.error("Error fetching chat completion:", error);
      return null; // Mengembalikan null atau handling lain jika terjadi error
    }
  }

  async function getKhodam(prompt) {
    try {
      const promptpilkunbot = fs.readFileSync('./promptKhodam.txt', 'utf8');
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
            content: prompt,
          },
        ],
        model: "gemma-7b-it",
      });
    } catch (error) {
      console.error("Error fetching chat completion:", error);
      return null; // Mengembalikan null atau handling lain jika terjadi error
    }
  }
export { getGroqChatCompletion,getKhodam};