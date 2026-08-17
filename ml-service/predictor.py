import os
import joblib
from preprocessing import clean_text, preprocess_pipeline

# Priority heuristic keywords
HIGH_PRIORITY_KEYWORDS = [
    'urgent', 'immediately', 'emergency', 'payment deducted', 'charged twice', 
    'account locked', 'unauthorized', 'server down', 'crash', 'production broken', 
    'money lost', 'critical', 'asap', '500 error', 'compromised', 'stolen'
]

LOW_PRIORITY_KEYWORDS = [
    'question', 'how to', 'inquiry', 'feature request', 'documentation', 'feedback', 
    'discount', 'operating hours', 'tutorial', 'pricing'
]

# Lexicon for transparent sentiment calculation (Positive - Negative)
POSITIVE_WORDS = {
    'thanks', 'thank', 'great', 'awesome', 'excellent', 'helpful', 'good', 'love', 
    'appreciate', 'fixed', 'resolved', 'perfect', 'pleased', 'fast', 'smooth'
}

NEGATIVE_WORDS = {
    'failed', 'error', 'urgent', 'charged', 'refund', 'broken', 'worst', 'bad', 
    'terrible', 'stolen', 'deducted', 'freeze', 'crash', 'locked', 'cannot', 
    'cant', 'delayed', 'damaged', 'frustrated', 'unacceptable', 'slow', 'horrible'
}

CATEGORY_KEYWORDS = {
    "Billing": ["payment", "invoice", "refund", "card", "charge", "billed", "deducted", "gst", "tax", "subscription", "price", "receipt"],
    "Technical": ["error", "bug", "crash", "500", "401", "api", "server", "slow", "timeout", "freeze", "blank", "exception", "code"],
    "Account": ["login", "password", "2fa", "otp", "locked", "email", "reset", "profile", "permission", "credentials", "signup"],
    "Product": ["feature", "upgrade", "license", "tier", "dark mode", "export", "integration", "comparison", "roadmap", "plan"],
    "Delivery": ["tracking", "courier", "package", "parcel", "shipping", "address", "transit", "dispatch", "delivered", "driver"],
    "General": ["hours", "contact", "support", "feedback", "phone", "help", "information", "hello", "hi"]
}

class TicketMLPredictor:
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.load_models()

    def load_models(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, "models", "model.pkl")
        vec_path = os.path.join(base_dir, "models", "vectorizer.pkl")

        if os.path.exists(model_path) and os.path.exists(vec_path):
            try:
                self.model = joblib.load(model_path)
                self.vectorizer = joblib.load(vec_path)
                print("Loaded trained Scikit-learn TF-IDF & Logistic Regression model.")
            except Exception as e:
                print(f"Notice: Model files load warning: {e}. Using heuristic fallbacks.")
        else:
            print("Notice: No saved model.pkl found. Using heuristic TF-IDF classifier.")

    def predict_category(self, text: str) -> str:
        if self.model and self.vectorizer:
            try:
                processed = preprocess_pipeline(text)
                vec = self.vectorizer.transform([processed])
                predicted = self.model.predict(vec)[0]
                return str(predicted)
            except Exception:
                pass

        # Heuristic fallback
        lower = text.lower()
        scores = {cat: 0 for cat in CATEGORY_KEYWORDS}
        for cat, kws in CATEGORY_KEYWORDS.items():
            for kw in kws:
                if kw in lower:
                    scores[cat] += 1
        best_cat = max(scores, key=scores.get)
        return best_cat if scores[best_cat] > 0 else "General"

    def predict_priority(self, text: str) -> str:
        lower = text.lower()
        for kw in HIGH_PRIORITY_KEYWORDS:
            if kw in lower:
                return "High"
        for kw in LOW_PRIORITY_KEYWORDS:
            if kw in lower:
                return "Low"
        return "Medium"

    def analyze_sentiment(self, text: str) -> str:
        words = clean_text(text).split()
        pos_count = sum(1 for w in words if w in POSITIVE_WORDS)
        neg_count = sum(1 for w in words if w in NEGATIVE_WORDS)

        if neg_count > pos_count:
            return "Negative"
        elif pos_count > neg_count:
            return "Positive"
        return "Neutral"

    def generate_response(self, category: str, priority: str, sentiment: str) -> str:
        templates = {
            ("Billing", "Negative"): "We sincerely apologize for the billing issue you experienced. Our finance team is reviewing the transaction details right now and will assist with an immediate refund or credit confirmation within 24-48 hours.",
            ("Technical", "High"): "We apologize for the critical technical malfunction. Our senior engineering team has been alerted to review the system logs and deploy an urgent patch.",
            ("Account", "High"): "We recognize that you are locked out or experiencing authentication trouble. We have initiated a secure credential verification protocol to help you regain access safely.",
            ("Delivery", "High"): "We apologize for the delivery discrepancy. We have initiated an urgent courier trace with our shipping coordinator to locate your parcel immediately.",
            ("Product", "Positive"): "Thank you so much for the positive feedback and interest in our product features! We have shared your request with our product team.",
            ("General", "Neutral"): "Thank you for contacting customer support. A support representative will review your request and reply shortly."
        }
        if (category, sentiment) in templates:
            return templates[(category, sentiment)]
        if (category, priority) in templates:
            return templates[(category, priority)]
        return f"Thank you for contacting our {category} support desk. We have classified this request as {priority} priority and our dedicated agents will assist you promptly."
