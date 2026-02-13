import { Pinecone } from "@pinecone-database/pinecone";
import ollama from "ollama";

const CHAT_MODEL = "gpt-oss:120b-cloud";
const EMBED_MODEL = "qwen3-embedding:0.6b";

// In-memory session history store
const SessionHistory = new Map();

// ─── Helper: Rewrite query for better retrieval ───────────────────────────────
async function transformQuery(question) {
  const rewritePrompt = `
You are a query rewriting expert. Rewrite the user's question into a complete standalone question.
Only output the rewritten question, nothing else.

User question: ${question}
`.trim();

  const res = await ollama.chat({
    model: CHAT_MODEL,
    messages: [{ role: "user", content: rewritePrompt }],
  });

  return res.message.content.trim();
}

// ─── Helper: Build context from Pinecone results ──────────────────────────────
function buildContext(matches) {
  return (matches || [])
    .map((m, i) => {
      const txt = m?.metadata?.text ?? "";
      const src = m?.metadata?.source ?? "unknown";
      const page = m?.metadata?.page;
      const cite = page !== undefined ? `${src} (page ${page})` : src;
      return `Chunk ${i + 1} — ${cite}\n${txt}`;
    })
    .filter(Boolean)
    .join("\n\n---\n\n");
}

// ─── POST /api/v1/scholarship/chat ───────────────────────────────────────────
export const scholarshipChat = async (req, res) => {
  try {
    const { question, sessionId = "default" } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        error: "Question is required",
      });
    }

    // 1) Rewrite query for better semantic search
    const rewrittenQuery = await transformQuery(question);

    // 2) Embed the rewritten query using Ollama
    const embedResp = await ollama.embed({
      model: EMBED_MODEL,
      input: rewrittenQuery,
    });

    const queryVector = embedResp.embeddings[0];
    if (!queryVector || queryVector.length === 0) {
      throw new Error("Empty query embedding from Ollama.");
    }

    // 3) Query Pinecone for relevant context chunks
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const searchResults = await pineconeIndex.query({
      topK: 10,
      vector: queryVector,
      includeMetadata: true,
    });

    const context = buildContext(searchResults.matches);

    // 4) Build system + prompt
    const system = `
You are a SmartScholar scholarship expert assistant.
You help students find and understand scholarship opportunities at Pokhara University.
You will be given CONTEXT from official university documents and a QUESTION.
Answer ONLY using the CONTEXT provided.
If the answer is not in the context, say exactly: "I could not find the answer in the provided document."
Keep your answers clear, accurate, and helpful for students.
Format your responses clearly with relevant details like eligibility, deadlines, amounts, and application steps when applicable.
`.trim();

    const prompt = `
CONTEXT:
${context}

QUESTION:
${rewrittenQuery}
`.trim();

    // 5) Get or create session history
    if (!SessionHistory.has(sessionId)) {
      SessionHistory.set(sessionId, []);
    }
    const history = SessionHistory.get(sessionId);
    history.push({ role: "user", content: rewrittenQuery });

    // 6) Generate answer with Ollama
    const chatResp = await ollama.chat({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: system },
        ...history.slice(-6), // Last 3 turns
        { role: "user", content: prompt },
      ],
    });

    const answer = chatResp.message.content;
    history.push({ role: "assistant", content: answer });

    // 7) Trim history to avoid bloat
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    // 8) Respond
    return res.status(200).json({
      success: true,
      answer,
      query: rewrittenQuery,
      sources: (searchResults.matches || []).slice(0, 3).map((m) => ({
        source: m?.metadata?.source ?? "unknown",
        page: m?.metadata?.page,
        score: m.score,
      })),
    });
  } catch (error) {
    console.error("❌ Scholarship chat error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
};

// ─── GET /api/v1/scholarship/health ──────────────────────────────────────────
export const scholarshipHealth = async (req, res) => {
  try {
    // Quick Ollama health check
    const test = await ollama.embed({ model: EMBED_MODEL, input: "ping" });
    const ollamaOk = (test.embeddings?.[0]?.length ?? 0) > 0;

    return res.status(200).json({
      success: true,
      status: "ok",
      ollama: ollamaOk ? "connected" : "error",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message,
    });
  }
};

// ─── DELETE /api/v1/scholarship/session/:sessionId ───────────────────────────
export const clearSession = (req, res) => {
  const { sessionId } = req.params;
  SessionHistory.delete(sessionId);
  return res.status(200).json({
    success: true,
    message: `Session ${sessionId} cleared`,
  });
};