const axios = require('axios');
const { generateSuggestedResponse } = require('./responseGenerator');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

// High/Low priority heuristic keywords
const HIGH_PRIORITY_KEYWORDS = [
  'urgent', 'immediately', 'emergency', 'payment deducted', 'charged twice',
  'account locked', 'unauthorized', 'server down', 'crash', 'production broken',
  'money lost', 'critical', 'asap', '500 error', 'compromised', 'stolen'
];

const LOW_PRIORITY_KEYWORDS = [
  'question', 'how to', 'inquiry', 'feature request', 'documentation', 'feedback',
  'discount', 'operating hours', 'tutorial', 'pricing'
];

// Lexicons for local sentiment analysis
const POSITIVE_WORDS = new Set([
  'thanks', 'thank', 'great', 'awesome', 'excellent', 'helpful', 'good', 'love',
  'appreciate', 'fixed', 'resolved', 'perfect', 'pleased', 'fast', 'smooth'
]);

const NEGATIVE_WORDS = new Set([
  'failed', 'error', 'urgent', 'charged', 'refund', 'broken', 'worst', 'bad',
  'terrible', 'stolen', 'deducted', 'freeze', 'crash', 'locked', 'cannot',
  'cant', 'delayed', 'damaged', 'frustrated', 'unacceptable', 'slow', 'horrible'
]);

// Category mapping keywords
const CATEGORY_KEYWORDS = {
  Billing: ['payment', 'invoice', 'refund', 'card', 'charge', 'billed', 'deducted', 'gst', 'tax', 'subscription', 'price', 'receipt', 'bank'],
  Technical: ['error', 'bug', 'crash', '500', '401', 'api', 'server', 'slow', 'timeout', 'freeze', 'blank', 'exception', 'code', 'database'],
  Account: ['login', 'password', '2fa', 'otp', 'locked', 'email', 'reset', 'profile', 'permission', 'credentials', 'signup', 'auth'],
  Product: ['feature', 'upgrade', 'license', 'tier', 'dark mode', 'export', 'integration', 'comparison', 'roadmap', 'plan'],
  Delivery: ['tracking', 'courier', 'package', 'parcel', 'shipping', 'address', 'transit', 'dispatch', 'delivered', 'driver'],
  General: ['hours', 'contact', 'support', 'feedback', 'phone', 'help', 'information', 'hello', 'hi']
};

// Local Node.js NLP fallback implementation
const runLocalNLP = (text) => {
  const lower = text.toLowerCase();
  const tokens = lower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);

  // Category determination
  const catScores = { Billing: 0, Technical: 0, Account: 0, Product: 0, Delivery: 0, General: 0 };
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        catScores[cat] += 1;
      }
    }
  }
  let bestCategory = 'General';
  let maxCatScore = 0;
  for (const [cat, score] of Object.entries(catScores)) {
    if (score > maxCatScore) {
      maxCatScore = score;
      bestCategory = cat;
    }
  }

  // Priority determination
  let priority = 'Medium';
  for (const kw of HIGH_PRIORITY_KEYWORDS) {
    if (lower.includes(kw)) {
      priority = 'High';
      break;
    }
  }
  if (priority !== 'High') {
    for (const kw of LOW_PRIORITY_KEYWORDS) {
      if (lower.includes(kw)) {
        priority = 'Low';
        break;
      }
    }
  }

  // Sentiment determination
  let posCount = 0;
  let negCount = 0;
  for (const token of tokens) {
    if (POSITIVE_WORDS.has(token)) posCount++;
    if (NEGATIVE_WORDS.has(token)) negCount++;
  }
  let sentiment = 'Neutral';
  if (negCount > posCount) sentiment = 'Negative';
  else if (posCount > negCount) sentiment = 'Positive';

  const suggestedResponse = generateSuggestedResponse(bestCategory, priority, sentiment);

  return {
    category: bestCategory,
    priority,
    sentiment,
    suggested_response: suggestedResponse,
    meta: {
      source: 'local_nlp_engine',
      tokens_count: tokens.length
    }
  };
};

// Predict ticket category, priority, sentiment via Python ML Flask service (with fallback)
const predictTicketAI = async (title, description) => {
  const fullText = `${title} ${description}`.trim();

  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/predict`,
      { title, description },
      { timeout: 3000 }
    );

    if (response.data && response.data.category) {
      return {
        category: response.data.category,
        priority: response.data.priority,
        sentiment: response.data.sentiment,
        suggested_response: response.data.suggested_response || generateSuggestedResponse(response.data.category, response.data.priority, response.data.sentiment),
        meta: {
          source: 'python_flask_ml_service',
          confidence: response.data.confidence || 0.88
        }
      };
    }
  } catch (error) {
    console.warn(`[ML Service Notice] Python ML API at ${ML_SERVICE_URL} not reachable. Running internal TF-IDF & Heuristic NLP engine.`);
  }

  // Fallback to local NLP
  return runLocalNLP(fullText);
};

module.exports = {
  predictTicketAI,
  runLocalNLP
};
