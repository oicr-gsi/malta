from flask import Flask, send_file
from extraction import get_gamma_data, set_path
app = Flask(__name__)

@app.route("/members")
def members():
    return {"members": [f"Member{i+1}" for i in range(3)]}



SOLUTION_FILENAME = '\PANX_1277_Lv_M_WG_100-JHU-003_LCM3_model_fit.pdf'

@app.route("/data")
def data():
    data = []
    gamma = 400
    BASE_FILEPATH = set_path(gamma)
    pdf = BASE_FILEPATH + SOLUTION_FILENAME    
    get_gamma_data(BASE_FILEPATH, SOLUTION_FILENAME, data)
    
    return {gamma: data}

@app.route("/pdf")
def send_pdf():
    BASE_FILEPATH = set_path(400)
    pdf = BASE_FILEPATH + SOLUTION_FILENAME  
    return send_file(pdf)  

if __name__ == "__main__":
    app.run(debug=True)