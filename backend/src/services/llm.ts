// backend/src/services/llm.ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function demoReply(history: ChatMessage[]) {
  const lastUserMessage = [...history]
    .reverse()
    .find(m => m.role === "user")?.content;

  return `Demo reply from LLM (echo)(Enter valid OpenAI API key to enable real responses): ${lastUserMessage ?? ""}`;
}

export async function generateReply(
  history: ChatMessage[],
  faqContext: string
) {
  /* --------------------------------------------------
        DEV MODE: No API key
  -------------------------------------------------- */
  if (!process.env.OPENAI_API_KEY) {
    await new Promise(res => setTimeout(res, 400));
    return demoReply(history);
  }

  /* --------------------------------------------------
            REAL OPENAI CALL (SAFE)
  -------------------------------------------------- */
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a helpful support agent for a small e-commerce store.

You MUST use the following store information to answer questions.
If the answer is not present, say you are not sure.

Store Information:
${faqContext}

Answer clearly and concisely.
          `,
        },
        ...history,
      ],
      max_tokens: 300,
    });

    return completion.choices[0].message.content ?? "";
  } catch (err: any) {
    console.error("LLM error:", err?.code || err?.message);

    // Graceful fallback for auth / quota / rate-limit issues
    if (
      err?.code === "invalid_api_key" ||
      err?.code === "insufficient_quota" ||
      err?.status === 401 ||
      err?.status === 429
    ) {
      return demoReply(history);
    }

    return "Sorry, I’m having trouble responding right now.";
  }
}
