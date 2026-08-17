import re

# English Stopwords list
STOPWORDS = {
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
    'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
    'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 
    'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 
    'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 
    'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 
    'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
    'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once'
}

def clean_text(text: str) -> str:
    """
    Standard NLP preprocessing pipeline:
    1. Lowercase normalization
    2. URL & special character removal
    3. Strip extra whitespaces
    """
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'http\S+|www\S+|https\S+', '', text)
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def tokenize(text: str) -> list:
    """Tokenize text into lowercase words"""
    cleaned = clean_text(text)
    return [word for word in cleaned.split() if word]

def remove_stopwords(tokens: list) -> list:
    """Filter out non-informative English stopwords"""
    return [t for t in tokens if t not in STOPWORDS]

def preprocess_pipeline(text: str) -> str:
    """Preprocesses raw text ready for TF-IDF vectorization"""
    tokens = tokenize(text)
    filtered = remove_stopwords(tokens)
    return " ".join(filtered)
