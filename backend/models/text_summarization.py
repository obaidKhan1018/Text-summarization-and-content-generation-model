from transformers import T5ForConditionalGeneration, T5Tokenizer

# Load the pre-trained T5 model and tokenizer
tokenizer = T5Tokenizer.from_pretrained("t5-small")
model = T5ForConditionalGeneration.from_pretrained("t5-small")

def summarize_text(text: str, max_length: int = 100, min_length: int = 30) -> str:
    """Summarizes the input text using the T5 model."""
    input_text = f"summarize: {text}"
    input_ids = tokenizer.encode(input_text, return_tensors="pt", truncation=True, max_length=512)

    # Generate summary
    summary_ids = model.generate(input_ids, max_length=max_length, min_length=min_length, length_penalty=2.0, early_stopping=True)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return summary
