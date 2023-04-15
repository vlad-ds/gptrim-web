import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

nltk.download('punkt')


def remove_articles_prepositions(words):
    articles_prepositions = [
        'the', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of'
    ]
    return [word for word in words if word not in articles_prepositions]


def gptrim(text: str):

    words = nltk.word_tokenize(text)
    stop_words = stopwords.words("english")
    words = [word for word in words if word not in stop_words]

    ps = PorterStemmer()
    words = [ps.stem(word) for word in words]
    words = remove_articles_prepositions(words)
    trimmed = "".join(words)
    return trimmed
