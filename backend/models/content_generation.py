from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Load the GPT-2 model and tokenizer
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")

def generate_content(prompt: str, max_length: int = 200) -> str:
    """Generates content using GPT-2 based on the given prompt."""
    input_ids = tokenizer.encode(prompt, return_tensors="pt")

    # Generate text
    output_ids = model.generate(input_ids, max_length=max_length, temperature=0.7, top_k=50, top_p=0.95, do_sample=True)
    generated_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)

    return generated_text
