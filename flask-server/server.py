from flask import Flask, send_file, request
from extraction import get_gamma_data, get_data_folders, get_gamma_options
import os

app = Flask(__name__)

SOLUTION_FILENAME = str(os.getenv("SOLUTION_FILENAME"))

@app.route("/data_options")
def data_options():
    return {"data": get_data_folders()}

@app.route("/gamma_options")
def gamma_options():
    # this function will need to take a file path argument later on
    DATA_PATH = os.path.join(os.getenv("MALTA_DATA_FOLDER"), str(os.getenv("TEST_DATA")))
    return {"options": get_gamma_options(DATA_PATH)}

@app.route("/data/<int:gamma>", methods=['POST'])
def data(gamma):
    if request.method == 'POST':
        print("gamma from front end", gamma)
        DATA_PATH = os.path.join(os.getenv("MALTA_DATA_FOLDER"), str(os.getenv("TEST_DATA")))
        BASE_PATH = os.path.join(DATA_PATH, "gammas")
        data = []
        data = get_gamma_data(gamma, BASE_PATH)
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

