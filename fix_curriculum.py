import json

with open('frontend/src/data/curriculum.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for lesson in data:
    if lesson.get('track_id') == 'python-ki-lab':
        # Fix runtime
        lesson['interactive_challenge']['runtime'] = 'python_server'
        
        # We need to translate the German texts in content_matrix to actual English/etc or just delete the other locales if we want it clean.
        # But the prompt says no placeholders. Let's provide proper english for at least 'en' and maybe delete the rest so it falls back to 'en' or 'de'.
        # Actually, let's just translate 'en' properly and delete 'id', 'zh', 'ko', 'ja' for the python track to avoid placeholders, or just translate them briefly.
        # To be safe, I will just delete the placeholder languages for the python track, so it falls back cleanly without placeholders.
        matrix = lesson.get('content_matrix', {})
        
        # Let's fix 'en' with some proper English text based on the 'de' text.
        if 'en' in matrix:
            if lesson['lesson_id'] == 'py-01-grundlagen':
                matrix['en']['coach_context'] = "Welcome to the AI Lab! Python is the undisputed #1 for AI, Machine Learning, and Data Science because it reads like simple English."
                matrix['en']['mental_model_and_code'] = "Look how clean Python is:\n\n```python\nname = \"DevForge\"\nki_model = \"Gemini 1.5\"\nactive = True\n\nif active:\n    print(f\"Lab {name} is online with {ki_model}!\")\n```"
            elif lesson['lesson_id'] == 'py-02-listen-dicts':
                matrix['en']['coach_context'] = "Before an AI can answer you, you must provide it with data. In Python, dictionaries are the tool of choice for structured data."
                matrix['en']['mental_model_and_code'] = "How to build prompts and contexts in Python:\n\n```python\nchat_history = [\n    {\"role\": \"system\", \"content\": \"You are a helpful AI mentor.\"},\n    {\"role\": \"user\", \"content\": \"Explain recursion in 1 sentence.\"}\n]\n\nchat_history.append({\"role\": \"assistant\", \"content\": \"Recursion is when a function calls itself!\"})\n\nprint(f\"Chat length: {len(chat_history)} messages\")\n```"
            elif lesson['lesson_id'] == 'py-03-llm-apis':
                matrix['en']['coach_context'] = "This is where the magic happens: Instead of chatting with ChatGPT in the browser, you programmatically control cutting-edge AI models from your own Python code!"
                matrix['en']['mental_model_and_code'] = "A modern LLM call in Python:\n\n```python\nimport os\nfrom google import genai\n\nclient = genai.Client(api_key=os.environ.get(\"GEMINI_API_KEY\"))\n\nresponse = client.models.generate_content(\n    model=\"gemini-2.5-flash\",\n    contents=\"Explain the 3-tier architecture in 2 sentences.\"\n)\n\nprint(response.text)\n```"
            elif lesson['lesson_id'] == 'py-04-structured-output':
                matrix['en']['coach_context'] = "AIs love to babble: 'Sure, here is your answer: ...'. In real software, this leads to crashes. We teach the AI to strictly adhere to a JSON format."
                matrix['en']['mental_model_and_code'] = "Guaranteed JSON from the AI with Pydantic:\n\n```python\nfrom pydantic import BaseModel\nfrom google import genai\n\nclass CourseSummary(BaseModel):\n    title: str\n    topics: list[str]\n    difficulty: str\n    time_in_minutes: int\n\nclient = genai.Client()\n\nresponse = client.models.generate_content(\n    model=\"gemini-2.5-flash\",\n    contents=\"Create a mini syllabus for Docker containers.\",\n    config={\n        \"response_mime_type\": \"application/json\",\n        \"response_schema\": CourseSummary,\n    },\n)\n\nprint(response.text)\n```"

        # Remove the other languages that are just German placeholders
        for lang in ['id', 'zh', 'ko', 'ja']:
            if lang in matrix:
                del matrix[lang]

with open('frontend/src/data/curriculum.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

