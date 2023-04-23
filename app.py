from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from gptrim import trim
import tiktoken

app = Flask(__name__)
CORS(app)
CORS(app, origins=['https://gptrim.com',
                   'https://gptrim.onrender.com'])


def count_tokens(text: str,) -> int:
    encoding = tiktoken.encoding_for_model("cl100k_base")
    tokens = encoding.encode(text)
    return len(tokens)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/transform', methods=['POST'])
def api_transform():
    input_text = request.form.get('text', '')
    stemmer = request.form.get("stemmer")
    text_trimmed = trim(input_text, stemmer=stemmer, language="english")
    result = {'text_trimmed': text_trimmed}
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
