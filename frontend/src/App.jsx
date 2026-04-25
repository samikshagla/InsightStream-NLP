import { useState } from 'react'

function App() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!keyword.trim()) return

    setLoading(true)
    setError(null)
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/analyze?keyword=${encodeURIComponent(keyword)}`)
      if (!response.ok) throw new Error('Failed to fetch data')
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Convert score (-1 to 1) to percentage (0% to 100%)
  const getSentimentWidth = (score) => {
    const percentage = ((score + 1) / 2) * 100
    return Math.max(0, Math.min(100, percentage))
  }

  // Get color based on sentiment score
  const getSentimentColor = (score) => {
    if (score < -0.3) return 'bg-red-500' // Bearish
    if (score > 0.3) return 'bg-green-500' // Bullish
    return 'bg-yellow-500' // Neutral
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-10 px-4 font-sans">
      <header className="max-w-4xl w-full text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-4 tracking-tight">
          InsightStream AI
        </h1>
        <p className="text-slate-400 text-lg">
          Real-Time Market Intelligence Dashboard powered by NLP & LLMs
        </p>
      </header>

      <main className="max-w-4xl w-full space-y-8">
        {/* Search Bar - Glassmorphism UI */}
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative bg-slate-800 ring-1 ring-slate-700/50 rounded-2xl p-2 flex">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter a company name, ticker, or product..."
              className="flex-grow bg-transparent border-none focus:ring-0 text-lg px-4 text-slate-100 placeholder-slate-400 outline-none"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : 'Analyze'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-900/40 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl shadow-sm text-center">
            {error}
          </div>
        )}

        {/* Dashboard Results */}
        {results && !loading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Top Grid: Key Stats & Sentiment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Sentiment Meter */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4 text-slate-200 flex items-center gap-2">
                  <span className="text-2xl">🔥</span> Market Mood
                </h3>
                <div className="flex justify-between text-sm text-slate-400 mb-2 font-medium">
                  <span>Bearish</span>
                  <span>Neutral</span>
                  <span>Bullish</span>
                </div>
                {/* Progress Bar Container */}
                <div className="w-full bg-slate-700/50 rounded-full h-4 mb-2 overflow-hidden shadow-inner">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 ease-out ${getSentimentColor(results.sentiment_score)}`}
                    style={{ width: `${getSentimentWidth(results.sentiment_score)}%` }}
                  ></div>
                </div>
                <div className="text-center text-4xl font-bold mt-4" style={{ color: getSentimentColor(results.sentiment_score).replace('bg-', '') }}>
                  {results.sentiment_score.toFixed(2)}
                </div>
                <p className="text-center text-sm text-slate-400 mt-1 uppercase tracking-wider text-xs font-semibold">
                  Sentiment Score
                </p>
              </div>

              {/* Entity Extraction */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-sm flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-slate-200 flex items-center gap-2">
                  <span className="text-2xl">🎯</span> Extracted Entities
                </h3>
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="text-xs tracking-wider uppercase text-slate-500 font-bold mb-2 block">Organizations / Subjects</span>
                    <div className="flex flex-wrap gap-2">
                      {results.entities.organizations.length > 0 ? results.entities.organizations.map((org, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-md text-sm font-medium">
                          {org}
                        </span>
                      )) : <span className="text-slate-500 text-sm">None detected</span>}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs tracking-wider uppercase text-slate-500 font-bold mb-2 block">Financial Metrics</span>
                    <div className="flex flex-wrap gap-2">
                      {results.entities.money.length > 0 ? results.entities.money.map((money, i) => (
                        <span key={i} className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-300 rounded-md text-sm font-medium">
                          {money}
                        </span>
                      )) : <span className="text-slate-500 text-sm">None detected</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Insights Section */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
              
              <h3 className="text-xl font-semibold mb-6 text-slate-200 flex items-center gap-2">
                <span className="text-2xl">🧠</span> Executive Summary
              </h3>
              
              <ul className="space-y-4">
                {results.executive_summary.map((insight, idx) => (
                  <li key={idx} className="flex items-start bg-slate-700/30 p-4 rounded-xl shadow-sm border border-slate-700/50 hover:bg-slate-700/50 transition">
                    <span className="text-teal-400 mr-3 mt-0.5 text-xl">✦</span>
                    <p className="text-slate-200 leading-relaxed text-[15px] font-medium">{insight}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 text-right">
                <span className="text-xs font-semibold tracking-wide uppercase px-2 py-1 bg-slate-700 text-slate-400 rounded-md">
                 Analyzed {results.news_volume} recent sources
                </span>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}

export default App
