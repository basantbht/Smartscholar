import React, { useState, useRef, useEffect, useCallback } from "react";
import { api } from "../../utils/api"; // Adjust path based on your file structure

// ─── Message Formatter ────────────────────────────────────────────────────────
const FormattedMessage = ({ text }) => {
  const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);

  return (
    <div className="space-y-2">
      {parts.map((part, i) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const code = part.slice(3, -3).replace(/^\w+\n/, "");
          return (
            <pre
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-x-auto text-xs text-gray-700 font-mono"
            >
              <code>{code}</code>
            </pre>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-xs text-blue-600 font-mono"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        // Render bold **text**
        return part.split(/(\*\*[^*]+\*\*)/g).map((seg, j) => {
          if (seg.startsWith("**") && seg.endsWith("**")) {
            return (
              <strong key={`${i}-${j}`} className="font-semibold text-gray-900">
                {seg.slice(2, -2)}
              </strong>
            );
          }
          return <span key={`${i}-${j}`}>{seg}</span>;
        });
      })}
    </div>
  );
};

// ─── Source Badge ─────────────────────────────────────────────────────────────
const SourceBadge = ({ source, page, score }) => (
  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 shadow-sm">
    <span>📄</span>
    <span className="font-medium text-gray-900">
      {source.split("/").pop().replace(".pdf", "")}
    </span>
    {page !== undefined && <span className="text-gray-400">· p.{page}</span>}
    <span className="ml-1 text-blue-600 font-semibold">
      {(score * 100).toFixed(0)}%
    </span>
  </div>
);

// ─── Typing Indicator ─────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm max-w-[80px]">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

// ─── Suggested Questions ──────────────────────────────────────────────────────
const SUGGESTIONS = [
  "What scholarships are available?",
  "Eligibility criteria?",
  "How to apply?",
  "Scholarship amounts?",
];

// ─── Main Component ───────────────────────────────────────────────────────────
const Scholarships = () => {
  // Add scrollbar-hide styles for quick suggestions
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }
  };

  const sendMessage = useCallback(
    async (text) => {
      const question = (text || input).trim();
      if (!question || loading) return;

      setShowSuggestions(false);
      setInput("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";

      const userMsg = {
        id: Date.now(),
        role: "user",
        text: question,
        time: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const response = await api.post("/chats/chat", {
          question,
          sessionId,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            text: response.data.answer,
            sources: response.data.sources || [],
            query: response.data.query,
            time: new Date(),
          },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "error",
            text: `Connection error: ${err.message}. Please ensure the server is running.`,
            time: new Date(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, sessionId]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Messages Area - Scrollable container */}
      <div className="flex-1 overflow-y-auto pt-24 pb-4">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Welcome State */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center space-y-6 min-h-[60vh]">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                🎓
              </div>
              <div className="space-y-2 max-w-lg">
                <h1 className="text-3xl font-bold text-gray-900">
                  Scholarship Assistant
                </h1>
                <p className="text-gray-600 text-base">
                  Ask me anything about scholarships, eligibility, applications, and funding opportunities.
                </p>
              </div>

              {/* Suggestion chips */}
              {showSuggestions && (
                <div className="grid grid-cols-2 gap-3 w-full max-w-2xl pt-4">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s)}
                      className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all text-left shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  } items-start`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 shadow-md ${
                      msg.role === "user"
                        ? "bg-linear-to-br from-blue-600 to-indigo-600 text-white"
                        : msg.role === "error"
                        ? "bg-red-100 text-red-600"
                        : "bg-linear-to-br from-gray-700 to-gray-900 text-white"
                    }`}
                  >
                    {msg.role === "user" ? "👤" : msg.role === "error" ? "⚠️" : "🎓"}
                  </div>

                  {/* Message content */}
                  <div className={`flex flex-col gap-2 max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    {/* Bubble */}
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-md ${
                        msg.role === "user"
                          ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm"
                          : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      ) : (
                        <div className="text-sm leading-relaxed">
                          <FormattedMessage text={msg.text} />
                        </div>
                      )}
                    </div>

                    {/* Sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <p className="text-xs text-gray-500 font-medium">Sources</p>
                        <div className="flex flex-wrap gap-2">
                          {msg.sources.map((s, i) => (
                            <SourceBadge
                              key={i}
                              source={s.source}
                              page={s.page}
                              score={s.score}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <p className="text-xs text-gray-400">
                      {msg.time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 bg-linear-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-lg shrink-0 shadow-md">
                    🎓
                  </div>
                  <TypingIndicator />
                </div>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed Bottom */}
      <div className="border-t border-gray-200 bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Quick suggestions when chat is active */}
          {messages.length > 0 && !loading && (
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {["Deadlines?", "Eligibility?", "Application?", "Amount?"].map(
                (s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-all whitespace-nowrap shrink-0"
                  >
                    {s}
                  </button>
                )
              )}
            </div>
          )}

          {/* Input row */}
          <div className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about scholarships..."
              className="flex-1 min-h-[48px] max-h-[120px] px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm transition-colors"
              rows={1}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium text-sm hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span>•••</span>
              ) : (
                <>
                  <span>Send</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-2">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default Scholarships;