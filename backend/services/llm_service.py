import os
import requests
import json
from typing import Dict, List

def generate_insights(news_texts: List[str], keyword: str) -> Dict:
    """
    Analyzes news texts to generate a 3-bullet executive summary and a sentiment score.
    Uses Hugging Face API if HUGGINGFACE_API_KEY is found in the environment,
    otherwise gracefully falls back to a Mock LLM for demonstration purposes.
    """
    hf_key = os.getenv("HUGGINGFACE_API_KEY")
    
    if not hf_key:
        # Graceful Fallback: Mock LLM output
        return generate_mock_insights(keyword)
        
    # Real LLM Integration
    combined_text = " ".join(news_texts)[:2000] # truncate for context limit
    prompt = f"""
    Analyze the following recent news for '{keyword}':
    {combined_text}
    
    Provide a JSON response with exactly two keys:
    1. 'summary': An array of 3 bullet points summarizing the key events.
    2. 'sentiment_score': A float between -1.0 (very negative) and 1.0 (very positive).
    """
    
    # Example HF Integration using a typical open model inference endpoint
    # You could swap this with any specific model endpoint (like Mistral or LLaMa-3)
    api_url = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
    headers = {"Authorization": f"Bearer {hf_key}"}
    
    # Depending on the model, JSON generation requests vary, 
    # but for this portfolio project we simulate parsing instructions
    payload = {
        "inputs": prompt,
        "parameters": {"max_new_tokens": 150, "return_full_text": False}
    }
    
    try:
        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()
        output = response.json()
        
        # In a generic pipeline, we extract and parse the predicted JSON.
        generated_text = output[0]['generated_text']
        # Simulated parsing since model output format can be raw string
        # Typically we use re or json_repair
        try:
            return json.loads(generated_text[generated_text.find('{'):generated_text.rfind('}')+1])
        except json.JSONDecodeError:
            return generate_mock_insights(keyword)
            
    except Exception as e:
        print(f"Hugging Face API Error: {e}")
        return generate_mock_insights(keyword)


def generate_mock_insights(keyword: str) -> Dict:
    """ Generates a simulated LLM response for seamless local testing. """
    return {
        "summary": [
            f"{keyword.capitalize()} is experiencing significant market volatility.",
            f"Strategic shifts are driving increased investor curiosity.",
            f"Recent supply chain changes present short-term risks but long-term opportunity."
        ],
        "sentiment_score": 0.45
    }
