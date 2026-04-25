from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from services.data_ingestion import fetch_financial_news
from services.nlp_engine import analyze_portfolio_news
from services.llm_service import generate_insights
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="InsightStream NLP API",
    description="Real-Time Market Intelligence endpoints powering the NLP Dashboard",
    version="1.0.0"
)

# Setup CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to InsightStream FastAPI Backend"}

@app.get("/analyze")
def analyze_keyword(keyword: str = Query(..., min_length=2)):
    """
    Given a target keyword, fetches recent news, extracts named entities (ORG/MONEY),
    and generates an LLM-powered summary and sentiment score.
    """
    # 1. Data Ingestion
    news_items = fetch_financial_news(keyword)
    texts = [item['text'] for item in news_items]
    
    # 2. NER Processing
    extracted_entities = analyze_portfolio_news(texts)
    
    # 3. LLM Integration
    llm_insights = generate_insights(texts, keyword)
    
    return {
        "keyword": keyword,
        "news_volume": len(news_items),
        "entities": extracted_entities,
        "executive_summary": llm_insights.get("summary", []),
        "sentiment_score": llm_insights.get("sentiment_score", 0.0)
    }
