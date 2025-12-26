// backend/src/routes/chat.ts

import { Router } from "express";
import { db } from "../db";
import { messages, conversations, faqs } from "../db/schema";
import { eq } from "drizzle-orm";
import { generateReply } from "../services/llm";

const MAX_MESSAGE_LENGTH = 2000;
const router = Router();

router.get("/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, sessionId))
      .orderBy(messages.createdAt);

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load history" });
  }
});

router.post("/message", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }
    const rawMessage = message.trim();

    const safeMessage =
      rawMessage.length > MAX_MESSAGE_LENGTH
        ? rawMessage.slice(0, MAX_MESSAGE_LENGTH)
        : rawMessage;

    /* -------------------- CONVERSATION (SESSION) -------------------- */
    let conversationId = sessionId;

    if (!conversationId) {
      const newConversation = await db
        .insert(conversations)
        .values({})
        .returning({ id: conversations.id });

      conversationId = newConversation[0].id;
    }

    /* -------------------- SAVE USER MESSAGE -------------------- */
    await db.insert(messages).values({
      conversationId,
      sender: "user",
      content: safeMessage,
    });

    /* -------------------- LOAD MESSAGE HISTORY -------------------- */
    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);

    const llmHistory: { role: "user" | "assistant"; content: string }[] =
    history.map(m => ({
    role: m.sender === "user" ? "user" : "assistant",
    content: m.content,
  }));

    /* -------------------- LOAD FAQ CONTEXT -------------------- */
    const faqRows = await db
      .select()
      .from(faqs)
      .where(eq(faqs.isActive, true));

    const faqContext = faqRows
      .map(f => `Q: ${f.question}\nA: ${f.answer}`)
      .join("\n\n");

    /* -------------------- CALL LLM -------------------- */
    const reply = await generateReply(llmHistory, faqContext);

    /* -------------------- SAVE AI MESSAGE -------------------- */
    await db.insert(messages).values({
      conversationId,
      sender: "assistant",
      content: reply,
    });

    /* -------------------- RESPONSE -------------------- */
    res.json({
      reply,
      sessionId: conversationId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
