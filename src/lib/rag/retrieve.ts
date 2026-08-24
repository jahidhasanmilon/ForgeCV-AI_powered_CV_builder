import { KNOWLEDGE_BASE, KnowledgeChunk } from "./knowledge";

/**
 * A small, dependency-free RAG (Retrieval-Augmented Generation) pipeline.
 *
 * Real-world RAG systems usually embed chunks with a neural embedding model
 * and store the vectors in something like pgvector or Pinecone. For a demo
 * project of this size, TF-IDF + cosine similarity gives the same shape of
 * pipeline (tokenize -> vectorize -> similarity search -> top-k chunks) while
 * staying fully local and inspectable, with no extra API calls or infra.
 */

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function buildVocabulary(docs: string[][]): string[] {
  const vocab = new Set<string>();
  docs.forEach((tokens) => tokens.forEach((t) => vocab.add(t)));
  return Array.from(vocab);
}

function termFrequency(tokens: string[], vocab: string[]): number[] {
  const counts: Record<string, number> = {};
  tokens.forEach((t) => (counts[t] = (counts[t] || 0) + 1));
  return vocab.map((term) => (counts[term] || 0) / (tokens.length || 1));
}

function inverseDocumentFrequency(docs: string[][], vocab: string[]): number[] {
  const n = docs.length;
  return vocab.map((term) => {
    const containing = docs.filter((tokens) => tokens.includes(term)).length;
    return Math.log((n + 1) / (containing + 1)) + 1;
  });
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// Pre-compute the corpus vectors once per server process (cheap: ~8 short docs).
const corpusTokens = KNOWLEDGE_BASE.map((c) => tokenize(`${c.title} ${c.text}`));
const vocabulary = buildVocabulary(corpusTokens);
const idf = inverseDocumentFrequency(corpusTokens, vocabulary);
const corpusVectors = corpusTokens.map((tokens) => {
  const tf = termFrequency(tokens, vocabulary);
  return tf.map((v, i) => v * idf[i]);
});

export interface RetrievedChunk extends KnowledgeChunk {
  score: number;
}

/** Retrieve the top-k most relevant knowledge chunks for a free-text query. */
export function retrieve(query: string, k = 3): RetrievedChunk[] {
  const queryTokens = tokenize(query);
  const tf = termFrequency(queryTokens, vocabulary);
  const queryVector = tf.map((v, i) => v * idf[i]);

  const scored = KNOWLEDGE_BASE.map((chunk, i) => ({
    ...chunk,
    score: cosineSimilarity(queryVector, corpusVectors[i]),
  }));

  return scored.sort((a, b) => b.score - a.score).slice(0, k);
}
