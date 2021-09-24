# Author: Vivek Alamuri - Bioinformatics Programmer, OICR, Sept. 2021
import os
from zipfile import ZipFile
from PyPDF2 import PdfFileReader
from dotenv import load_dotenv
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


def set_path(gamma):
    load_dotenv()
    return (str(os.getenv("PATH_TO_DATA")) + f'{gamma}/')


def jsonify_extracted_text(path, text, data_unique_key):
    """
    Helper function for extract() to format extracted text into JSON format.

    Args:
        path: String, file path to PDF
        text: String, text extracted from PDF
        data_unique_key: Integer, a unique id each solution for a given value of gamma. -1 is the solution in the main folder.

    Returns:
        Dictionary with id, cellularity, ploidy, and sd.BAF values
    """
    
    split_data = text.split()
    
    json = {
            "id": data_unique_key,

            "path": path,
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
        path: String, file path to PDF
        data: List, variable to store extracted data
        data_unique_key: Integer, a unique id each solution for a given value of gamma. -1 is the id for solution in the main folder.
    """

    pdf = PdfFileReader(path)

        # model_fit files have one page only, hence getPage(0) 
    pageObj = pdf.getPage(0)
    try:
        # extracted text
        txt = pageObj.extractText()
        # adding json format extracted data to dictionary
        data.append(jsonify_extracted_text(path, txt, data_unique_key))

    except:
        pass

def get_alternate_solutions(base_path, solution_filename, data):
    """
    Extracts text data from all alternate solutions folder for a given gamma

    Args:
        base_path: String, file path to specified gamma folder 
            ex. PANX_1277_gammas\gammas\\300\\

        solution_filename: String, name of solution file
            ex. PANX_1277_Lv_M_WG_100-JHU-003_LCM3_model_fit.pdf

        data: List, variable to store extracted data

    """
    
    # List of subfolders (alternate solutions) in current directory
    alternate_solution_folders = [f.path for f in os.scandir(base_path) if f.is_dir()]

    # extracting text data from every model_fit file that is in a solution subfolder
    for idx, alt_solution in enumerate(alternate_solution_folders):
        alt_solution_path = alt_solution + '\\' + solution_filename
        extract(alt_solution_path, data, data_unique_key=idx)


def get_gamma_data(base_path, solution_filename, data):
    """
    Extracts all text data for a given gamma

    base_path: String, file path to specified gamma folder 
            ex. PANX_1277_gammas\gammas\\300
            
    solution_filename: String, name of solution file
        ex. PANX_1277_Lv_M_WG_100-JHU-003_LCM3_model_fit.pdf

    data: List, variable to store extracted data
    
    """
    ideal_solution_filepath = base_path + solution_filename
    extract(ideal_solution_filepath, data, -1)
    get_alternate_solutions(base_path, solution_filename, data)


#testing code
# load_dotenv()
# BASE_FILEPATH = set_path(300)
# my_data = []
# get_gamma_data(BASE_FILEPATH, str(os.getenv("SOLUTION_FILENAME")), my_data)

# print(my_data)