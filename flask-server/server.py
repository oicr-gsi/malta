from flask import Flask
# from extract_zip_files import get_gamma_data
app = Flask(__name__)

@app.route("/members")
def members():
    return {"members": [f"Member{i+1}" for i in range(3)]}

# data = {}
# gamma = 300

# BASE_FILEPATH = f'PANX_1277_gammas\gammas\\{gamma}'
# SOLUTION_FILENAME = '\PANX_1277_Lv_M_WG_100-JHU-003_LCM3_model_fit.pdf'
# ideal_filepath = BASE_FILEPATH + SOLUTION_FILENAME

# @app.route("/data")
# def data():
#     get_gamma_data(gamma, ideal_filepath)
#     return {f"{gamma}": data}

if __name__ == "__main__":
    app.run(debug=True)