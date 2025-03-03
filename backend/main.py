from fastapi import FastAPI
from models.text_summarization import summarize_text
from models.content_generation import generate_content
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


@app.get("/")
def home():
    return {"message": "Welcome to the Text Summarization & Content Generation API"}

@app.post("/summarize/")
def summarize(data: dict):
    text = data.get("text")
    if not text:
        return {"error": "No text provided"}
    summary = summarize_text(text)
    return {"summary": summary}

@app.post("/generate/")
def generate(data: dict):
    prompt = data.get("prompt")
    if not prompt:
        return {"error": "No prompt provided"}
    generated_text = generate_content(prompt)
    return {"generated_text": generated_text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
