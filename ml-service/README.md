# Python NLP & Machine Learning Microservice

This microservice handles automated ticket categorization, priority prediction, and sentiment analysis for customer support tickets.

## Architecture
- **Text Preprocessing**: Tokenization, lowercase transformation, special character stripping, English stopword removal (`preprocessing.py`).
- **Feature Extraction**: TF-IDF Vectorizer with unigrams & bigrams (`ngram_range=(1, 2)`).
- **Classification Model**: Multinomial Logistic Regression (`Scikit-learn`).
- **Sentiment Engine**: Transparent lexicon scoring (`Positive count - Negative count`).
- **Framework**: Python 3.10+ & Flask HTTP REST API.

## Setup & Running Locally

1. Create and activate a Python virtual environment:
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Train the model on the support dataset:
```bash
python train_model.py
```

4. Start the Flask server:
```bash
python app.py
```
The service will listen on `http://localhost:5000`.

## API Endpoints

### 1. Health Check
`GET /health`
```json
{
  "status": "healthy",
  "service": "Python NLP & ML Classifier Microservice"
}
```

### 2. Predict Ticket
`POST /predict`
```json
{
  "title": "Payment deducted twice",
  "description": "My card was charged $129 twice for order #9921."
}
```

**Response:**
```json
{
  "category": "Billing",
  "priority": "High",
  "sentiment": "Negative",
  "suggested_response": "We sincerely apologize for the billing issue...",
  "confidence": 0.89
}
```
