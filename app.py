from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from gptrim import trim

app = Flask(__name__)
CORS(app)
CORS(app, origins=['https://gptrim.com',
                   'https://gptrim.onrender.com'])


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/transform', methods=['POST'])
def api_transform(stemmer=None, language="english"):
    input_text = request.form.get('text', '')
    text_trimmed = trim(input_text, stemmer=stemmer, language=language)
    result = {'text_trimmed': text_trimmed}
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
