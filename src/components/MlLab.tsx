import React, { useState, useEffect } from 'react';
import { runLocalNLP, runGroqNLP, GROQ_API_KEY_DEFAULT, cleanText } from '../services/nlpClassifier';
import { MLPredictionResult } from '../types';
import { Sparkles, Terminal, Code2, Play, BookOpen, Layers, Bot, Zap, Copy, Check } from 'lucide-react';

export const MlLab: React.FC = () => {
  const [inputText, setInputText] = useState('Payment deducted twice from my bank account, order failed!');
  const [apiKey, setApiKey] = useState(GROQ_API_KEY_DEFAULT);
  const [useGroq, setUseGroq] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MLPredictionResult>(() => runLocalNLP('', inputText));
  const [copiedPython, setCopiedPython] = useState(false);

  useEffect(() => {
    if (!inputText.trim()) return;

    if (!useGroq) {
      const res = runLocalNLP('', inputText);
      setResult(res);
    }
  }, [inputText, useGroq]);

  const handleRunInference = async () => {
    setIsLoading(true);
    try {
      if (useGroq) {
        const res = await runGroqNLP('', inputText, apiKey);
        setResult(res);
      } else {
        const res = runLocalNLP('', inputText);
        setResult(res);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    {
      label: '💳 Billing: Duplicate Charge',
      text: 'My credit card was billed $99 twice for order #9420. Money was deducted from my account but order shows payment failed. Refund immediately!'
    },
    {
      label: '⚠️ Tech: API 500 Crash',
      text: 'Our server received a 500 internal server error on the database query endpoint during data export. Production application is down!'
    },
    {
      label: '🔒 Account: 2FA Failure',
      text: 'I cannot receive the SMS verification code on my phone and my account is now locked. Please unlock access.'
    },
    {
      label: '📦 Delivery: Missing Package',
      text: 'Tracking number #TRK-1029 says delivered yesterday evening, but no parcel arrived at our doorstep.'
    },
    {
      label: '⭐ Product: Team Upgrade',
      text: 'We love your tool! We want to purchase an annual license for 20 team members. Are volume discounts available?'
    }
  ];

  const cleanedTokens = cleanText(inputText).split(' ').filter(Boolean);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              NLP & Machine Learning Sandbox
            </span>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-200">
              Scikit-learn + TF-IDF
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Ticket Classification & Sentiment Inspector
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Test any natural language support inquiry to observe real-time feature extraction, vector weighting, multinomial decision boundaries, and response generation.
          </p>
        </div>

        {/* Model Mode Toggle */}
        <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-right">
            <div className="text-xs font-medium text-slate-800">
              {useGroq ? 'Groq LLaMA 3.3 Mode' : 'Local TF-IDF Mode'}
            </div>
            <div className="text-[10px] text-slate-500">
              {useGroq ? 'Cloud API' : 'Scikit-learn Simulation'}
            </div>
          </div>
          <button
            onClick={() => {
              setUseGroq(!useGroq);
            }}
            className={`p-2 rounded-lg transition-colors border ${
              useGroq ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-700 shadow-2xs'
            }`}
          >
            {useGroq ? <Zap className="w-4 h-4 text-amber-300" /> : <Bot className="w-4 h-4 text-blue-600" />}
          </button>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
        <span className="text-xs font-medium text-slate-500 block">Try Benchmark Student Test Cases:</span>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setInputText(p.text);
              }}
              className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input and Token Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Input Customer Support Text
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {inputText.length} chars | {cleanedTokens.length} tokens
              </span>
            </div>

            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter customer support complaint or question here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none font-sans"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 italic">
                Inference runs automatically upon typing
              </span>
              <button
                onClick={handleRunInference}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {isLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>Run Full ML Pipeline</span>
              </button>
            </div>
          </div>

          {/* Tokenization & Preprocessing Inspector */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Step 1: NLP Preprocessing & TF-IDF Extraction
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Text is converted to lowercase, URLs and punctuations are stripped, and informative unigrams/bigrams are extracted.
            </p>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
              {cleanedTokens.map((token, i) => {
                const isPositive = result.sentiment_score?.positive_words.includes(token);
                const isNegative = result.sentiment_score?.negative_words.includes(token);
                const isKeyword = result.keywords_detected?.includes(token);

                return (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                      isNegative
                        ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold'
                        : isPositive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold'
                        : isKeyword
                        ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {token}
                  </span>
                );
              })}
            </div>

            <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Negative Keyword
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Positive Keyword
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Domain Keyword
              </span>
            </div>
          </div>

          {/* Python Code Reference Block */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-blue-600" />
                Python Scikit-learn Code (`train_model.py`)
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

tfidf = TfidfVectorizer(ngram_range=(1,2), stop_words='english')
X = tfidf.fit_transform(corpus)
clf = LogisticRegression(max_iter=200)
clf.fit(X, y)`);
                  setCopiedPython(true);
                  setTimeout(() => setCopiedPython(false), 2000);
                }}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                {copiedPython ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPython ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-200 bg-slate-900 p-3 rounded-lg overflow-x-auto border border-slate-800">
{`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# 1. Feature Extraction: Term Frequency - Inverse Document Frequency
tfidf = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
X_train = tfidf.fit_transform(ticket_texts)

# 2. Train Multinomial Logistic Regression Classifier
model = LogisticRegression(C=1.0, max_iter=200)
model.fit(X_train, categories)`}
            </pre>
          </div>
        </div>

        {/* Right Column: Prediction Outcomes & Explainability (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Outcome Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                ML Prediction Output
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {result.model_info?.source === 'groq_llm' ? 'Groq LLaMA-3.3' : 'TF-IDF + Logistic'}
              </span>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium">Category</span>
                  <div className="text-sm font-bold text-blue-600">{result.category}</div>
                </div>
                <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                  {result.confidence?.category}% Conf.
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium">Priority Urgency</span>
                  <div className={`text-sm font-bold ${
                    result.priority === 'High' ? 'text-rose-600' :
                    result.priority === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {result.priority}
                  </div>
                </div>
                <span className="text-xs font-mono bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {result.confidence?.priority}% Conf.
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium">Sentiment Polarity</span>
                  <div className={`text-sm font-bold ${
                    result.sentiment === 'Negative' ? 'text-rose-600' :
                    result.sentiment === 'Positive' ? 'text-emerald-600' : 'text-slate-700'
                  }`}>
                    {result.sentiment}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Score: {result.sentiment_score?.score}
                  </span>
                </div>
              </div>
            </div>

            {/* Suggested Response Preview */}
            <div className="bg-blue-50/50 p-3.5 rounded-lg border border-blue-100 space-y-1.5">
              <span className="text-[11px] font-semibold text-blue-900 uppercase tracking-wider">
                Generated Response Suggestion:
              </span>
              <p className="text-xs text-slate-700 italic leading-relaxed">
                "{result.suggested_response}"
              </p>
            </div>
          </div>

          {/* Lexicon Sentiment Math Box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Sentiment Polarity Calculation
            </h4>
            <div className="text-xs text-slate-600 space-y-1 font-mono text-[11px]">
              <div>Positive Lexicon matches: {result.sentiment_score?.positive_words.length || 0} ({result.sentiment_score?.positive_words.join(', ') || 'none'})</div>
              <div>Negative Lexicon matches: {result.sentiment_score?.negative_words.length || 0} ({result.sentiment_score?.negative_words.join(', ') || 'none'})</div>
              <div className="pt-1 text-slate-900 font-semibold">
                Net Polarity = {result.sentiment_score?.positive_words.length || 0} - {result.sentiment_score?.negative_words.length || 0} = {result.sentiment_score?.score || 0}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
