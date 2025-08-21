import { EventEmitter } from "events";
import Groq from "groq-sdk";
import fs from "fs";

class GroqAiChatCompletion extends EventEmitter {
  constructor(apiKey, prompt, model, Question) {
    super();
    this.apiKey = apiKey;
    this.prompt = prompt;
    this.model = model;
    this.Question = Question;
  }

  async connect() {
    if (this.apiKey === "") {
      return {
        response: "Please provide a valid API key. don't Empty!!",
        animation: "Waving",
      };
    }

    if (this.prompt === "") {
      return {
        response: "Please provide a valid prompt. don't Empty!!",
        animation: "Waving",
      };
    }
    if (this.model === "") {
      return {
        response: "Please provide a valid model. don't Empty!!",
        animation: "Waving",
      };
    }

    try {
      const promptDefault = fs.readFileSync("./defaultPrompt.txt", "utf8");
      const groq = new Groq({
        apiKey: this.apiKey,
      });
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `
                    ${this.prompt}
                    ${promptDefault}
                    `,
          },
          {
            role: "user",
            content: `response only json ${this.Question.user}:${this.Question.comment}`,
          },
        ],
        model: `${this.model}`,
      });

      const message = JSON.parse(response?.choices[0]?.message?.content);
      return message;
    } catch (error) {
      return {
        response: `Hello ${this.Question.user}`,
        animation: "Waving",
      };
    }
  }
}

class OpenAiCompletion extends EventEmitter {
  constructor(apiKey, prompt, model, Question) {
    super();
    this.apiKey = apiKey;
    this.prompt = prompt;
    this.model = model;
    this.Question = Question;
  }
}

export { GroqAiChatCompletion };
