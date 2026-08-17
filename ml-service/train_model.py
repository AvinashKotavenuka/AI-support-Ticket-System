"""
===================================================================
Scikit-learn Model Training Script for AI Support Ticket Classification
Algorithm: TF-IDF Vectorizer + Multinomial Logistic Regression
===================================================================
"""

import os
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from preprocessing import preprocess_pipeline

def train_and_save_model():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, "data", "tickets.csv")
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    print(f"Loading training data from: {data_path}")
    if not os.path.exists(data_path):
        print(f"Error: Dataset not found at {data_path}")
        return

    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} sample tickets.")
    print("Class distribution:")
    print(df['category'].value_counts())

    # Preprocessing
    df['clean_text'] = df['text'].apply(preprocess_pipeline)

    X = df['clean_text']
    y = df['category']

    # Vectorization
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=1000)
    X_tfidf = vectorizer.fit_transform(X)

    # Model training
    model = LogisticRegression(max_iter=500, random_state=42)
    model.fit(X_tfidf, y)

    # Save artifacts
    model_file = os.path.join(models_dir, "model.pkl")
    vec_file = os.path.join(models_dir, "vectorizer.pkl")

    joblib.dump(model, model_file)
    joblib.dump(vectorizer, vec_file)

    print(f"✅ Model saved to: {model_file}")
    print(f"✅ Vectorizer saved to: {vec_file}")
    print("Model training completed successfully!")

if __name__ == "__main__":
    train_and_save_model()
