from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from gptrim import gptrim

app = Flask(__name__)
CORS(app)
# TODO add origins
# CORS(app, origins=['https://your-domain.com', 'https://www.your-domain.com'])


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/transform', methods=['POST'])
def api_transform():
    input_text = request.form.get('text', '')
    text_trimmed = gptrim(input_text)
    result = {'text_trimmed': text_trimmed}
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
