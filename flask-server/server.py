from flask import Flask, send_file, request
from extraction import get_gamma_data, set_path
import os

app = Flask(__name__)

SOLUTION_FILENAME = str(os.getenv("SOLUTION_FILENAME"))

@app.route("/data/<int:gamma>", methods=['POST'])
def data(gamma):
    if request.method == 'POST':
        print("gamma from front end", gamma)
        BASE_FILEPATH = set_path(gamma)
        data = []
        data = get_gamma_data(BASE_FILEPATH, SOLUTION_FILENAME)
        return {gamma: data}

@app.route("/pdf", methods=['POST'])
def send_pdf():
    if request.method == 'POST':
        path = request.get_json(force=True)
        print(path)
        return send_file(path)  
    else: pass

if __name__ == "__main__":
    app.run(debug=True)

