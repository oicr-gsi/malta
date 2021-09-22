from flask import Flask, send_file, request
from extraction import get_gamma_data, set_path

app = Flask(__name__)

SOLUTION_FILENAME = '\PANX_1277_Lv_M_WG_100-JHU-003_LCM3_model_fit.pdf'

@app.route("/data/<int:gamma>", methods=['POST'])
def data(gamma):
    if request.method == 'POST':
        data = []
        print("gamma from front end", gamma)
        BASE_FILEPATH = set_path(gamma)
        pdf = BASE_FILEPATH + SOLUTION_FILENAME    
        get_gamma_data(BASE_FILEPATH, SOLUTION_FILENAME, data)

        return {gamma: data}

@app.route("/pdf", methods=['POST'])
def send_pdf():
    # print(path)
    # BASE_FILEPATH = set_path(400)
    # pdf = BASE_FILEPATH + SOLUTION_FILENAME  
    # print(pdf)
    if request.method == 'POST':
        path = request.get_json(force=True)
        print(path)
    return send_file(path)  
    # if request.method == 'POST':
    #     print('filepath', path)
    #     dir_path = path.split('/')[1:]
    #     return send_file(dir_path)  

if __name__ == "__main__":
    app.run(debug=True)

