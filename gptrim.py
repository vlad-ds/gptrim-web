import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

nltk.download('punkt')
nltk.download('stopwords')


def remove_articles_prepositions(words):
    articles_prepositions = [
        'the', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of'
    ]
    return [word for word in words if word not in articles_prepositions]


negation_words = ['no', 'nor', 'not', 'don', "don't", 'ain', 'aren',
                  "aren't", 'couldn', "couldn't", 'didn', "didn't",
                  'doesn', "doesn't", 'hadn', "hadn't", 'hasn',
                  "hasn't", 'haven', "haven't", 'isn', "isn't",
                  'mightn', "mightn't", 'mustn', "mustn't",
                  'needn', "needn't", 'shan', "shan't", 'shouldn',
                  "shouldn't", 'wasn', "wasn't", 'weren', "weren't",
                  'won', "won't", 'wouldn', "wouldn't"]


def gptrim(text: str):

    words = nltk.word_tokenize(text)
    stop_words = stopwords.words("english")
    stop_words_selected = [word for word in stop_words if word not in negation_words]
    words = [word for word in words if word not in stop_words_selected]
    words = remove_articles_prepositions(words)
    ps = PorterStemmer()
    words = [ps.stem(word) for word in words]
    trimmed = "".join(words)
    return trimmed
