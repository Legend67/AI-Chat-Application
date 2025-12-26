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

Use the provided FAQ information to answer questions accurately.
If a question is not covered by the FAQs (for example, order status or tracking),
give general guidance such as checking the order confirmation email
or contacting customer support.

Do NOT invent order details, tracking numbers, or account-specific information.
Be clear, polite, and concise.

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
