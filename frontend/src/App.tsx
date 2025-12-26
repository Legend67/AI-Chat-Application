import React, { useEffect, useRef, useState } from "react";

type Message = {
  sender: "user" | "ai";
  text: string;
};

const WELCOME_MESSAGE: Message = {
  sender: "ai",
  text: "Hi! 👋 I’m your AI support assistant. How can I help you today?",
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* -------------------- RESET CHAT -------------------- */
  function resetChat() {
    localStorage.removeItem("sessionId");
    setMessages([WELCOME_MESSAGE]);
  }

  /* -------------------- LOAD HISTORY OR WELCOME -------------------- */
  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      setMessages([WELCOME_MESSAGE]);
      return;
    }

    fetch(`http://localhost:3001/chat/history/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMessages(
            data.map((m: any) => ({
              sender: m.sender,
              text: m.content,
            }))
          );
        } else {
          setMessages([WELCOME_MESSAGE]);
        }
      })
      .catch(() => setMessages([WELCOME_MESSAGE]));
  }, []);

  /* -------------------- AUTO SCROLL -------------------- */
  useEffect(() => {
    if (!showScrollDown) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, showScrollDown]);

  function handleScroll() {
    const el = messagesRef.current;
    if (!el) return;

    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;

    setShowScrollDown(distanceFromBottom > 120);
  }

  /* -------------------- SEND MESSAGE -------------------- */
  async function sendMessage() {
    if (!input.trim() || loading) return;

    setShowScrollDown(false);

    const userMsg: Message = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    try {
      const sessionId = localStorage.getItem("sessionId");
      const res = await fetch("http://localhost:3001/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          sessionId,
        }),
      });

      const data = await res.json();

      setMessages(prev => [...prev, { sender: "ai", text: data.reply }]);

      if (data.sessionId) {
        localStorage.setItem("sessionId", data.sessionId);
      }

      setLoading(false);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "Something went wrong. Please try again." },
      ]);
      setLoading(false);
    }
  }

  /* -------------------- RENDER -------------------- */
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-3xl h-[85vh] bg-gray-900 text-white rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 text-xl font-semibold flex items-center justify-between">
          <span>🤖 AI Support Chat</span>
          <button
            onClick={resetChat}
            className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition"
          >
            Reset
          </button>
        </div>

        {/* Messages */}
        <div
          ref={messagesRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-xl text-sm ${
                  m.sender === "user"
                    ? "bg-blue-600 rounded-br-none"
                    : "bg-gray-700 rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {/* AI typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 px-4 py-2 rounded-xl text-sm flex items-center gap-1">
                <span>AI is typing</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-150">.</span>
                <span className="animate-bounce delay-300">.</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {showScrollDown && (
          <button
            onClick={() =>
              bottomRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-blue-600 w-11 h-11 rounded-full"
          >
            ⬇
          </button>
        )}

        {/* Input */}
        <div className="border-t border-gray-700 p-4 flex gap-2">
          <textarea
            className="flex-1 bg-gray-800 px-4 py-2 rounded-xl"
            placeholder="Ask a question..."
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 px-5 py-2 rounded-xl disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
