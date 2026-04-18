# app/rag/generate.py

from app.services.groq_client import GroqClient

def get_groq_client():
    return GroqClient()


#PROMPT BUILDER
def build_prompt(query, documents, long_memory, short_memory):
    prompt = "You are NyaySaar, an AI legal assistant that explains things in simple terms.\n\n"

    #Documents (RAG)
    if documents:
        prompt += "Relevant Legal Context:\n"
        for doc in documents:
            prompt += f"- {doc}\n"

    #Long-term Memory
    if long_memory:
        prompt += "\nPast User Context:\n"
        for mem in long_memory:
            prompt += f"- {mem}\n"

    #Short-term Memory
    if short_memory:
        prompt += "\nRecent Conversation:\n"
        for m in short_memory:
            prompt += f"User: {m['user']}\nAssistant: {m['assistant']}\n"

    #Final Query
    prompt += f"\nUser Question: {query}\n"
    prompt += "Answer in a clear, structured, and simple way:\n"

    return prompt

#GENERATE ANSWER
async def generate_answer(query, documents, long_memory, short_memory):
    try:
        prompt = build_prompt(query, documents, long_memory, short_memory)

        groq_client = get_groq_client()   # ✅ added
        response = groq_client.generate(prompt)

        return str(response)

    except Exception as e:
        print(f"[Generation Error]: {e}")
        return "Sorry, I couldn't generate a response at the moment."


async def generate_summary(text: str):
    try:
        prompt = f"""
You are NyaySaar, an AI legal assistant.

Analyze the following legal document and provide:

1. A clear, simple SUMMARY
2. A short VERDICT (1–2 lines stating outcome or key decision)

Document:
{text}

Respond strictly in this format:
SUMMARY:
<your summary>

VERDICT:
<your verdict>
"""

        groq_client = get_groq_client()
        response = groq_client.generate(prompt)

        output = str(response)

        #Parse response
        summary = ""
        verdict = ""

        if "SUMMARY:" in output and "VERDICT:" in output:
            parts = output.split("VERDICT:")
            summary_part = parts[0].replace("SUMMARY:", "").strip()
            verdict_part = parts[1].strip()

            summary = summary_part
            verdict = verdict_part
        else:
            summary = output
            verdict = "No clear verdict found"

        return {
            "summary": summary,
            "verdict": verdict
        }

    except Exception as e:
        print(f"[Summary Error]: {e}")
        return {
            "summary": "Error generating summary",
            "verdict": "Error generating verdict"
        }