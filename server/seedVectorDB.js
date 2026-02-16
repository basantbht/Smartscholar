import * as dotenv from "dotenv";
dotenv.config();

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Pinecone } from "@pinecone-database/pinecone";
import ollama from "ollama";

const PDF_PATH = "./pu_data1.pdf";
const EMBED_MODEL = "qwen3-embedding:0.6b";
const INDEX_NAME = process.env.PINECONE_INDEX_NAME;
const BATCH_SIZE = 50;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function safeMetadata(docMeta, text, chunkId) {
  const page =
    docMeta?.loc?.pageNumber ??
    docMeta?.pageNumber ??
    docMeta?.page ??
    undefined;

  const source =
    (typeof docMeta?.source === "string" && docMeta.source) ||
    (typeof docMeta?.filePath === "string" && docMeta.filePath) ||
    PDF_PATH;

  return {
    text,
    source,
    page: typeof page === "number" ? page : undefined,
    chunk: chunkId,
  };
}

// ─── Step 1: Create Pinecone Index (if it doesn't exist) ─────────────────────
async function ensurePineconeIndex(pinecone, dimension) {
  const existingIndexes = await pinecone.listIndexes();
  const names = (existingIndexes?.indexes || []).map((i) => i.name);

  if (names.includes(INDEX_NAME)) {
    console.log(`✅ Pinecone index "${INDEX_NAME}" already exists. Skipping creation.`);
    return;
  }

  console.log(`🔧 Creating Pinecone index "${INDEX_NAME}" with dimension ${dimension}...`);

  await pinecone.createIndex({
    name: INDEX_NAME,
    dimension,
    metric: "cosine",
    spec: {
      serverless: {
        cloud: "aws",
        region: "us-east-1", // Change to your preferred region
      },
    },
  });

  // Wait for index to be ready
  console.log("⏳ Waiting for index to be ready...");
  let ready = false;
  while (!ready) {
    await sleep(3000);
    const desc = await pinecone.describeIndex(INDEX_NAME);
    ready = desc?.status?.ready === true;
    console.log(`   Status: ${desc?.status?.state ?? "unknown"}`);
  }

  console.log(`✅ Index "${INDEX_NAME}" is ready!`);
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.PINECONE_API_KEY) throw new Error("Missing PINECONE_API_KEY in .env");
  if (!INDEX_NAME) throw new Error("Missing PINECONE_INDEX_NAME in .env");

  // 1) Load PDF
  console.log(`📄 Loading PDF: ${PDF_PATH}`);
  const rawDocs = await new PDFLoader(PDF_PATH).load();
  console.log(`   Pages loaded: ${rawDocs.length}`);

  // 2) Chunk documents
  const chunkedDocs = await new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  }).splitDocuments(rawDocs);
  console.log(`   Chunks created: ${chunkedDocs.length}`);

  // 3) Detect embedding dimension with a test call
  console.log(`🧠 Testing Ollama embedding model: ${EMBED_MODEL}`);
  const testEmbed = await ollama.embed({ model: EMBED_MODEL, input: "hello world" });
  const dimension = testEmbed.embeddings?.[0]?.length ?? 0;
  if (!dimension) throw new Error("Ollama returned empty embedding. Is Ollama running?");
  console.log(`   Embedding dimension: ${dimension}`);

  // 4) Initialize Pinecone and ensure index exists
  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  await ensurePineconeIndex(pinecone, dimension);

  const index = pinecone.Index(INDEX_NAME);

  // 5) Embed and upsert in batches
  console.log(`\n🚀 Starting embedding + upsert (${chunkedDocs.length} chunks, batch size ${BATCH_SIZE})...`);

  for (let i = 0; i < chunkedDocs.length; i += BATCH_SIZE) {
    const batchDocs = chunkedDocs.slice(i, i + BATCH_SIZE);
    const texts = batchDocs.map((d) => d.pageContent);

    const embedResp = await ollama.embed({ model: EMBED_MODEL, input: texts });

    const vectors = texts.map((text, j) => {
      const values = embedResp.embeddings[j];
      const chunkId = i + j;
      if (!values || values.length === 0) {
        throw new Error(`Empty embedding at chunk ${chunkId}`);
      }
      return {
        id: `doc_chunk_${chunkId}`,
        values,
        metadata: safeMetadata(batchDocs[j]?.metadata, text, chunkId),
      };
    });

    await index.upsert(vectors);

    const done = Math.min(i + BATCH_SIZE, chunkedDocs.length);
    const pct = ((done / chunkedDocs.length) * 100).toFixed(1);
    console.log(`   Upserted ${done}/${chunkedDocs.length} (${pct}%)`);

    await sleep(200);
  }

  console.log("\n✅ All data saved to Pinecone successfully!");
  console.log(`   Index: ${INDEX_NAME}`);
  console.log(`   Total vectors: ${chunkedDocs.length}`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});