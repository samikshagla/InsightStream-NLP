import spacy
from typing import List, Dict

# Load the small English pipeline
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # If not downloaded, advise or default (normally handled by our setup script)
    print("Warning: en_core_web_sm not found. Please run 'python -m spacy download en_core_web_sm'")
    nlp = None

def extract_entities(text: str) -> Dict[str, List[str]]:
    """
    Performs Named Entity Recognition on a piece of text.
    Extracts 'Organizations' (ORG) and 'Money' amounts (MONEY).
    """
    if nlp is None:
        return {"organizations": [], "money": []}
        
    doc = nlp(text)
    
    organizations = set()
    money = set()
    
    for ent in doc.ents:
        if ent.label_ == "ORG":
            organizations.add(ent.text)
        elif ent.label_ == "MONEY":
            money.add(ent.text)
            
    return {
        "organizations": list(organizations),
        "money": list(money)
    }

def analyze_portfolio_news(news_texts: List[str]) -> Dict[str, List[str]]:
    """
    Aggregates entities from a list of news articles.
    """
    all_orgs = set()
    all_money = set()
    
    for text in news_texts:
        result = extract_entities(text)
        all_orgs.update(result["organizations"])
        all_money.update(result["money"])
        
    return {
        "organizations": list(all_orgs),
        "money": list(all_money)
    }
