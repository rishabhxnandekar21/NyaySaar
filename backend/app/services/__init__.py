class GroqClient:
    def __init__(self):
        key = os.getenv("GROQ_API_KEY")

        print("GROQ KEY FOUND:", key is not None)
        print("GROQ KEY PREFIX:", key[:10] if key else "None")

        self.client = Groq(api_key=key)
        self.model = settings.GROQ_MODEL