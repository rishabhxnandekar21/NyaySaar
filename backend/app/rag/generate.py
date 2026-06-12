# app/rag/generate.py
import json
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

        groq_client = get_groq_client() 
        response = groq_client.generate(prompt)

        return str(response)
    
    except Exception as e:
        print(f"[Generation Error]: {e}")
        return "Sorry, I couldn't generate a response at the moment."


async def generate_summary(text: str):
    try:
        prompt = f"""
You are NyaySaar, an expert AI legal assistant specializing in Indian legal documents.

Your task is to analyze the provided legal document and generate a structured response that is accurate, concise, and understandable to a non-lawyer.

IMPORTANT RULES:

1. Use ONLY information present in the document.
2. Do NOT hallucinate facts, dates, laws, judges, or outcomes.
3. If information is missing, return "Not Available".
4. Write in simple language understandable by a common citizen.
5. Keep the summary factual and neutral.
6. Return ONLY valid JSON.
7. Do not include markdown, code fences, explanations, or extra text.

Required JSON format:

{{
    "title": "",
    "court": "",
    "date": "",
    "caseType": "",
    "verdict": "",
    "verdictType": "",
    "summary": "",
    "keyPoints": [
        "",
        "",
        ""
    ],
    "importantParties": [],
    "legalSections": [],
    "confidence": 0
}}

Field Guidelines:

title:
- Extract official case title if available.

court:
- Name of court or tribunal.

date:
- Judgment/order date.

caseType:
- Criminal, Civil, Consumer, Family, Labour, Property, Tax, etc.

verdict:
- Final outcome in 1-2 sentences.

verdictType:
Must be exactly one of:

allowed
dismissed
convicted
acquitted
partly_allowed
pending
unknown

Never return any other value.

summary:
- 250-400 words.
- Explain:
  - what the dispute was
  - arguments/issues involved
  - reasoning of the court
  - final outcome

keyPoints:
- 3-5 important takeaways.

importantParties:
- Names of petitioner, respondent, accused, complainant etc.

legalSections:
- Mention statutes, acts, sections cited.

confidence:
- Integer between 0 and 100 representing confidence in extraction accuracy.

Document:
{text}
"""

        groq_client = get_groq_client()
        response = groq_client.generate(prompt)

        print("\n===== RAW LLM RESPONSE =====\n")
        print(response)
        print("\n===========================\n")
        

        output = str(response)

        try:
            result = json.loads(output)
            return result
        
        except Exception:
            return {
        "title": "Not Available",
        "court": "Not Available",
        "date": "Not Available",
        "caseType": "Not Available",
        "verdict": "Not Available",
        "verdictType": "unknown",
        "summary": output,
        "keyPoints": [],
        "importantParties": [],
        "legalSections": [],
        "confidence": 0
    }


    except Exception as e:
        print(f"[Summary Error]: {e}")

    return {
        "title": "Not Available",
        "court": "Not Available",
        "date": "Not Available",
        "caseType": "Not Available",
        "verdict": "Not Available",
        "verdictType": "unknown",
        "summary": "Error generating summary",
        "keyPoints": [],
        "importantParties": [],
        "legalSections": [],
        "confidence": 0
    }