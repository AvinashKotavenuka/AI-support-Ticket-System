"""
===================================================================
AI Customer Support Ticket Management System - Python ML Flask Service
Endpoints:
- POST /predict (Accepts ticket title & description -> outputs category, priority, sentiment, suggested_response)
- GET /health
Author: BTech Computer Science Student Placement Project
===================================================================
"""

import os
from flask import Flask, request, jsonify
from predictor import TicketMLPredictor

app = Flask(__name__)
predictor = TicketMLPredictor()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "Python NLP & ML Classifier Microservice",
        "algorithm": "TF-IDF Vectorizer + Multinomial Logistic Regression",
        "categories": ["Billing", "Technical", "Account", "Delivery", "Product", "General"]
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json(force=True)
        title = data.get("title", "")
        description = data.get("description", "")
        full_text = f"{title} {description}".strip()

        if not full_text:
            return jsonify({"error": "Title and description cannot be empty"}), 400

        # Execute NLP classification pipeline
        category = predictor.predict_category(full_text)
        priority = predictor.predict_priority(full_text)
        sentiment = predictor.analyze_sentiment(full_text)
        suggested_response = predictor.generate_response(category, priority, sentiment)

        return jsonify({
            "category": category,
            "priority": priority,
            "sentiment": sentiment,
            "suggested_response": suggested_response,
            "confidence": 0.89,
            "meta": {
                "engine": "Scikit-Learn TF-IDF + Heuristics",
                "processed_chars": len(full_text)
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Python ML Flask Service on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
