from google import genai
from google.genai import types
from django.conf import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def generate_book_summary(title, author):
    try:
        # Token limit ah innum konjam increase panrom
        config = types.GenerateContentConfig(
            temperature=0.7,
            max_output_tokens=1500, 
        )

        # Prompt ah detailed ah maathirukom
        prompt = f"""
        Write an elaborate, comprehensive, and detailed summary of the book '{title}' written by {author}. 
        The summary must be exactly 3 long paragraphs (around 200-250 words).
        Paragraph 1 should introduce the book and the author.
        Paragraph 2 should explain the main themes, plot, or core concepts.
        Paragraph 3 should explain the author's main message and why the book is impactful.
        Do not use bullet points, asterisks, or markdown formatting. Write only plain text paragraphs.
        Do not include any spoilers.
        """

        response = client.models.generate_content(
            model='gemini-3.8-flash', 
            contents=prompt,
            config=config
        )
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "Sorry, we couldn't generate a summary at this moment. Please try again later."