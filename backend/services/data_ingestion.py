import random
from typing import List, Dict

# Mock data generation for robust, key-less demonstration
MOCK_HEADLINES = [
    "shares soared by 15% today after an incredible earnings report.",
    "is planning to acquire a promising startup for $200 million this quarter.",
    "unveiled a revolutionary new product line, causing market excitement.",
    "faced a minor setback with a supply chain delay costing them $50M.",
    "CEO announced a strategic pivot toward artificial intelligence."
]

def fetch_financial_news(keyword: str) -> List[Dict]:
    """
    Fetches real-time market news. 
    In this implementation, returns mock datastream for demonstration without API rate limits.
    """
    news_items = []
    
    # Generate 3-5 mock articles
    for _ in range(random.randint(3, 5)):
        headline_template = random.choice(MOCK_HEADLINES)
        text = f"{keyword.capitalize()} {headline_template}"
        news_items.append({
            "source": "Mock Financial Times",
            "published_at": "Just now",
            "text": text
        })
        
    return news_items
