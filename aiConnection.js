import { EventEmitter } from "events";
import Groq from "groq-sdk";
import fs from "fs";

const DEFAULT_MODEL = "compound-beta";

class GroqAiChatCompletion extends EventEmitter {
  constructor(apiKey, prompt, model, Question) {
    super();
    this.apiKey = apiKey;
    this.prompt = prompt;
    this.model = model || DEFAULT_MODEL;
    this.Question = Question;
  }

  async connect() {
    if (this.apiKey === "" || !this.apiKey) {
      return {
        response: "Please provide a valid API key. don't Empty!!",
        animation: "Waving",
      };
    }

    if (this.prompt === "" || !this.prompt) {
      return {
        response: "Please provide a valid prompt. don't Empty!!",
        animation: "Waving",
      };
    }

    const modelToUse = this.model || DEFAULT_MODEL;
    return this._callGroq(modelToUse);
  }

  async _callGroq(model) {
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
        model: model,
      });

      const message = JSON.parse(response?.choices[0]?.message?.content);
      return message;
    } catch (error) {
      console.error(`[Groq AI Error] Model: ${model}, Error:`, error?.message || error);

      // If the requested model failed and it's not already the default, retry with default
      if (model !== DEFAULT_MODEL) {
        console.log(`[Groq AI] Retrying with default model: ${DEFAULT_MODEL}`);
        return this._callGroq(DEFAULT_MODEL);
      }

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
