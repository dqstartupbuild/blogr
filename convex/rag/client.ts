import { openai } from "@ai-sdk/openai";
import { RAG } from "@convex-dev/rag";
import { components } from "../_generated/api";

export const productRag = new RAG(components.rag, {
  embeddingDimension: 1536,
  textEmbeddingModel: openai.embedding("text-embedding-3-small"),
});
