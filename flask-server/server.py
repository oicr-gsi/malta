import os
from flask import Flask, send_file, request, session
from extraction import (
    get_gamma_data,
    get_data_folders,
    get_gamma_options,
    get_primary_solutions_plots,
)


app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")


@app.route("/data_folders")
def data_options():
    return {"data": get_data_folders()}


@app.route("/selected_folder/<string:folder_name>", methods=["POST"])
def selected_folder(folder_name):
    if request.method == "POST":
        session["selected_data_folder"] = folder_name
        return gamma_options(folder_name)


def gamma_options(folder_name):
    data_path = os.path.join(os.getenv("MALTA_DATA_FOLDER"), folder_name)
    return {"data": get_gamma_options(data_path)}


@app.route("/data/<int:gamma>", methods=["POST"])
def data(gamma):
    if request.method == "POST":
        # print("gamma from front end", gamma)
        selected_folder = session["selected_data_folder"]
        data = get_gamma_data(gamma, selected_folder)
        return {gamma: data}


@app.route("/pdf", methods=["POST"])
def send_pdf():
    if request.method == "POST":
        path = request.get_json(force=True)
        # The path passed in here is not influenced by the user.
        # It is the path returned by the /data route, which was then automatically used to call this route
        return send_file(path)
    else:
        pass


@app.route("/primary/<string:folder_name>", methods=["POST"])
def send_primary_data(folder_name):
    if request.method == "POST":
        session["selected_data_folder"] = folder_name
        
        model_fit_data = get_primary_solutions_plots(folder_name, "_model_fit.pdf")
        genome_view_data = get_primary_solutions_plots(folder_name, "_genome_view.pdf")
 
        return {"model_fit": model_fit_data, "genome_view": genome_view_data}
    else:
        pass


if __name__ == "__main__":
    app.run(debug=True)
