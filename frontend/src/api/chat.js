import apiClient from "./client";

export async function askQuestion(question, persona, docId) {
  const response = await apiClient.post("/api/chat", {
    question,
    persona,
    doc_id: docId,
  });

  return response.data;
}
