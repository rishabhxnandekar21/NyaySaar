# app/rag/generate.py

from app.services.groq_client import GroqClient

groq_client = GroqClient()


# =========================
# 🔹 PROMPT BUILDER
# =========================
def build_prompt(query, documents, long_memory, short_memory):
    prompt = "You are NyaySaar, an AI legal assistant that explains things in simple terms.\n\n"

    # 🔹 Documents (RAG)
    if documents:
        prompt += "Relevant Legal Context:\n"
        for doc in documents:
            prompt += f"- {doc}\n"

    # 🔹 Long-term Memory
    if long_memory:
        prompt += "\nPast User Context:\n"
        for mem in long_memory:
            prompt += f"- {mem}\n"

    # 🔹 Short-term Memory
    if short_memory:
        prompt += "\nRecent Conversation:\n"
        for m in short_memory:
            prompt += f"User: {m['user']}\nAssistant: {m['assistant']}\n"

    # 🔹 Final Query
    prompt += f"\nUser Question: {query}\n"
    prompt += "Answer in a clear, structured, and simple way:\n"

    return prompt


# =========================
# 🔹 GENERATE ANSWER
# =========================
async def generate_answer(query, documents, long_memory, short_memory):
    try:
        prompt = build_prompt(query, documents, long_memory, short_memory)

        # ✅ Use your GroqClient class
        response = groq_client.generate(prompt)

        return str(response)

    except Exception as e:
        print(f"[Generation Error]: {e}")
        return "Sorry, I couldn't generate a response at the moment."


async def generate_summary(text: str):
    try:
        prompt = f"You are NyaySaar, an AI legal assistant. Summarize the following legal document in simple, clear language:\n\n{text}\n\nSummary:"
        return groq_client.generate(prompt)
    except Exception as e:
        print(f"[Summary Error]: {e}")
        return "Sorry, I couldn't generate a summary at the moment."