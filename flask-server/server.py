from flask import Flask, send_file, request
from extraction import get_gamma_data, get_data_folders, get_gamma_options, get_solution_name
import os

app = Flask(__name__)


SELECTED_DATA_FOLDER = ""

@app.route("/data_folders")
def data_options():
    return {"data": get_data_folders()}

@app.route("/selected_folder/<string:folder_name>", methods=["POST"])
def selected_folder(folder_name):
    if request.method == "POST":
        print("\nselected folder:", folder_name, "\n")
        SELECTED_DATA_FOLDER = folder_name
        return gamma_options(SELECTED_DATA_FOLDER)


def gamma_options(folder_name):
    data_path = os.path.join(os.getenv("MALTA_DATA_FOLDER"), folder_name)
    return {"options": get_gamma_options(data_path)}

@app.route("/data/<int:gamma>", methods=["POST"])
def data(gamma):
    if request.method == "POST":
        print("gamma from front end", gamma)
        # DATA_PATH = os.path.join(os.getenv("MALTA_DATA_FOLDER"), SELECTED_DATA_FOLDER)
        # BASE_PATH = os.path.join(DATA_PATH, "gammas")
        solution_filename = get_solution_name(SELECTED_DATA_FOLDER)
        data = get_gamma_data(gamma, str(os.getenv("TEST_DATA")), get_solution_name(str(os.getenv("TEST_DATA"))) )
        return {gamma: data}

@app.route("/pdf", methods=["POST"])
def send_pdf():
    if request.method == "POST":
        path = request.get_json(force=True)
        print(path)
        return send_file(path)  
    else: pass

if __name__ == "__main__":
    app.run(debug=True)

# PANX_1288_Pm_M_100_JHU_004_LCM3_6.results.zip