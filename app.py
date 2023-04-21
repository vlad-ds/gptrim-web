from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from gptrim import trim
import tiktoken

app = Flask(__name__)
CORS(app)
CORS(app, origins=['https://gptrim.com',
                   'https://gptrim.onrender.com'])


def count_tokens(text: str, model: str) -> int:
    encoding = tiktoken.encoding_for_model(model)
    tokens = encoding.encode(text)
    return len(tokens)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/transform', methods=['POST'])
def api_transform():
    input_text = request.form.get('text', '')
    stemmer = request.form.get("stemmer")
    model = request.form.get("model")
    token_count = count_tokens(input_text, model)
    text_trimmed = trim(input_text, stemmer=stemmer, language="english")
    return jsonify(text_trimmed=text_trimmed, token_count=token_count)


if __name__ == '__main__':
    app.run(debug=True)
