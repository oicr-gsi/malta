# Author: Vivek Alamuri - Bioinformatics Programmer, OICR, Sept. 2021
import os
from zipfile import ZipFile
from PyPDF2 import PdfFileReader
# -----------------------------------------------------------------------------------
# Unzip sample data 

# with ZipFile('PANX_1277_Lv_M_100-JHU-003_LCM3.results.zip', 'r') as f:
#     f.extractall('PANX_1277_gammas')

# with ZipFile('PANX_1280_Lv_M_100-PM-022_LCM2.results.zip', 'r') as f:
#     f.extractall('PANX_1280_gammas')

# with ZipFile('PANX_1288_Pm_M_100_JHU_004_LCM3_6.results.zip', 'r') as f:
#     f.extractall('PANX_1288_gammas')

# -----------------------------------------------------------------------------------

# Extract text data from gamma folders

gammas = [i*100 for i in range(1, 10)]


gamma = 300

def set_path(gamma):
    return f'PANX_1277_gammas\gammas\\{gamma}'

BASE_FILEPATH = set_path(300)
SOLUTION_FILENAME = '\PANX_1277_Lv_M_WG_100-JHU-003_LCM3_model_fit.pdf'

def jsonify_extracted_text(text):
    """
    Helper function for extract() to format text from PDF into JSON format.

    Args:
        text: String, text extracted from PDF

    Returns:
        Dictionary with cellularity, ploidy and sd.BAF values
    """
    
    split_data = text.split()
    
    json = {
            # cellularity: {cellularity_value}; indexing of -1 is needed to remove ':' from end of the string
            f"{split_data[0][:-1]}": float(split_data[1]),
            # ploidy: {ploidy_value}; indexing of -1 is needed to remove ':' from end of the string
            f"{split_data[2][:-1]}": float(split_data[3]),
            # sd.BAF: {sd.BAF_value}; indexing of -1 is needed to remove ':' from end of the string
            f"{split_data[4][:-1]}": float(split_data[5])
    }
    
    return json

def extract(path, data, data_unique_key):
    """
    Extracts text data from PDF and stores it in a dictionary for a given gamme

    Args:
        gamma: Integer, desired gamma value
        path: String, file path to PDF
        data_unique_key: Integer, a unique id each solution for a given value of gamma. -1 is the solution in the main folder.
        ideal: Boolean, optional argument to distinguish between ideal and alternate solutions
    """

    pdf = PdfFileReader(path)

        # model_fit files have one page only, hence getPage(0) 
    pageObj = pdf.getPage(0)
    try:
        # extracted text
        txt = pageObj.extractText()
        # adding json format extracted data to dictionary
        data[f"{data_unique_key}"] = jsonify_extracted_text(txt)

    except:
        pass

def get_alternate_solutions(base_path, solution_filename, data):
    """
    Extracts text data from all alternate solutions folder for a given gamma

    """
    
    # List of subfolders (alternate solutions) in current directory
    alternate_solution_folders = [f.path for f in os.scandir(base_path) if f.is_dir()]

    # extracting text data from every model_fit file that is in a solution subfolder
    for idx, alt_solution in enumerate(alternate_solution_folders):
        alt_solution_path = alt_solution + solution_filename
        extract(alt_solution_path, data, data_unique_key=idx)


def get_gamma_data(base_path, solution_filename, data):
    """"
    Extracts all text data for a given gamma

    Args:
        gamma: Integer, desired gamma value
        filepath: String, file path to gamma value folder
    
    """
    ideal_solution_filepath = base_path + solution_filename
    extract(ideal_solution_filepath, data, -1)
    get_alternate_solutions(base_path, solution_filename, data)


# my_data = {}
# get_gamma_data(BASE_FILEPATH, SOLUTION_FILENAME, my_data)

# print({f"{gamma}": my_data})