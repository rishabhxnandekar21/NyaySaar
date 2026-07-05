import apiClient from "./client";

export async function generateSummary(docId) {
  const response = await apiClient.post("/api/summary", {
    doc_id: docId,
  });

  return response.data;
}
