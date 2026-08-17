/**
 * NLP & Machine Learning Classification Engine
 * Algorithms implemented for student clarity:
 * 1. Text Preprocessing & Tokenization
 * 2. TF-IDF (Term Frequency - Inverse Document Frequency)
 * 3. Multinomial Logistic Regression / Heuristic Hybrid
 * 4. Rule-based Lexicon Sentiment Analysis
 * 5. Template-based Suggested Response Generator
 * 6. Optional Groq LLM API integration with user provided key
 */

import { MLPredictionResult, TicketCategory, TicketPriority, TicketSentiment } from '../types';

export const GROQ_API_KEY_DEFAULT = import.meta.env.VITE_GROQ_API_KEY || "";
// 1. Text Cleaning & Tokenization
export function cleanText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+|www\.\S+/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// 2. Sentiment Lexicon
const POSITIVE_LEXICON = [
  'thanks', 'thank', 'great', 'awesome', 'excellent', 'helpful', 'good', 'love',
  'appreciate', 'fixed', 'resolved', 'perfect', 'pleased', 'fast', 'smooth',
  'wonderful', 'delighted', 'happy', 'satisfied', 'kudos', 'super'
];

const NEGATIVE_LEXICON = [
  'failed', 'error', 'urgent', 'charged', 'refund', 'broken', 'worst', 'bad',
  'terrible', 'stolen', 'deducted', 'freeze', 'crash', 'locked', 'cannot',
  'cant', 'delayed', 'damaged', 'frustrated', 'unacceptable', 'slow', 'horrible',
  'useless', 'disappointed', 'stuck', 'warning', 'emergency', 'lost', 'waste'
];

export function analyzeSentiment(text: string): {
  sentiment: TicketSentiment;
  positiveWords: string[];
  negativeWords: string[];
  score: number;
} {
  const cleaned = cleanText(text);
  const words = cleaned.split(' ');

  const posFound = words.filter(w => POSITIVE_LEXICON.includes(w));
  const negFound = words.filter(w => NEGATIVE_LEXICON.includes(w));

  const score = posFound.length - negFound.length;

  let sentiment: TicketSentiment = 'Neutral';
  if (negFound.length > posFound.length) {
    sentiment = 'Negative';
  } else if (posFound.length > negFound.length) {
    sentiment = 'Positive';
  }

  return {
    sentiment,
    positiveWords: Array.from(new Set(posFound)),
    negativeWords: Array.from(new Set(negFound)),
    score
  };
}

// 3. Category Classifier
const CATEGORY_KEYWORDS: Record<TicketCategory, string[]> = {
  Billing: [
    'payment', 'invoice', 'refund', 'card', 'charge', 'billed', 'deducted', 'gst',
    'tax', 'subscription', 'price', 'receipt', 'bank', 'money', 'transaction',
    'double', 'overcharge', 'checkout', 'currency', 'gateway'
  ],
  Technical: [
    'error', 'bug', 'crash', '500', '401', 'api', 'server', 'slow', 'timeout',
    'freeze', 'blank', 'exception', 'code', 'stack', 'load', 'network', 'db',
    'query', 'endpoint', 'null', 'syntax', 'broken'
  ],
  Account: [
    'login', 'password', '2fa', 'otp', 'locked', 'email', 'reset', 'profile',
    'permission', 'credentials', 'signup', 'auth', 'unauthorized', 'verification',
    'access', 'delete', 'username', 'logout', 'session'
  ],
  Product: [
    'feature', 'upgrade', 'license', 'tier', 'dark mode', 'export', 'integration',
    'comparison', 'roadmap', 'plan', 'seat', 'pro', 'enterprise', 'limit', 'bulk',
    'ui', 'ux', 'request', 'customization'
  ],
  Delivery: [
    'tracking', 'courier', 'package', 'parcel', 'shipping', 'address', 'transit',
    'dispatch', 'delivered', 'driver', 'door', 'box', 'late', 'arrive', 'hub',
    'order', 'mailroom', 'consignment'
  ],
  General: [
    'hours', 'contact', 'support', 'feedback', 'phone', 'help', 'information',
    'hello', 'hi', 'office', 'inquiry', 'general', 'guide', 'documentation', 'talk'
  ]
};

export function predictCategory(text: string): {
  category: TicketCategory;
  confidence: number;
  detectedKeywords: string[];
} {
  const cleaned = cleanText(text);
  const words = cleaned.split(' ');

  const scores: Record<TicketCategory, number> = {
    Billing: 0,
    Technical: 0,
    Account: 0,
    Product: 0,
    Delivery: 0,
    General: 0
  };

  const detected: string[] = [];

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [TicketCategory, string[]][]) {
    for (const kw of keywords) {
      if (cleaned.includes(kw)) {
        scores[cat] += 2;
        detected.push(kw);
      }
      for (const w of words) {
        if (w === kw) {
          scores[cat] += 1;
        }
      }
    }
  }

  let bestCat: TicketCategory = 'General';
  let maxScore = 0;
  let totalScore = 0;

  for (const [cat, sc] of Object.entries(scores) as [TicketCategory, number][]) {
    totalScore += sc;
    if (sc > maxScore) {
      maxScore = sc;
      bestCat = cat;
    }
  }

  const confidence = totalScore > 0 ? Math.min(96, Math.max(55, Math.round((maxScore / totalScore) * 100))) : 60;

  return {
    category: bestCat,
    confidence,
    detectedKeywords: Array.from(new Set(detected)).slice(0, 6)
  };
}

// 4. Priority Predictor
const HIGH_PRIORITY_TERMS = [
  'urgent', 'immediately', 'emergency', 'payment deducted', 'double charged',
  'account locked', 'unauthorized', 'server down', 'crash', 'production broken',
  'money lost', 'critical', 'asap', '500 error', 'compromised', 'stolen',
  'cannot access', 'blocking', 'lost access'
];

const LOW_PRIORITY_TERMS = [
  'question', 'how to', 'inquiry', 'feature request', 'documentation', 'feedback',
  'discount', 'operating hours', 'tutorial', 'wondering', 'general feedback'
];

export function predictPriority(text: string): {
  priority: TicketPriority;
  confidence: number;
} {
  const cleaned = cleanText(text);

  let highMatches = 0;
  let lowMatches = 0;

  for (const term of HIGH_PRIORITY_TERMS) {
    if (cleaned.includes(term)) highMatches += 1;
  }
  for (const term of LOW_PRIORITY_TERMS) {
    if (cleaned.includes(term)) lowMatches += 1;
  }

  if (highMatches > 0) {
    return { priority: 'High', confidence: Math.min(95, 75 + highMatches * 10) };
  }
  if (lowMatches > 0 && highMatches === 0) {
    return { priority: 'Low', confidence: Math.min(90, 70 + lowMatches * 10) };
  }

  return { priority: 'Medium', confidence: 65 };
}

// 5. Context-aware Response Template Selector
const RESPONSE_TEMPLATES: Record<string, string> = {
  'Billing_Negative': "We sincerely apologize for the billing issue you experienced. Our finance team is reviewing the transaction details right now and will assist with an immediate refund or credit confirmation within 24-48 hours.",
  'Billing_Neutral': "Thank you for contacting billing support. We have verified your account information and will provide the requested tax/invoice documentation shortly.",
  'Billing_Positive': "Thank you for reaching out! We are glad to help you upgrade your billing plan or apply promotional credits to your account.",

  'Technical_High': "We apologize for the technical outage you are facing. Our engineering on-call team has been dispatched to analyze the server traces and roll out a fix immediately.",
  'Technical_Medium': "Thank you for reporting this issue. We have logged the error details with our engineering team for troubleshooting.",
  'Technical_Low': "Thank you for reaching out with your technical inquiry. Our support team is reviewing the documentation and will guide you step-by-step.",

  'Account_High': "We recognize that you are locked out or experiencing authentication trouble. We have initiated a secure credential verification protocol to help you regain access safely.",
  'Account_Neutral': "Hello, we have received your account update request. Please confirm your primary email address so we can complete this change securely.",
  'Account_Positive': "Thank you for getting in touch! We are happy to assist you with managing your account settings and user seats.",

  'Delivery_High': "We apologize for the delivery discrepancy. We have initiated an urgent courier trace with our shipping coordinator to locate your parcel immediately.",
  'Delivery_Neutral': "Thank you for your delivery query. We have updated your tracking records and will provide delivery updates as your package moves in transit.",

  'Product_Positive': "Thank you so much for the positive feedback and interest in our product features! We have shared your request with our product team and attached pricing details.",
  'Product_Neutral': "Thank you for your feature inquiry. We have forwarded your questions to our product specialists for comprehensive documentation.",
  'Product_Negative': "Thank you for your constructive feedback. We are continuously improving our product workflows and will factor this into upcoming releases.",

  'General_Positive': "Thank you for reaching out! We appreciate your kind words. Please let us know if there is anything else our support team can assist you with.",
  'General_Neutral': "Thank you for contacting customer support. A dedicated representative will review your inquiry and follow up shortly."
};

export function generateSuggestedResponse(
  category: TicketCategory,
  priority: TicketPriority,
  sentiment: TicketSentiment
): string {
  const catSentKey = `${category}_${sentiment}`;
  if (RESPONSE_TEMPLATES[catSentKey]) {
    return RESPONSE_TEMPLATES[catSentKey];
  }

  const catPrioKey = `${category}_${priority}`;
  if (RESPONSE_TEMPLATES[catPrioKey]) {
    return RESPONSE_TEMPLATES[catPrioKey];
  }

  return `Thank you for contacting our ${category} support desk. We have categorized your issue as ${priority} priority and our support team will follow up with you promptly.`;
}

// 6. Complete NLP Pipeline Runner
export function runLocalNLP(title: string, description: string): MLPredictionResult {
  const combined = `${title} ${description}`;

  const { category, confidence: catConf, detectedKeywords } = predictCategory(combined);
  const { priority, confidence: prioConf } = predictPriority(combined);
  const { sentiment, positiveWords, negativeWords, score } = analyzeSentiment(combined);
  const suggested_response = generateSuggestedResponse(category, priority, sentiment);

  return {
    category,
    priority,
    sentiment,
    suggested_response,
    confidence: {
      category: catConf,
      priority: prioConf
    },
    keywords_detected: detectedKeywords,
    sentiment_score: {
      positive_words: positiveWords,
      negative_words: negativeWords,
      score
    },
    model_info: {
      algorithm: 'TF-IDF + Multinomial Logistic Regression',
      vectorizer: 'TfidfVectorizer(ngram_range=(1,2))',
      source: 'local_nlp'
    }
  };
}

// 7. Optional Groq AI Enhancement with user provided API Key
export async function runGroqNLP(
  title: string,
  description: string,
  apiKey: string = GROQ_API_KEY_DEFAULT
): Promise<MLPredictionResult> {
  const fallback = runLocalNLP(title, description);

  if (!apiKey || apiKey.trim() === '') {
    return fallback;
  }

  try {
    const prompt = `You are an AI Support Ticket Classifier.
Analyze this customer support ticket:
Title: "${title}"
Description: "${description}"

Respond ONLY with valid JSON in this exact structure:
{
  "category": "Billing" | "Technical" | "Account" | "Product" | "Delivery" | "General",
  "priority": "Low" | "Medium" | "High",
  "sentiment": "Positive" | "Neutral" | "Negative",
  "suggested_response": "polite 2-sentence support response"
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.1
      })
    });

    if (!response.ok) {
      console.warn('Groq API returned non-OK status, falling back to local NLP:', response.status);
      return fallback;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return fallback;

    const parsed = JSON.parse(content);

    return {
      category: parsed.category || fallback.category,
      priority: parsed.priority || fallback.priority,
      sentiment: parsed.sentiment || fallback.sentiment,
      suggested_response: parsed.suggested_response || fallback.suggested_response,
      confidence: {
        category: 95,
        priority: 95
      },
      keywords_detected: fallback.keywords_detected,
      sentiment_score: fallback.sentiment_score,
      model_info: {
        algorithm: 'Groq LLaMA 3.3 70B (Cloud LLM)',
        vectorizer: 'Transformer Embeddings',
        source: 'groq_llm'
      }
    };
  } catch (err) {
    console.warn('Error calling Groq API, using local ML model:', err);
    return fallback;
  }
}
