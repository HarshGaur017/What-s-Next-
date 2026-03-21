import { buildNextActionPrompt, extractActionFromResponse } from "../utils/prompts";

const OPENROUTER_MODEL = "google/gemma-3-27b-it:free";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const getOpenRouterApiKey = () => {
  const apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "Missing OpenRouter API key. Set EXPO_PUBLIC_OPENROUTER_API_KEY in your Expo environment.",
    );
  }

  return apiKey;
};

const getResponseText = (payload: any) => {
  const content = payload?.choices?.[0]?.message?.content;
  return typeof content === "string" ? content.trim() : "";
};

export const aiService = {
  async generateNextAction(goalTitle: string, durationMinutes: number) {
    const apiKey = getOpenRouterApiKey();
    const prompt = buildNextActionPrompt(goalTitle, durationMinutes);

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://whats-next.local",
        "X-Title": "whats_next",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "OpenRouter could not generate a task right now.");
    }

    const payload = await response.json();
    const taskText = extractActionFromResponse(getResponseText(payload));

    if (!taskText) {
      throw new Error("OpenRouter returned an empty task. Please try again.");
    }

    return taskText;
  },
};
