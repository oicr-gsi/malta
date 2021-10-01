from flask import Flask, send_file, request, session
from extraction import get_gamma_data, get_data_folders, get_gamma_options, get_solution_name
import os

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")

@app.route("/data_folders")
def data_options():
    return {"data": get_data_folders()}

@app.route("/selected_folder/<string:folder_name>", methods=["POST"])
def selected_folder(folder_name):
    if request.method == "POST":
        print("\nselected folder:", folder_name, "\n")
        session["selected_data_folder"] = folder_name
        return gamma_options(folder_name)


def gamma_options(folder_name):
    data_path = os.path.join(os.getenv("MALTA_DATA_FOLDER"), folder_name)
    print(data_path)
    return {"data": get_gamma_options(data_path)}


@app.route("/data/<int:gamma>", methods=["POST"])
def data(gamma):
    if request.method == "POST":
        print("gamma from front end", gamma)
        solution_filename = get_solution_name(session["selected_data_folder"])
        data = get_gamma_data(gamma, session["selected_data_folder"], get_solution_name(session["selected_data_folder"]))
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
