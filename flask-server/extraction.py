# Author: Vivek Alamuri - Bioinformatics Programmer, OICR, Sept. 2021
import os
from zipfile import ZipFile, is_zipfile
from PyPDF2 import PdfFileReader
from dotenv import load_dotenv
import re

def get_data_folders():
    load_dotenv()
    return ([(f.name) for f in os.scandir(os.getenv("MALTA_DATA_FOLDER")) if is_zipfile(f)] )


def get_gamma_options(path):
    with ZipFile(path, 'r') as f:
        folders = [info.filename for info in f.infolist() if info.is_dir()]

    filtered = []
    for folder in folders:
        match = re.findall("\d{2,4}", folder)
        filtered.append(match)

    gamma_options = set()
    for i in range(len(folders)):
        if filtered[i] != []:
            option = int(filtered[i][0])
            gamma_options.add(option)

    return sorted(gamma_options)


def set_path(gamma):
    return f"gammas/{gamma}/"


def get_solution_name(selected_folder):
    with ZipFile(os.path.join(str(os.getenv("MALTA_DATA_FOLDER")), selected_folder), 'r') as f:
        names = f.namelist()

    paths = [name for name in names if "_model_fit.pdf" in name]
    pdf_files = [path.split("/")[-1] for path in paths]

    # casting to a set to ensure that there is only one unique model_fit filename
    # casting the set to a list to easily access the desired string
    return list(set(pdf_files))[0]


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


def extract(path, data_unique_key, selected_folder, solution_filename):
    """
    Extracts text data from PDF and stores it in a dictionary for a given gamma

    Args:
        path: String, file path to PDF
        data_unique_key: Integer, a unique id each solution for a given value of gamma. -1 is the id for solution in the main folder.

    Returns:
        data: Dictionary, extracted data from one PDF file
    """
    
    with ZipFile(os.path.join(str(os.getenv("MALTA_DATA_FOLDER")), selected_folder), 'r') as f:
        # path = "gammas/200/sol3_0.44/"
        file_path = path + solution_filename
        f.extract(file_path, str(os.getenv("MALTA_DATA_FOLDER")))
    
    
    extracted_path = os.path.join(str(os.getenv("MALTA_DATA_FOLDER")), file_path)
    pdf = PdfFileReader(extracted_path)

    data = {}

        # model_fit files have one page only, hence getPage(0) 
    pageObj = pdf.getPage(0)
    try:
        # extracted text
        txt = pageObj.extractText()
        # adding json format extracted data to dictionary
        data = jsonify_extracted_text(extracted_path, txt, data_unique_key)

    except:
        pass
    
    return data


def get_alternate_solutions(gamma, selected_folder, solution_filename):
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
    with ZipFile(os.path.join(str(os.getenv("MALTA_DATA_FOLDER")), selected_folder), 'r') as f:
        subfolders = [item.filename for item in f.infolist() if item.is_dir()]

    alternate_solution_folders = [folder_name for folder_name in subfolders if "sol" in folder_name and f"/{gamma}/" in folder_name]

    alternate_solutions_data = []
    # extracting text data from every model_fit file that is in a solution subfolder
    for idx, alt_solution in enumerate(alternate_solution_folders):
        alternate_solutions_data.append(extract(alt_solution, idx, selected_folder, solution_filename))
    
    return alternate_solutions_data


def get_gamma_data(gamma, selected_folder, solution_filename):
    """
    Extracts all text data for a given gamma

    Args:
        base_path: String, file path to specified gamma folder 
                ex. PANX_1277_gammas\gammas\\300
                
        solution_filename: String, name of solution file
            ex. PANX_1277_Lv_M_WG_100-JHU-003_LCM3_model_fit.pdf

    Returns:
        data: List, extracted data from all model_fit files for a given gamma
    """
    data = []

    ideal_solution_data = extract(set_path(gamma), -1, selected_folder, solution_filename)
    data.append(ideal_solution_data)
    
    alternate_solution_data = get_alternate_solutions(gamma, selected_folder, solution_filename)
    
    for alt_sol in alternate_solution_data:
        data.append(alt_sol)

    return data




# #testing code
# BASE_FILEPATH = os.path.join(os.getenv("MALTA_DATA_FOLDER"), str(os.getenv("TEST_DATA")))
# BASE_FILEPATH = os.path.join(BASE_FILEPATH, "gammas")

# load_dotenv()
# my_data = get_gamma_data(100, str(os.getenv("TEST_DATA")), get_solution_name(str(os.getenv("TEST_DATA"))) )
# print(my_data)
